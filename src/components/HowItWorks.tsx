import React from 'react';
import { PlusSquare, QrCode, Send } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="relative py-16 sm:py-24 border-t border-cyan-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-left mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How It Works
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400">
            Just 3 simple steps to transfer anything directly between devices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Step 1 */}
          <div className="relative p-6 sm:p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-cyan-500/30 transition group">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold text-cyan-400 font-mono tracking-widest px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                01
              </span>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(0,242,254,0.3)] transition duration-300">
                <PlusSquare className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Create a room</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Click create transfer to get a unique, randomly generated room code and an instant QR code.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative p-6 sm:p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-cyan-500/30 transition group">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold text-cyan-400 font-mono tracking-widest px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                02
              </span>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(0,242,254,0.3)] transition duration-300">
                <QrCode className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Scan the QR code</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Open LocalDrop on your phone or tablet and scan the QR code, or type the short 6-character room code.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative p-6 sm:p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-cyan-500/30 transition group">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold text-cyan-400 font-mono tracking-widest px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                03
              </span>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(0,242,254,0.3)] transition duration-300">
                <Send className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Send your files</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              WebRTC negotiates an encrypted peer-to-peer data channel. Files stream directly between memory and disk.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
