import React from 'react';
import { Github, Globe, Heart, Shield, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-cyan-500/10 bg-[#05080f] pt-14 pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-slate-900">
          {/* Logo & Tagline */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Local<span className="text-cyan-400">Drop</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs">
              Send anything. Device to device.
            </p>
            <p className="text-[11px] text-cyan-400 font-medium">
              No upload • No account • Peer-to-peer
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 font-medium text-slate-300">
            <button
              onClick={() => onNavigate('hero')}
              className="hover:text-cyan-400 transition cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('how-it-works')}
              className="hover:text-cyan-400 transition cursor-pointer"
            >
              How it works
            </button>
            <button
              onClick={() => onNavigate('technology')}
              className="hover:text-cyan-400 transition cursor-pointer"
            >
              Technology
            </button>
            <button
              onClick={() => onNavigate('features')}
              className="hover:text-cyan-400 transition cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => onNavigate('faq')}
              className="hover:text-cyan-400 transition cursor-pointer"
            >
              FAQ
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition flex items-center gap-1"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Ameen Credit */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © 2026 LocalDrop. All rights reserved. Built with WebRTC.
          </div>

          <div className="flex items-center gap-2">
            <span>Developed by Ameen</span>
            <a
              href="https://iamameen.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 font-medium underline underline-offset-2 flex items-center gap-1"
            >
              <span>iamameen.vercel.app</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
