import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'Are my files uploaded or stored on any server?',
    answer:
      'No. LocalDrop is strictly peer-to-peer. Your files travel directly from Device A to Device B using WebRTC DataChannels. The signaling service only negotiates connection handshakes (SDP and ICE candidates) and never touches, sees, or stores your file payloads.',
  },
  {
    question: 'Do both devices need to be on the same Wi-Fi network?',
    answer:
      'Not necessarily! LocalDrop works seamlessly across the same Wi-Fi network, mobile hotspots, or even across different internet connections using WebRTC STUN NAT traversal. If both devices are on the same local network, transfers will typically stay entirely within your local LAN for blazing speeds.',
  },
  {
    question: 'Is there a limit on file size?',
    answer:
      'LocalDrop utilizes progressive chunking (64 KB binary frames) and backpressure flow control, allowing you to transfer large videos, ZIP archives, and raw datasets without exhausting browser memory.',
  },
  {
    question: 'Can I send files between an iPhone and a Windows PC or Android?',
    answer:
      'Yes. LocalDrop runs in any modern browser including Safari on iOS, Chrome on Android, Windows, macOS, and Linux. No apps, cables, or proprietary ecosystem restrictions required.',
  },
  {
    question: 'How does the QR code work?',
    answer:
      'When you create a transfer room on your computer, a unique room code and URL are encoded into a QR code. Scanning it with your phone opens the same transfer room and establishes an encrypted direct WebRTC channel in seconds.',
  },
  {
    question: 'Can I install LocalDrop for offline use?',
    answer:
      'Yes! LocalDrop is a Progressive Web App (PWA). You can tap "Install App" or "Add to Home Screen" to install it. The app shell is cached locally so it launches instantly.',
  },
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" className="relative py-16 sm:py-24 border-t border-cyan-500/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-left mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400">
            Everything you need to know about LocalDrop and browser-native peer-to-peer sharing.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl glass-panel border border-cyan-500/15 overflow-hidden transition"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-800/20 transition"
                >
                  <span className="text-sm sm:text-base font-semibold text-white">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-cyan-400 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/60">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
