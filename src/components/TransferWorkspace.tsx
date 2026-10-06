import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import {
  Copy,
  Check,
  Share2,
  QrCode,
  PlusCircle,
  LogIn,
  Sliders,
  UploadCloud,
  File as FileIcon,
  CheckCircle2,
  XCircle,
  Download,
  X,
  Laptop,
  Smartphone,
  RefreshCw,
  Clock,
  ArrowUpRight,
  Shield,
  Wifi,
  Sparkles,
} from 'lucide-react';
import { PeerInfo, TransferFile, TransferStats, ConnectionStatus } from '../types/transfer';
import { formatBytes, formatEta, formatSpeed } from '../services/device';
import { QRScannerModal } from './QRScannerModal';

interface TransferWorkspaceProps {
  roomCode: string;
  roomUrl: string;
  connectionStatus: ConnectionStatus;
  statusMessage: string;
  activePeer: PeerInfo | null;
  queue: TransferFile[];
  stats: TransferStats;
  isHost: boolean;
  pendingIncomingFile: TransferFile | null;
  onCreateRoom: () => void;
  onJoinRoom: (code: string) => void;
  onDisconnect: () => void;
  onAddFiles: (files: File[]) => void;
  onAcceptIncoming: (fileId: string) => void;
  onRejectIncoming: (fileId: string) => void;
  onCancelTransfer: (fileId: string) => void;
  onDownloadFile: (file: TransferFile) => void;
  onClearCompleted: () => void;
}

export const TransferWorkspace: React.FC<TransferWorkspaceProps> = ({
  roomCode,
  roomUrl,
  connectionStatus,
  statusMessage,
  activePeer,
  queue,
  stats,
  isHost,
  pendingIncomingFile,
  onCreateRoom,
  onJoinRoom,
  onDisconnect,
  onAddFiles,
  onAcceptIncoming,
  onRejectIncoming,
  onCancelTransfer,
  onDownloadFile,
  onClearCompleted,
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'join' | 'settings'>('create');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Auto-switch tabs based on room state
  useEffect(() => {
    if (roomCode && isHost) {
      setActiveTab('create');
    }
  }, [roomCode, isHost]);

  // Generate QR Code image when room changes
  useEffect(() => {
    if (!roomUrl) return;
    QRCode.toDataURL(roomUrl, {
      width: 320,
      margin: 1.5,
      color: {
        dark: '#070b14',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR code generation failed:', err));
  }, [roomUrl]);

  const handleCopyLink = async () => {
    if (!roomUrl) return;
    try {
      await navigator.clipboard.writeText(roomUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleCopyCode = async () => {
    if (!roomCode) return;
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {}
  };

  const handleShare = async () => {
    if (!roomUrl) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join LocalDrop Transfer',
          text: `Join my peer-to-peer file transfer room: ${roomCode}`,
          url: roomUrl,
        });
      } catch {}
    } else {
      handleCopyLink();
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      onAddFiles(filesArray);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      onAddFiles(filesArray);
      e.target.value = ''; // Reset
    }
  };

  return (
    <section id="workspace" className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Main Glassmorphic Workspace Container */}
      <div className="relative rounded-2xl sm:rounded-3xl glass-panel-glow overflow-hidden">
        
        {/* Window Top Bar (Mac OS styled controls + Title) */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-cyan-500/15 bg-slate-900/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="h-4 w-px bg-slate-700/60 mx-1 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                LocalDrop Transfer Console
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activePeer ? (
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Connected to {activePeer.device.formatted}</span>
                {activePeer.rttMs && (
                  <span className="text-[10px] text-emerald-400/70 border-l border-emerald-500/30 pl-1.5">
                    {activePeer.rttMs}ms
                  </span>
                )}
              </div>
            ) : roomCode ? (
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>Room {roomCode}</span>
              </div>
            ) : (
              <span className="text-xs text-slate-400">P2P Ready</span>
            )}
          </div>
        </div>

        {/* Workspace Body Grid: Left Navigation & Right Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          
          {/* Left Sidebar Navigation */}
          <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-cyan-500/10 bg-slate-950/40 p-4 flex flex-col justify-between">
            <div className="space-y-1.5">
              <button
                onClick={() => {
                  setActiveTab('create');
                  if (!roomCode) onCreateRoom();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer ${
                  activeTab === 'create'
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,242,254,0.1)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <PlusCircle className="w-4 h-4 text-cyan-400" />
                <span>Create Room</span>
              </button>

              <button
                onClick={() => setActiveTab('join')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer ${
                  activeTab === 'join'
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,242,254,0.1)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <LogIn className="w-4 h-4 text-cyan-400" />
                <span>Join Room</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,242,254,0.1)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Settings</span>
              </button>
            </div>

            {/* Quick Session Status / Reset */}
            <div className="mt-6 pt-4 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Network Protocol</span>
                <span className="text-cyan-400 font-mono font-bold">WebRTC</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                <span>Encryption</span>
                <span className="text-emerald-400 font-mono font-medium">DTLS/SRTP</span>
              </div>
              {roomCode && (
                <button
                  onClick={onDisconnect}
                  className="w-full py-2 px-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 text-xs font-medium transition cursor-pointer"
                >
                  End Current Session
                </button>
              )}
            </div>
          </div>

          {/* Right Main Content Area */}
          <div className="lg:col-span-9 p-6 sm:p-8 flex flex-col justify-between">
            
            {/* View 1: Create Room / Room Active */}
            {activeTab === 'create' && (
              <div className="space-y-6">
                {!roomCode ? (
                  <div className="text-center py-16 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5 shadow-[0_0_20px_rgba(0,242,254,0.2)]">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Start a New Transfer</h3>
                    <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
                      Generate a secure, temporary transfer room with a QR code. Your files travel directly between devices with zero cloud uploads.
                    </p>
                    <button
                      onClick={onCreateRoom}
                      className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:brightness-110 active:scale-95 transition cursor-pointer"
                    >
                      Generate Room & QR Code
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Header: Your Transfer Room + Active Badge */}
                    <div className="text-center">
                      <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">Your Transfer Room</p>
                      <div className="mt-1 flex items-center justify-center gap-3">
                        <span className="text-3xl sm:text-4xl font-black tracking-wider text-white font-mono">
                          {roomCode}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                          Active
                        </span>
                      </div>
                    </div>

                    {/* QR Code Card or Active Transfer Zone */}
                    {!activePeer ? (
                      <div className="flex flex-col items-center justify-center">
                        <div className="p-4 rounded-2xl bg-white shadow-2xl border border-cyan-500/30 transform hover:scale-[1.02] transition duration-300">
                          {qrDataUrl ? (
                            <img
                              src={qrDataUrl}
                              alt={`QR Code for room ${roomCode}`}
                              className="w-48 h-48 sm:w-56 sm:h-56 rounded-lg"
                            />
                          ) : (
                            <div className="w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center bg-slate-100 rounded-lg">
                              <RefreshCw className="w-8 h-8 text-cyan-600 animate-spin" />
                            </div>
                          )}
                        </div>
                        <p className="mt-4 text-xs sm:text-sm text-slate-300 font-medium">
                          Scan this QR code with your phone
                        </p>

                        <div className="flex items-center gap-3 mt-4">
                          <button
                            onClick={handleCopyLink}
                            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-cyan-500/40 text-slate-200 text-xs font-medium hover:text-white transition cursor-pointer"
                          >
                            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                            <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
                          </button>

                          <button
                            onClick={handleCopyCode}
                            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-cyan-500/40 text-slate-200 text-xs font-medium hover:text-white transition cursor-pointer"
                          >
                            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                            <span>{copiedCode ? 'Code Copied!' : 'Copy Code'}</span>
                          </button>

                          <button
                            onClick={handleShare}
                            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-cyan-500/40 text-slate-200 text-xs font-medium hover:text-white transition cursor-pointer"
                          >
                            <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Share</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Connected View: Drag & Drop Zone + File Actions */
                      <div className="space-y-6">
                        {/* Drag and Drop Zone */}
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragOver(true);
                          }}
                          onDragLeave={() => setIsDragOver(false)}
                          onDrop={handleFileDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center transition cursor-pointer flex flex-col items-center justify-center ${
                            isDragOver
                              ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_30px_rgba(0,242,254,0.25)]'
                              : 'border-cyan-500/30 hover:border-cyan-400/60 bg-slate-900/30 hover:bg-slate-900/50'
                          }`}
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileInputChange}
                          />
                          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 shadow-[0_0_15px_rgba(0,242,254,0.15)]">
                            <UploadCloud className="w-7 h-7" />
                          </div>
                          <h4 className="text-base font-bold text-white">
                            {isDragOver ? 'Drop files to send directly' : 'Drag & drop files here'}
                          </h4>
                          <p className="text-xs text-cyan-400 mt-1 font-medium">or click to browse from device</p>
                          <p className="text-[11px] text-slate-400 mt-2">
                            Supports any file size, photos, videos, documents, archives.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* View 2: Join Room */}
            {activeTab === 'join' && (
              <div className="max-w-md mx-auto py-8 w-full">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white">Join Transfer</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Enter the room code shown on the host device or scan its QR code.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Room Code
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. LD-7K4P"
                      value={joinCodeInput}
                      onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                      className="w-full px-4 py-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-white font-mono text-center text-lg tracking-widest focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition uppercase"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (joinCodeInput.trim()) {
                        onJoinRoom(joinCodeInput.trim());
                      }
                    }}
                    disabled={!joinCodeInput.trim()}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    Join Room
                  </button>

                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-slate-800" />
                    <span className="flex-shrink mx-4 text-xs text-slate-500 font-medium uppercase">Or scan QR code</span>
                    <div className="flex-grow border-t border-slate-800" />
                  </div>

                  <button
                    onClick={() => setIsScannerOpen(true)}
                    className="w-full py-3.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition cursor-pointer"
                  >
                    <QrCode className="w-5 h-5 text-cyan-400" />
                    <span>Scan QR code from other device</span>
                  </button>
                </div>
              </div>
            )}

            {/* View 3: Settings & Diagnostics */}
            {activeTab === 'settings' && (
              <div className="space-y-6 max-w-xl mx-auto py-4">
                <h3 className="text-xl font-bold text-white mb-4">Transfer & Network Settings</h3>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">Direct WebRTC DataChannel</p>
                      <p className="text-xs text-slate-400">Transfers bypass cloud storage completely.</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">Enabled</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">Dynamic Chunk Size</p>
                      <p className="text-xs text-slate-400">Adaptive 64 KB slices with backpressure flow control.</p>
                    </div>
                    <span className="text-xs font-mono text-cyan-400">64 KB</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">Public STUN Servers</p>
                      <p className="text-xs text-slate-400">Standard NAT traversal (Google & Twilio STUN).</p>
                    </div>
                    <span className="text-xs font-mono text-slate-300">4 Servers</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">Auto Sound Effects</p>
                      <p className="text-xs text-slate-400">Web Audio synthesis for connection and completion alerts.</p>
                    </div>
                    <span className="text-xs text-emerald-400 font-semibold">Active</span>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Status Notification Bar */}
            <div className="mt-8 pt-4 border-t border-cyan-500/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-center sm:text-left">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse flex-shrink-0" />
                <span>{statusMessage}</span>
              </div>
              <div className="text-[11px] text-slate-500">
                LocalDrop v2.4 • Private & Serverless
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Transfer Queue Section (Always visible below workspace when items exist) */}
      {queue.length > 0 && (
        <div className="mt-8 rounded-2xl glass-panel p-6 border border-cyan-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Transfer Queue</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono">
                  {queue.length}
                </span>
              </h3>
              {stats.currentSpeedBps > 0 && (
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{formatSpeed(stats.currentSpeedBps)}</span>
                </div>
              )}
            </div>

            <button
              onClick={onClearCompleted}
              className="text-xs text-slate-400 hover:text-white transition cursor-pointer"
            >
              Clear Completed
            </button>
          </div>

          <div className="space-y-3">
            {queue.map((file) => {
              const progress = Math.min(
                100,
                file.size > 0 ? (file.bytesTransferred / file.size) * 100 : 0
              );

              return (
                <div
                  key={file.id}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/30 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
                      {file.status === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : file.status === 'error' || file.status === 'rejected' ? (
                        <XCircle className="w-5 h-5 text-rose-400" />
                      ) : (
                        <FileIcon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate max-w-xs sm:max-w-md">
                        {file.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                        <span>{formatBytes(file.size)}</span>
                        <span>•</span>
                        <span className="capitalize">{file.direction}ing</span>
                        {file.status === 'sending' || file.status === 'receiving' ? (
                          <>
                            <span>•</span>
                            <span className="text-cyan-400">{formatSpeed(file.speedBps)}</span>
                            <span>•</span>
                            <span>ETA: {formatEta(file.etaSeconds)}</span>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar & Actions */}
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="flex-1 sm:w-48">
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>
                          {file.status === 'completed'
                            ? 'Complete'
                            : file.status === 'rejected'
                            ? 'Rejected'
                            : `${Math.round(progress)}%`}
                        </span>
                        <span>
                          {formatBytes(file.bytesTransferred)} / {formatBytes(file.size)}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-200 ${
                            file.status === 'completed'
                              ? 'bg-emerald-400'
                              : file.status === 'rejected' || file.status === 'error'
                              ? 'bg-rose-500'
                              : 'bg-gradient-to-r from-cyan-400 to-teal-400'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {file.status === 'completed' && file.downloadUrl && (
                        <button
                          onClick={() => onDownloadFile(file)}
                          className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition cursor-pointer"
                          title="Download file"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}

                      {(file.status === 'sending' || file.status === 'receiving') && (
                        <button
                          onClick={() => onCancelTransfer(file.id)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition cursor-pointer"
                          title="Cancel transfer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Incoming File Approval Modal */}
      {pendingIncomingFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-[#0b1220] border border-cyan-400/40 p-6 shadow-[0_0_40px_rgba(0,242,254,0.3)] text-center relative">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-4 animate-bounce">
              <Download className="w-7 h-7" />
            </div>

            <p className="text-xs uppercase font-semibold tracking-wider text-cyan-400">Incoming file</p>
            <h4 className="text-lg font-bold text-white mt-1 truncate px-2">
              {pendingIncomingFile.name}
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              {formatBytes(pendingIncomingFile.size)}
            </p>

            <div className="mt-6 flex flex-col gap-2.5">
              <button
                onClick={() => onAcceptIncoming(pendingIncomingFile.id)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-bold text-sm shadow-lg hover:brightness-110 active:scale-95 transition cursor-pointer"
              >
                Accept File
              </button>
              <button
                onClick={() => onRejectIncoming(pendingIncomingFile.id)}
                className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 font-semibold text-xs transition cursor-pointer"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Camera QR Scanner Modal */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={(scannedRoomCode) => {
          setIsScannerOpen(false);
          setJoinCodeInput(scannedRoomCode);
          onJoinRoom(scannedRoomCode);
        }}
      />
    </section>
  );
};
