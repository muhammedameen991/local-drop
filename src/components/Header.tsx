import React from 'react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  onNavigate: (sectionId: string) => void;
  activeSection?: string;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-500/10 bg-[#070b14]/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('hero')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-600/20 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(0,242,254,0.3)] group-hover:shadow-[0_0_25px_rgba(0,242,254,0.5)] transition duration-300">
            <svg
              className="w-6 h-6 text-cyan-400 transform group-hover:scale-110 transition duration-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              <path d="M12 11v6" />
              <path d="M9.5 14.5L12 17l2.5-2.5" />
            </svg>
            <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#070b14] animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              Local<span className="text-cyan-400 font-extrabold">Drop</span>
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <button
            onClick={() => onNavigate('hero')}
            className="hover:text-cyan-300 transition cursor-pointer"
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('workspace')}
            className="hover:text-cyan-300 transition cursor-pointer"
          >
            Transfer
          </button>
          <button
            onClick={() => onNavigate('how-it-works')}
            className="hover:text-cyan-300 transition cursor-pointer"
          >
            How it works
          </button>
          <button
            onClick={() => onNavigate('technology')}
            className="hover:text-cyan-300 transition cursor-pointer"
          >
            Technology
          </button>
          <button
            onClick={() => onNavigate('features')}
            className="hover:text-cyan-300 transition cursor-pointer"
          >
            Features
          </button>
          <button
            onClick={() => onNavigate('faq')}
            className="hover:text-cyan-300 transition cursor-pointer"
          >
            FAQ
          </button>
        </nav>

        {/* Right Action: PWA Install & Status */}
        <div className="flex items-center gap-3">
          <PWAInstallButton />
        </div>
      </div>
    </header>
  );
};
