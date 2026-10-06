import { useCallback, useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ConnectionStatus,
  PeerInfo,
  TransferFile,
  TransferStats,
} from '../types/transfer';
import { generateRoomCode, getRoomUrl, normalizeRoomCode } from '../services/signaling';
import { WebRTCManager } from '../services/webrtc';
import { storageManager } from '../services/storage';
import { useSound } from './useSound';

export function useTransfer() {
  const [roomCode, setRoomCode] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('Ready to connect.');
  const [activePeer, setActivePeer] = useState<PeerInfo | null>(null);
  const [queue, setQueue] = useState<TransferFile[]>([]);
  const [pendingIncomingFile, setPendingIncomingFile] = useState<TransferFile | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  const { playConnectSound, playCompleteSound, playAlertSound } = useSound();

  const rtcManagerRef = useRef<WebRTCManager | null>(null);
  const fileObjectsMapRef = useRef<Map<string, File>>(new Map());

  // Trigger error toast with auto-dismiss
  const triggerError = useCallback((msg: string) => {
    setErrorToast(msg);
    setTimeout(() => {
      setErrorToast((prev) => (prev === msg ? null : prev));
    }, 6000);
  }, []);

  // Initialize WebRTC Manager
  useEffect(() => {
    const manager = new WebRTCManager({
      onStatusChange: (status, message) => {
        setConnectionStatus(status);
        if (message) setStatusMessage(message);
      },
      onPeerConnected: (peer) => {
        setActivePeer(peer);
        playConnectSound();
      },
      onPeerDisconnected: () => {
        setActivePeer(null);
      },
      onIncomingFileOffer: (incoming) => {
        playAlertSound();
        setPendingIncomingFile(incoming);
        setQueue((prev) => [incoming, ...prev]);
      },
      onFileAccepted: (fileId) => {
        // Start streaming chunks to receiver
        startSendingFileChunks(fileId);
      },
      onFileRejected: (fileId) => {
        setQueue((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, status: 'rejected' } : f))
        );
      },
      onFileProgress: (fileId, bytesTransferred, totalBytes, speedBps, etaSec) => {
        setQueue((prev) =>
          prev.map((f) => {
            if (f.id !== fileId) return f;
            return {
              ...f,
              bytesTransferred,
              speedBps,
              etaSeconds: etaSec,
              status: f.direction === 'receive' ? 'receiving' : 'sending',
            };
          })
        );
      },
      onFileComplete: (fileId, downloadUrl) => {
        playCompleteSound();
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#00f2fe', '#06b6d4', '#10b981'],
          });
        } catch {}

        setQueue((prev) =>
          prev.map((f) => {
            if (f.id !== fileId) return f;
            return {
              ...f,
              status: 'completed',
              bytesTransferred: f.size,
              downloadUrl: downloadUrl || f.downloadUrl,
              endTime: Date.now(),
            };
          })
        );
      },
      onFileCancelled: (fileId) => {
        setQueue((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, status: 'cancelled' } : f))
        );
      },
      onError: (err) => {
        triggerError(err);
      },
    });

    rtcManagerRef.current = manager;

    // Check if URL contains ?room=LD-XXXX
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const roomParam = params.get('room');
      if (roomParam) {
        const clean = normalizeRoomCode(roomParam);
        setRoomCode(clean);
        // Auto join
        manager.joinRoom(clean);
        setIsHost(false);
      }
    }

    return () => {
      manager.cleanup();
    };
  }, [playConnectSound, playCompleteSound, playAlertSound, triggerError]);

  // Host: Create Room
  const createRoom = useCallback(async () => {
    const code = generateRoomCode();
    setRoomCode(code);
    setIsHost(true);
    if (rtcManagerRef.current) {
      await rtcManagerRef.current.createRoom(code);
    }
  }, []);

  // Client: Join Room
  const joinRoom = useCallback(async (codeToJoin: string) => {
    const clean = normalizeRoomCode(codeToJoin);
    setRoomCode(clean);
    setIsHost(false);
    if (rtcManagerRef.current) {
      await rtcManagerRef.current.joinRoom(clean);
    }
  }, []);

  // Disconnect / Reset session
  const disconnectSession = useCallback(() => {
    if (rtcManagerRef.current) {
      rtcManagerRef.current.cleanup();
    }
    setConnectionStatus('idle');
    setStatusMessage('Session ended.');
    setActivePeer(null);
    setPendingIncomingFile(null);
  }, []);

  // Offer file to peer
  const addFilesToSend = useCallback(
    (files: File[]) => {
      if (!files.length) return;
      if (!activePeer || connectionStatus !== 'connected') {
        triggerError('Please connect to a device before sending files.');
        return;
      }

      files.forEach((file) => {
        const fileId = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
        fileObjectsMapRef.current.set(fileId, file);

        const newFileItem: TransferFile = {
          id: fileId,
          name: file.name,
          size: file.size,
          mimeType: file.type || 'application/octet-stream',
          lastModified: file.lastModified,
          totalChunks: Math.ceil(file.size / (64 * 1024)),
          chunksTransferred: 0,
          bytesTransferred: 0,
          status: 'offering',
          direction: 'send',
          speedBps: 0,
          etaSeconds: 0,
          rawFile: file,
          startTime: Date.now(),
        };

        setQueue((prev) => [newFileItem, ...prev]);

        // Send offer to peer
        rtcManagerRef.current?.sendMessage({
          type: 'file-offer',
          file: {
            id: newFileItem.id,
            name: newFileItem.name,
            size: newFileItem.size,
            mimeType: newFileItem.mimeType,
            totalChunks: newFileItem.totalChunks,
          },
        });
      });
    },
    [activePeer, connectionStatus, triggerError]
  );

  // Send chunks once accepted
  const startSendingFileChunks = useCallback(async (fileId: string) => {
    const rawFile = fileObjectsMapRef.current.get(fileId);
    if (!rawFile || !rtcManagerRef.current) return;

    setQueue((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, status: 'sending', startTime: Date.now() } : f))
    );

    try {
      const fileItem = queue.find((f) => f.id === fileId) || {
        id: fileId,
        name: rawFile.name,
        size: rawFile.size,
        mimeType: rawFile.type,
        totalChunks: Math.ceil(rawFile.size / (64 * 1024)),
        chunksTransferred: 0,
        bytesTransferred: 0,
        status: 'sending' as const,
        direction: 'send' as const,
        speedBps: 0,
        etaSeconds: 0,
      };

      await rtcManagerRef.current.sendFile(fileItem, rawFile, (bytes, speed, eta) => {
        setQueue((prev) =>
          prev.map((f) => {
            if (f.id !== fileId) return f;
            return {
              ...f,
              bytesTransferred: bytes,
              speedBps: speed,
              etaSeconds: eta,
            };
          })
        );
      });
    } catch (err) {
      console.error('Send error:', err);
      setQueue((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, status: 'error', error: 'Transfer failed' } : f))
      );
    }
  }, [queue]);

  // Accept incoming file
  const acceptIncomingFile = useCallback((fileId: string) => {
    setPendingIncomingFile((prev) => (prev?.id === fileId ? null : prev));
    setQueue((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, status: 'receiving' } : f))
    );
    rtcManagerRef.current?.acceptFile(fileId);
  }, []);

  // Reject incoming file
  const rejectIncomingFile = useCallback((fileId: string) => {
    setPendingIncomingFile((prev) => (prev?.id === fileId ? null : prev));
    setQueue((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, status: 'rejected' } : f))
    );
    rtcManagerRef.current?.rejectFile(fileId, 'Declined by recipient');
  }, []);

  // Cancel file
  const cancelTransfer = useCallback((fileId: string) => {
    rtcManagerRef.current?.cancelFile(fileId);
    setQueue((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, status: 'cancelled' } : f))
    );
  }, []);

  // Download received file
  const downloadFile = useCallback((file: TransferFile) => {
    if (file.downloadUrl) {
      storageManager.downloadBlob(file.downloadUrl, file.name);
    }
  }, []);

  // Clear completed items
  const clearCompleted = useCallback(() => {
    setQueue((prev) =>
      prev.filter((f) => f.status !== 'completed' && f.status !== 'cancelled' && f.status !== 'rejected')
    );
  }, []);

  // Queue stats
  const stats: TransferStats = {
    totalFiles: queue.length,
    completedFiles: queue.filter((f) => f.status === 'completed').length,
    totalBytes: queue.reduce((acc, f) => acc + f.size, 0),
    bytesTransferred: queue.reduce((acc, f) => acc + f.bytesTransferred, 0),
    currentSpeedBps: queue
      .filter((f) => f.status === 'sending' || f.status === 'receiving')
      .reduce((acc, f) => acc + f.speedBps, 0),
  };

  return {
    roomCode,
    roomUrl: roomCode ? getRoomUrl(roomCode) : '',
    connectionStatus,
    statusMessage,
    activePeer,
    queue,
    stats,
    isHost,
    pendingIncomingFile,
    errorToast,
    dismissError: () => setErrorToast(null),
    createRoom,
    joinRoom,
    disconnectSession,
    addFilesToSend,
    acceptIncomingFile,
    rejectIncomingFile,
    cancelTransfer,
    downloadFile,
    clearCompleted,
  };
}
