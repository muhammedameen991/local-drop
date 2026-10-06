import { DeviceInfo } from '../types/transfer';

export function getLocalDeviceInfo(): DeviceInfo {
  if (typeof window === 'undefined') {
    return {
      browser: 'Browser',
      os: 'Unknown',
      type: 'desktop',
      formatted: 'Web Browser',
    };
  }

  const ua = navigator.userAgent;
  let browser = 'Unknown Browser';
  let os = 'Unknown OS';
  let type: DeviceInfo['type'] = 'desktop';

  // Detect OS
  if (/iPad|iPhone|iPod/.test(ua)) {
    os = 'iOS';
    type = 'mobile';
  } else if (/Android/.test(ua)) {
    os = 'Android';
    type = /Mobile/.test(ua) ? 'mobile' : 'tablet';
  } else if (/Macintosh|Mac OS X/.test(ua)) {
    os = 'macOS';
    type = 'desktop';
  } else if (/Windows NT/.test(ua)) {
    os = 'Windows';
    type = 'desktop';
  } else if (/Linux/.test(ua)) {
    os = 'Linux';
    type = 'desktop';
  }

  // Detect Browser
  if (/Edg\//.test(ua)) {
    browser = 'Edge';
  } else if (/Chrome\//.test(ua) && !/Edg\//.test(ua)) {
    browser = 'Chrome';
  } else if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) {
    browser = 'Safari';
  } else if (/Firefox\//.test(ua)) {
    browser = 'Firefox';
  } else if (/Opera|OPR\//.test(ua)) {
    browser = 'Opera';
  }

  const formatted = `${browser} on ${os}`;

  return {
    browser,
    os,
    type,
    formatted,
  };
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatSpeed(bytesPerSec: number): string {
  if (bytesPerSec <= 0) return '0 B/s';
  return `${formatBytes(bytesPerSec)}/s`;
}

export function formatEta(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '--';
  if (seconds < 1) return '< 1s';
  if (seconds < 60) return `${Math.ceil(seconds)}s`;
  const mins = Math.floor(seconds / 60);
  const secs = Math.ceil(seconds % 60);
  return `${mins}m ${secs}s`;
}
