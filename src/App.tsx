/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { AlertCircle, X, ShieldAlert } from 'lucide-react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TransferWorkspace } from './components/TransferWorkspace';
import { HowItWorks } from './components/HowItWorks';
import { FeaturesGrid } from './components/FeaturesGrid';
import { TechSpecs } from './components/TechSpecs';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { useTransfer } from './hooks/useTransfer';

export default function App() {
  const {
    roomCode,
    roomUrl,
    connectionStatus,
    statusMessage,
    activePeer,
    queue,
    stats,
    isHost,
    pendingIncomingFile,
    errorToast,
    dismissError,
    createRoom,
    joinRoom,
    disconnectSession,
    addFilesToSend,
    acceptIncomingFile,
    rejectIncomingFile,
    cancelTransfer,
    downloadFile,
    clearCompleted,
  } = useTransfer();

  const workspaceRef = useRef<HTMLDivElement | null>(null);

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'workspace' && workspaceRef.current) {
      workspaceRef.current.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCreateTransferFromHero = () => {
    scrollToSection('workspace');
    if (!roomCode) {
      createRoom();
    }
  };

  const handleJoinRoomFromHero = () => {
    scrollToSection('workspace');
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar */}
      <Header onNavigate={scrollToSection} />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onCreateTransfer={handleCreateTransferFromHero}
          onJoinRoom={handleJoinRoomFromHero}
        />

        {/* Transfer Workspace (Main interactive P2P Console) */}
        <div ref={workspaceRef} className="scroll-mt-20">
          <TransferWorkspace
            roomCode={roomCode}
            roomUrl={roomUrl}
            connectionStatus={connectionStatus}
            statusMessage={statusMessage}
            activePeer={activePeer}
            queue={queue}
            stats={stats}
            isHost={isHost}
            pendingIncomingFile={pendingIncomingFile}
            onCreateRoom={createRoom}
            onJoinRoom={joinRoom}
            onDisconnect={disconnectSession}
            onAddFiles={addFilesToSend}
            onAcceptIncoming={acceptIncomingFile}
            onRejectIncoming={rejectIncomingFile}
            onCancelTransfer={cancelTransfer}
            onDownloadFile={downloadFile}
            onClearCompleted={clearCompleted}
          />
        </div>

        {/* How It Works (01, 02, 03) */}
        <HowItWorks />

        {/* Features Grid (6 Cards from mockup) */}
        <FeaturesGrid />

        {/* Technology Specs (WebRTC Architecture) */}
        <TechSpecs />

        {/* FAQ Accordion */}
        <FAQ />
      </main>

      {/* Footer */}
      <Footer onNavigate={scrollToSection} />

      {/* Global Error / Recovery Toast */}
      {errorToast && (
        <aside aria-label="Notifications" className="fixed bottom-6 right-6 z-50 max-w-md w-[calc(100vw-3rem)] rounded-2xl bg-[#0f172a] border border-rose-500/40 p-4 shadow-2xl animate-in slide-in-from-bottom-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h5 className="text-sm font-semibold text-rose-200">Connection Notice</h5>
              <p className="text-xs text-rose-300/90 mt-1 leading-relaxed">{errorToast}</p>
              <div className="mt-2 text-[11px] text-slate-400 border-t border-slate-800 pt-2 space-y-0.5">
                <p>• Make sure both devices stay awake and online</p>
                <p>• Check if corporate VPN or firewall blocks WebRTC STUN</p>
                <p>• Try creating a new room code</p>
              </div>
            </div>
            <button
              onClick={dismissError}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}
