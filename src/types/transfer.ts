export type ConnectionStatus =
  | 'idle'
  | 'creating-room'
  | 'waiting'
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'failed';

export type FileStatus =
  | 'queued'
  | 'offering'
  | 'waiting_approval'
  | 'sending'
  | 'receiving'
  | 'completed'
  | 'cancelled'
  | 'rejected'
  | 'error';

export interface DeviceInfo {
  browser: string;
  os: string;
  type: 'desktop' | 'mobile' | 'tablet' | 'unknown';
  formatted: string;
}

export interface PeerInfo {
  peerId: string;
  device: DeviceInfo;
  connectedAt: number;
  rttMs?: number;
}

export interface TransferFile {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  lastModified?: number;
  totalChunks: number;
  chunksTransferred: number;
  bytesTransferred: number;
  status: FileStatus;
  direction: 'send' | 'receive';
  speedBps: number;
  etaSeconds: number;
  startTime?: number;
  endTime?: number;
  rawFile?: File;
  downloadUrl?: string;
  error?: string;
  isPaused?: boolean;
}

export interface TransferStats {
  totalFiles: number;
  completedFiles: number;
  totalBytes: number;
  bytesTransferred: number;
  currentSpeedBps: number;
}

// Signaling & WebRTC Messages
export type P2PMessage =
  | {
      type: 'handshake';
      device: DeviceInfo;
    }
  | {
      type: 'ping';
      timestamp: number;
    }
  | {
      type: 'pong';
      timestamp: number;
    }
  | {
      type: 'file-offer';
      file: {
        id: string;
        name: string;
        size: number;
        mimeType: string;
        totalChunks: number;
      };
    }
  | {
      type: 'file-accept';
      fileId: string;
    }
  | {
      type: 'file-reject';
      fileId: string;
      reason?: string;
    }
  | {
      type: 'file-chunk';
      fileId: string;
      chunkIndex: number;
      totalChunks: number;
      data: ArrayBuffer;
    }
  | {
      type: 'file-complete';
      fileId: string;
    }
  | {
      type: 'file-cancel';
      fileId: string;
    };
