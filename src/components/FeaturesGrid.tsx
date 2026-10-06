import React from 'react';
import {
  Network,
  UploadCloud,
  ListOrdered,
  Smartphone,
  ShieldCheck,
  MonitorSmartphone,
  Check,
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

export const FeaturesGrid: React.FC = () => {
  return (
    <section id="features" className="relative py-16 sm:py-24 border-t border-cyan-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-left mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Designed for Modern File Sharing
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400">
            Engineered with privacy, zero-lag WebRTC streams, and cross-platform flexibility.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Peer-to-Peer Transfer */}
          <div className="p-6 rounded-2xl glass-panel border border-cyan-500/20 hover:border-cyan-400/40 transition group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
                  <Network className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider font-mono">P2P</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Peer-to-Peer Transfer</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Your files go directly between devices using WebRTC DataChannels. No middleman, no intermediate servers.
              </p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-center py-2">
              <div className="flex items-center gap-4 text-xs font-mono text-cyan-300">
                <span>[ Device A ]</span>
                <span className="text-cyan-400 animate-pulse">⇄</span>
                <span>[ Device B ]</span>
              </div>
            </div>
          </div>

          {/* Card 2: Drag & Drop */}
          <div className="p-6 rounded-2xl glass-panel border border-cyan-500/20 hover:border-cyan-400/40 transition group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider font-mono">Fast</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Drag & Drop</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Send multiple files, entire folders, high-res videos, and raw images with seamless drag-and-drop convenience.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80">
              <div className="py-2.5 px-3 rounded-xl border border-dashed border-cyan-500/30 text-center text-xs text-slate-400 group-hover:border-cyan-400/60 transition">
                <span>Drop files anywhere on the console</span>
              </div>
            </div>
          </div>

          {/* Card 3: Transfer Queue */}
          <div className="p-6 rounded-2xl glass-panel border border-cyan-500/20 hover:border-cyan-400/40 transition group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
                  <ListOrdered className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider font-mono">Live</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Transfer Queue</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Manage your transfers in real time. Track progress, view transmission speed in MB/s, calculate ETA, or cancel items.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-white">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> photo.jpg
                </span>
                <span className="font-mono text-[11px]">4.2 MB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-white">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /> video.mp4
                </span>
                <span className="font-mono text-[11px] text-cyan-400">850 MB</span>
              </div>
            </div>
          </div>

          {/* Card 4: PWA Ready */}
          <div className="p-6 rounded-2xl glass-panel border border-cyan-500/20 hover:border-cyan-400/40 transition group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
                  <Smartphone className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider font-mono">PWA</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">PWA Ready</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Works offline as an installable standalone app on your phone, tablet, or desktop with instant access from your home screen.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-400">Standalone App</span>
              <PWAInstallButton />
            </div>
          </div>

          {/* Card 5: Private by Design */}
          <div className="p-6 rounded-2xl glass-panel border border-cyan-500/20 hover:border-cyan-400/40 transition group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider font-mono">Secure</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Private by Design</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                No user accounts. No cloud database. No permanent file library. No logs. Your files stay between your devices.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80">
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> End-to-end encrypted DataChannels
              </span>
            </div>
          </div>

          {/* Card 6: Works Everywhere */}
          <div className="p-6 rounded-2xl glass-panel border border-cyan-500/20 hover:border-cyan-400/40 transition group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
                  <MonitorSmartphone className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider font-mono">Universal</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Works Everywhere</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Windows • macOS • Linux • Android • iOS. One web app for all your devices without cables or specialized drivers.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Chrome</span>
                <span>•</span>
                <span>Safari</span>
                <span>•</span>
                <span>Edge</span>
                <span>•</span>
                <span>Firefox</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
