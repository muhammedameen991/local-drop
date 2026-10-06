import { Peer } from 'peerjs';

const CHARS = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

export function generateRoomCode(): string {
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return `LD-${code}`;
}

export function normalizeRoomCode(code: string): string {
  const clean = code.trim().toUpperCase();
  if (clean.startsWith('LD-')) {
    return clean;
  }
  return `LD-${clean.replace(/^LD/i, '').replace(/[^A-Z0-9]/g, '')}`;
}

export function isValidRoomCode(code: string): boolean {
  return /^LD-[2-9A-HJ-NP-Z]{3,6}$/i.test(code.trim());
}

export function getRoomUrl(roomCode: string): string {
  if (typeof window === 'undefined') return '';
  const url = new URL(window.location.href);
  url.searchParams.set('room', roomCode);
  return url.toString();
}

export const RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:global.stun.twilio.com:3478' },
  ],
};

export function createPeerInstance(customId?: string): Peer {
  return new Peer(customId || '', {
    config: RTC_CONFIG,
    debug: 1, // Only errors
  });
}
