import React from 'react';
import { Cpu, Lock, Network, Zap, Layers, RefreshCw } from 'lucide-react';

export const TechSpecs: React.FC = () => {
  return (
    <section id="technology" className="relative py-16 sm:py-24 border-t border-cyan-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-left mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-950/30 text-cyan-400 text-xs font-mono font-medium mb-3">
            <span>Powered by WebRTC & Web Crypto</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Under the Hood: Direct P2P Architecture
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl">
            LocalDrop utilizes modern browser-native primitives to create zero-knowledge, encrypted peer-to-peer data pipes.
          </p>
        </div>

        {/* Architecture Visual Diagram */}
        <div className="rounded-2xl glass-panel-glow p-8 sm:p-10 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center">
            
            {/* Sender Node */}
            <div className="flex flex-col items-center p-6 rounded-2xl bg-slate-900/60 border border-cyan-500/30">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 shadow-[0_0_20px_rgba(0,242,254,0.2)]">
                <Cpu className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-white">Device A (Sender)</h4>
              <p className="text-xs text-slate-400 mt-1">Chunked ArrayBuffer streaming</p>
              <span className="mt-3 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 text-[10px] font-mono">
                Backpressure: 256 KB
              </span>
            </div>

            {/* Direct WebRTC Pipe in the Center */}
            <div className="flex flex-col items-center justify-center py-4">
              <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>WebRTC DataChannel</span>
              </div>
              <div className="relative w-full flex items-center justify-center">
                <div className="w-full h-1 bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-500 rounded-full shadow-[0_0_15px_rgba(0,242,254,0.5)]" />
                <div className="absolute w-8 h-8 rounded-full bg-[#070b14] border-2 border-cyan-400 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(0,242,254,0.6)]">
                  <Network className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-3 font-mono">
                Direct Byte Stream • DTLS Encrypted
              </p>
              <p className="text-[10px] text-emerald-400 mt-0.5">
                Zero Cloud Storage • Zero File Logging
              </p>
            </div>

            {/* Receiver Node */}
            <div className="flex flex-col items-center p-6 rounded-2xl bg-slate-900/60 border border-cyan-500/30">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 shadow-[0_0_20px_rgba(0,242,254,0.2)]">
                <Layers className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-white">Device B (Receiver)</h4>
              <p className="text-xs text-slate-400 mt-1">Chunk reassembly & Blob save</p>
              <span className="mt-3 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 text-[10px] font-mono">
                Safe Blob Reconstruction
              </span>
            </div>

          </div>
        </div>

        {/* 4 Technical Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800">
            <Zap className="w-5 h-5 text-cyan-400 mb-2" />
            <h4 className="text-sm font-semibold text-white">Chunked Slicing</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Files are sliced in 64 KB binary frames using File.slice() to minimize memory footprint.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800">
            <RefreshCw className="w-5 h-5 text-cyan-400 mb-2" />
            <h4 className="text-sm font-semibold text-white">Flow Control</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Dynamically throttles transmission based on bufferedAmount to prevent buffer exhaustion.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800">
            <Network className="w-5 h-5 text-cyan-400 mb-2" />
            <h4 className="text-sm font-semibold text-white">ICE & STUN</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Interactive Connectivity Establishment negotiates direct routes across LAN, Wi-Fi, or internet.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800">
            <Lock className="w-5 h-5 text-cyan-400 mb-2" />
            <h4 className="text-sm font-semibold text-white">E2E Cryptography</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              All WebRTC data channels are encrypted end-to-end using DTLS protocols by browser default.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
