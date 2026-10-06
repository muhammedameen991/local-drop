import { DataConnection, Peer } from 'peerjs';
import {
  ConnectionStatus,
  DeviceInfo,
  P2PMessage,
  PeerInfo,
  TransferFile,
} from '../types/transfer';
import { getLocalDeviceInfo } from './device';
import { createPeerInstance } from './signaling';
import { storageManager } from './storage';

export const CHUNK_SIZE = 64 * 1024; // 64 KB chunks
export const BUFFERED_AMOUNT_THRESHOLD = 64 * 1024;
export const MAX_BUFFERED_AMOUNT = 256 * 1024; // 256 KB pause threshold

export interface WebRTCEvents {
  onStatusChange: (status: ConnectionStatus, message?: string) => void;
  onPeerConnected: (peer: PeerInfo) => void;
  onPeerDisconnected: () => void;
  onIncomingFileOffer: (file: TransferFile) => void;
  onFileAccepted: (fileId: string) => void;
  onFileRejected: (fileId: string, reason?: string) => void;
  onFileProgress: (
    fileId: string,
    bytesTransferred: number,
    totalBytes: number,
    speedBps: number,
    etaSec: number
  ) => void;
  onFileComplete: (fileId: string, downloadUrl?: string) => void;
  onFileCancelled: (fileId: string) => void;
  onError: (err: string) => void;
}

export class WebRTCManager {
  private peer: Peer | null = null;
  private connection: DataConnection | null = null;
  private broadcastChannel: BroadcastChannel | null = null;
  private isHost = false;
  private roomCode = '';
  private events: WebRTCEvents;
  private localDevice: DeviceInfo;
  private activePeer: PeerInfo | null = null;
  private cancelledFiles = new Set<string>();
  private pingInterval: number | null = null;

  constructor(events: WebRTCEvents) {
    this.events = events;
    this.localDevice = getLocalDeviceInfo();
  }

  public getRoomCode(): string {
    return this.roomCode;
  }

  public getPeerInfo(): PeerInfo | null {
    return this.activePeer;
  }

  // --- HOST ROOM CREATION ---
  public async createRoom(roomCode: string): Promise<void> {
    this.cleanup();
    this.roomCode = roomCode.toUpperCase();
    this.isHost = true;
    this.events.onStatusChange('creating-room', 'Initializing P2P session...');

    const hostPeerId = `localdrop-v1-${this.roomCode.toLowerCase()}`;

    try {
      this.peer = createPeerInstance(hostPeerId);

      this.peer.on('open', (id) => {
        this.events.onStatusChange(
          'waiting',
          'Waiting for a device to join your room...'
        );
        this.setupBroadcastChannel(this.roomCode);
      });

      this.peer.on('connection', (conn) => {
        // Only accept one active transfer peer at a time
        if (this.connection) {
          conn.close();
          return;
        }
        this.setupDataConnection(conn);
      });

      this.peer.on('error', (err) => {
        if (err.type === 'unavailable-id') {
          this.events.onError(
            'Room code is currently in use. Please generate a new room code.'
          );
        } else {
          this.events.onError(`P2P Network error: ${err.message || err.type}`);
        }
        this.events.onStatusChange('failed', 'Connection error encountered.');
      });

      this.peer.on('disconnected', () => {
        // Try reconnecting signaling
        if (this.peer && !this.peer.destroyed) {
          this.peer.reconnect();
        }
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.events.onError(`Failed to create room: ${msg}`);
      this.events.onStatusChange('failed', msg);
    }
  }

  // --- CLIENT JOIN ROOM ---
  public async joinRoom(roomCode: string): Promise<void> {
    this.cleanup();
    this.roomCode = roomCode.toUpperCase();
    this.isHost = false;
    this.events.onStatusChange('connecting', `Connecting to room ${this.roomCode}...`);

    const targetHostPeerId = `localdrop-v1-${this.roomCode.toLowerCase()}`;

    try {
      this.peer = createPeerInstance(); // Random ID for joiner

      this.peer.on('open', () => {
        if (!this.peer) return;
        const conn = this.peer.connect(targetHostPeerId, {
          reliable: true,
          serialization: 'binary',
        });
        this.setupDataConnection(conn);
        this.setupBroadcastChannel(this.roomCode);
      });

      this.peer.on('error', (err) => {
        if (err.type === 'peer-unavailable') {
          // If PeerJS peer is not available, check if local broadcast is available
          this.events.onError(
            `Room ${this.roomCode} was not found. Please verify the code or make sure the host is waiting.`
          );
        } else {
          this.events.onError(`Connection failed: ${err.message || err.type}`);
        }
        this.events.onStatusChange('failed', 'Unable to establish peer connection.');
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.events.onError(`Failed to join room: ${msg}`);
      this.events.onStatusChange('failed', msg);
    }
  }

  // --- SAME BROWSER TABS / LOCAL TESTING BROADCAST CHANNEL ---
  private setupBroadcastChannel(roomCode: string) {
    if (typeof window === 'undefined' || !window.BroadcastChannel) return;
    try {
      this.broadcastChannel = new BroadcastChannel(`localdrop-bc-${roomCode}`);
      this.broadcastChannel.onmessage = (event) => {
        const msg = event.data;
        if (!msg) return;

        // If not connected via WebRTC yet, can signal discovery
        if (msg.type === 'bc-ping' && this.isHost && !this.connection) {
          this.broadcastChannel?.postMessage({
            type: 'bc-pong',
            device: this.localDevice,
          });
        }
      };

      if (!this.isHost) {
        this.broadcastChannel.postMessage({
          type: 'bc-ping',
          device: this.localDevice,
        });
      }
    } catch {
      // BroadcastChannel optional fallback
    }
  }

  // --- DATA CONNECTION HANDLING ---
  private setupDataConnection(conn: DataConnection) {
    this.connection = conn;
    this.events.onStatusChange('connecting', 'Establishing direct DataChannel...');

    conn.on('open', () => {
      // Send handshake
      this.sendMessage({
        type: 'handshake',
        device: this.localDevice,
      });

      // Start ping/latency timer
      this.startPingTimer();

      // Configure backpressure threshold if native channel is accessible
      const nativeDC = (conn as unknown as { _dc?: RTCDataChannel })._dc;
      if (nativeDC) {
        nativeDC.bufferedAmountLowThreshold = BUFFERED_AMOUNT_THRESHOLD;
      }
    });

    conn.on('data', (data) => {
      this.handleIncomingData(data as P2PMessage | ArrayBuffer);
    });

    conn.on('close', () => {
      this.handleDisconnect('Peer closed connection');
    });

    conn.on('error', (err) => {
      this.events.onError(`Peer channel error: ${err.message || 'unknown'}`);
      this.handleDisconnect('DataChannel error');
    });
  }

  private handleDisconnect(reason: string) {
    this.stopPingTimer();
    this.activePeer = null;
    this.connection = null;
    this.events.onPeerDisconnected();
    this.events.onStatusChange(
      'disconnected',
      `Device disconnected (${reason}). You can reconnect or create a new room.`
    );
  }

  private startPingTimer() {
    this.stopPingTimer();
    this.pingInterval = window.setInterval(() => {
      if (this.connection && this.connection.open) {
        this.sendMessage({
          type: 'ping',
          timestamp: Date.now(),
        });
      }
    }, 5000);
  }

  private stopPingTimer() {
    if (this.pingInterval !== null) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  public sendMessage(msg: P2PMessage) {
    if (!this.connection || !this.connection.open) return;
    try {
      this.connection.send(msg);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  }

  // --- PROTOCOL MESSAGE DISPATCHER ---
  private handleIncomingData(data: P2PMessage | ArrayBuffer) {
    if (typeof data === 'object' && !(data instanceof ArrayBuffer)) {
      const msg = data as P2PMessage;

      switch (msg.type) {
        case 'handshake': {
          this.activePeer = {
            peerId: this.connection?.peer || 'remote-peer',
            device: msg.device,
            connectedAt: Date.now(),
          };
          this.events.onStatusChange(
            'connected',
            `Connected directly to ${msg.device.formatted}.`
          );
          this.events.onPeerConnected(this.activePeer);
          break;
        }

        case 'ping': {
          this.sendMessage({
            type: 'pong',
            timestamp: msg.timestamp,
          });
          break;
        }

        case 'pong': {
          if (this.activePeer) {
            this.activePeer.rttMs = Math.max(1, Date.now() - msg.timestamp);
          }
          break;
        }

        case 'file-offer': {
          const incoming: TransferFile = {
            id: msg.file.id,
            name: msg.file.name,
            size: msg.file.size,
            mimeType: msg.file.mimeType,
            totalChunks: msg.file.totalChunks,
            chunksTransferred: 0,
            bytesTransferred: 0,
            status: 'waiting_approval',
            direction: 'receive',
            speedBps: 0,
            etaSeconds: 0,
          };
          storageManager.initAssembly(
            incoming.id,
            incoming.name,
            incoming.size,
            incoming.mimeType,
            incoming.totalChunks
          );
          this.events.onIncomingFileOffer(incoming);
          break;
        }

        case 'file-accept': {
          this.events.onFileAccepted(msg.fileId);
          break;
        }

        case 'file-reject': {
          this.events.onFileRejected(msg.fileId, msg.reason);
          break;
        }

        case 'file-chunk': {
          this.handleReceivedChunk(
            msg.fileId,
            msg.chunkIndex,
            msg.totalChunks,
            msg.data
          );
          break;
        }

        case 'file-complete': {
          this.handleFileComplete(msg.fileId);
          break;
        }

        case 'file-cancel': {
          this.cancelledFiles.add(msg.fileId);
          storageManager.cancelAssembly(msg.fileId);
          this.events.onFileCancelled(msg.fileId);
          break;
        }
      }
    }
  }

  // --- CHUNK RECEPTION & PROGRESS ---
  private receiveStats = new Map<
    string,
    { bytes: number; lastTime: number; lastBytes: number; speed: number }
  >();

  private handleReceivedChunk(
    fileId: string,
    index: number,
    totalChunks: number,
    chunkData: ArrayBuffer
  ) {
    if (this.cancelledFiles.has(fileId)) return;

    try {
      const { isComplete } = storageManager.addChunk(fileId, index, chunkData);

      const now = performance.now();
      let stat = this.receiveStats.get(fileId);
      if (!stat) {
        stat = { bytes: 0, lastTime: now, lastBytes: 0, speed: 0 };
        this.receiveStats.set(fileId, stat);
      }

      stat.bytes += chunkData.byteLength;

      // Update speed & ETA every 300ms
      const timeDiff = (now - stat.lastTime) / 1000;
      if (timeDiff >= 0.3) {
        const bytesDiff = stat.bytes - stat.lastBytes;
        stat.speed = bytesDiff / timeDiff;
        stat.lastTime = now;
        stat.lastBytes = stat.bytes;
      }

      // Find assembly size
      const assembly = (storageManager as unknown as { activeAssemblies: Map<string, { size: number }> })
        .activeAssemblies?.get(fileId);
      const totalSize = assembly ? assembly.size : stat.bytes;
      const remainingBytes = Math.max(0, totalSize - stat.bytes);
      const eta = stat.speed > 0 ? remainingBytes / stat.speed : 0;

      this.events.onFileProgress(fileId, stat.bytes, totalSize, stat.speed, eta);

      if (isComplete) {
        this.handleFileComplete(fileId);
      }
    } catch (err) {
      console.error('Error handling chunk:', err);
    }
  }

  private handleFileComplete(fileId: string) {
    try {
      const { url } = storageManager.finalizeAssembly(fileId);
      this.receiveStats.delete(fileId);
      this.events.onFileComplete(fileId, url);
    } catch {
      this.events.onFileComplete(fileId);
    }
  }

  // --- SENDING FILES WITH FLOW CONTROL & CHUNKING ---
  public async sendFile(
    fileItem: TransferFile,
    fileObj: File,
    onProgressUpdate: (bytes: number, speed: number, eta: number) => void
  ): Promise<void> {
    if (!this.connection || !this.connection.open) {
      throw new Error('No active peer connection');
    }

    const nativeDC = (this.connection as unknown as { _dc?: RTCDataChannel })._dc;
    const totalBytes = fileObj.size;
    const totalChunks = Math.ceil(totalBytes / CHUNK_SIZE);
    let bytesSent = 0;
    let lastTime = performance.now();
    let lastBytesSent = 0;
    let currentSpeed = 0;

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      if (this.cancelledFiles.has(fileItem.id)) {
        this.sendMessage({ type: 'file-cancel', fileId: fileItem.id });
        return;
      }

      // Check backpressure on native RTCDataChannel
      if (nativeDC && nativeDC.bufferedAmount > MAX_BUFFERED_AMOUNT) {
        await this.waitForBufferLow(nativeDC);
      }

      const start = chunkIndex * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, totalBytes);
      const slice = fileObj.slice(start, end);
      const chunkBuffer = await slice.arrayBuffer();

      // Send chunk message
      this.sendMessage({
        type: 'file-chunk',
        fileId: fileItem.id,
        chunkIndex,
        totalChunks,
        data: chunkBuffer,
      });

      bytesSent += chunkBuffer.byteLength;

      // Speed and ETA calculation
      const now = performance.now();
      const timeElapsed = (now - lastTime) / 1000;
      if (timeElapsed >= 0.25 || bytesSent === totalBytes) {
        const deltaBytes = bytesSent - lastBytesSent;
        currentSpeed = deltaBytes / Math.max(0.001, timeElapsed);
        lastTime = now;
        lastBytesSent = bytesSent;

        const remainingBytes = totalBytes - bytesSent;
        const eta = currentSpeed > 0 ? remainingBytes / currentSpeed : 0;
        onProgressUpdate(bytesSent, currentSpeed, eta);
      }
    }

    // Finished sending chunks
    this.sendMessage({
      type: 'file-complete',
      fileId: fileItem.id,
    });
  }

  private waitForBufferLow(dc: RTCDataChannel): Promise<void> {
    return new Promise((resolve) => {
      const onLow = () => {
        dc.removeEventListener('bufferedamountlow', onLow);
        resolve();
      };
      dc.addEventListener('bufferedamountlow', onLow);

      // Fallback timeout in case event is missed
      setTimeout(() => {
        dc.removeEventListener('bufferedamountlow', onLow);
        resolve();
      }, 500);
    });
  }

  public cancelFile(fileId: string) {
    this.cancelledFiles.add(fileId);
    this.sendMessage({ type: 'file-cancel', fileId });
    this.events.onFileCancelled(fileId);
  }

  public acceptFile(fileId: string) {
    this.sendMessage({ type: 'file-accept', fileId });
  }

  public rejectFile(fileId: string, reason?: string) {
    this.sendMessage({ type: 'file-reject', fileId, reason });
  }

  public cleanup() {
    this.stopPingTimer();
    if (this.connection) {
      try {
        this.connection.close();
      } catch {}
      this.connection = null;
    }
    if (this.peer) {
      try {
        this.peer.destroy();
      } catch {}
      this.peer = null;
    }
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.close();
      } catch {}
      this.broadcastChannel = null;
    }
    this.activePeer = null;
    this.cancelledFiles.clear();
    this.receiveStats.clear();
  }
}
