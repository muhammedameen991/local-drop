import React from 'react';
import {
  Zap,
  ShieldCheck,
  UserX,
  Smartphone,
  FolderArchive,
  Globe,
  ArrowRight,
  QrCode,
  Sparkles,
} from 'lucide-react';

interface HeroProps {
  onCreateTransfer: () => void;
  onJoinRoom: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onCreateTransfer, onJoinRoom }) => {
  return (
    <section id="hero" className="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden">
      {/* Background Neon Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute top-36 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Heading & Value Proposition */}
          <div className="lg:col-span-5 flex flex-col items-start text-left z-10">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-semibold tracking-wide uppercase shadow-[0_0_15px_rgba(0,242,254,0.15)] mb-6">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>P2P File Transfer • No Backend</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              Send anything.{' '}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-400 to-teal-300 cyan-glow-text">
                Device to device.
              </span>
            </h1>

            {/* Tagline */}
            <h2 className="mt-3 text-xl sm:text-2xl font-semibold text-slate-300">
              No upload. No account.
            </h2>

            {/* Description */}
            <p className="mt-5 text-sm sm:text-base text-slate-400 leading-relaxed max-w-lg">
              LocalDrop lets you transfer files directly between your devices using peer-to-peer WebRTC connections. Your files never touch our servers.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap gap-4 w-full sm:w-auto">
              <button
                onClick={onCreateTransfer}
                className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-bold text-sm shadow-[0_0_25px_rgba(0,242,254,0.4)] hover:shadow-[0_0_35px_rgba(0,242,254,0.6)] hover:brightness-105 active:scale-[0.98] transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Create Transfer</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onJoinRoom}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 text-white font-semibold text-sm border border-slate-700/80 hover:border-cyan-500/40 shadow-lg active:scale-[0.98] transition cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-cyan-400" />
                <span>Join Room</span>
              </button>
            </div>
          </div>

          {/* Center Column: 3D Connected Laptop & Phone Illustration */}
          <div className="lg:col-span-4 relative flex items-center justify-center py-6">
            <div className="relative w-full max-w-md flex items-center justify-center">
              
              {/* Laptop Graphic */}
              <div className="relative w-56 sm:w-64 aspect-[16/10] bg-slate-900 rounded-t-xl border-t border-x border-cyan-400/30 p-2 shadow-2xl transform -rotate-2 -translate-x-6">
                <div className="w-full h-full bg-[#080d19] rounded-lg p-3 flex flex-col items-center justify-center border border-cyan-500/20">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-2 shadow-[0_0_15px_rgba(0,242,254,0.2)]">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-white tracking-wide">LocalDrop</span>
                  <div className="flex items-center gap-1.5 mt-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Connected</span>
                  </div>
                </div>
                {/* Laptop base */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[110%] h-2.5 bg-slate-800 rounded-b-lg border-b border-slate-700 shadow-md" />
              </div>

              {/* Central Glowing P2P Pulsing Badge */}
              <div className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative w-18 h-18 rounded-full bg-[#070b14]/90 border-2 border-cyan-400 p-1 flex items-center justify-center shadow-[0_0_30px_rgba(0,242,254,0.5)]">
                  <div className="w-full h-full rounded-full bg-cyan-500/15 flex flex-col items-center justify-center animate-pulse">
                    <span className="text-[11px] font-black tracking-wider text-cyan-300">P2P</span>
                    <svg className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                    </svg>
                  </div>
                  {/* Outer ripple rings */}
                  <div className="absolute -inset-2 rounded-full border border-cyan-400/30 animate-pulse-ring pointer-events-none" />
                </div>
              </div>

              {/* Mobile Phone Graphic */}
              <div className="relative z-10 w-28 sm:w-32 aspect-[9/18] bg-slate-900 rounded-3xl border-2 border-cyan-400/40 p-1.5 shadow-2xl transform rotate-3 translate-x-12 translate-y-4">
                <div className="w-full h-full bg-[#080d19] rounded-[22px] p-2 flex flex-col items-center justify-center border border-cyan-500/20 relative overflow-hidden">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-bold text-white">LocalDrop</span>
                  <div className="flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[8px] text-emerald-400 font-medium">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Connected</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: 6 Feature Highlights List */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            
            <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-cyan-500/30 hover:bg-slate-900/60 transition group">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Fast</h4>
                <p className="text-xs text-slate-400 mt-0.5">Direct peer-to-peer transfers.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-cyan-500/30 hover:bg-slate-900/60 transition group">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Private</h4>
                <p className="text-xs text-slate-400 mt-0.5">Files aren't uploaded to cloud storage.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-cyan-500/30 hover:bg-slate-900/60 transition group">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
                <UserX className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">No Account</h4>
                <p className="text-xs text-slate-400 mt-0.5">Start transferring immediately.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-cyan-500/30 hover:bg-slate-900/60 transition group">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Cross-device</h4>
                <p className="text-xs text-slate-400 mt-0.5">PC ↔ Phone ↔ Tablet.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-cyan-500/30 hover:bg-slate-900/60 transition group">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
                <FolderArchive className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Large Files</h4>
                <p className="text-xs text-slate-400 mt-0.5">Designed for large file transfers.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-cyan-500/30 hover:bg-slate-900/60 transition group">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Web-based</h4>
                <p className="text-xs text-slate-400 mt-0.5">Nothing to install.</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
