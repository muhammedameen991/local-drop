import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, X, AlertCircle, RefreshCw, Upload } from 'lucide-react';
import { normalizeRoomCode } from '../services/signaling';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (roomCode: string) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const readerElementId = 'localdrop-qr-reader';

  useEffect(() => {
    if (!isOpen) {
      stopScanner();
      return;
    }

    let isMounted = true;

    const startScanner = async () => {
      setError(null);
      setIsScanning(true);

      try {
        const html5QrCode = new Html5Qrcode(readerElementId);
        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            // Check if it's a URL or direct code
            let roomCode = decodedText;
            try {
              const url = new URL(decodedText);
              const roomParam = url.searchParams.get('room');
              if (roomParam) {
                roomCode = roomParam;
              } else if (url.pathname.includes('/join/')) {
                roomCode = url.pathname.split('/join/')[1];
              }
            } catch {
              // Not a full URL, treat as raw room string
            }

            const cleanCode = normalizeRoomCode(roomCode);
            if (cleanCode && cleanCode.startsWith('LD-')) {
              stopScanner();
              onScanSuccess(cleanCode);
            }
          },
          () => {
            // frame read, no qr in view yet
          }
        );
      } catch (err: unknown) {
        if (!isMounted) return;
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes('NotAllowedError') || msg.includes('Permission')) {
          setError('Camera permission was denied. Please allow camera access in browser permissions or enter the room code manually.');
        } else if (msg.includes('NotFoundError') || msg.includes('DevicesNotFoundError')) {
          setError('No camera found on this device. You can enter the room code manually.');
        } else {
          setError(`Camera error: ${msg}`);
        }
        setIsScanning(false);
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(startScanner, 200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      stopScanner();
    };
  }, [isOpen, onScanSuccess]);

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
      } catch {
        // scanner stopped
      }
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const html5QrCode = new Html5Qrcode('qr-temp-file-reader');
      const decodedText = await html5QrCode.scanFile(file, true);
      let roomCode = decodedText;
      try {
        const url = new URL(decodedText);
        const roomParam = url.searchParams.get('room');
        if (roomParam) roomCode = roomParam;
      } catch {}

      const cleanCode = normalizeRoomCode(roomCode);
      if (cleanCode) {
        stopScanner();
        onScanSuccess(cleanCode);
      }
    } catch {
      setError('Could not find a valid LocalDrop QR code in this image.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-[#0b1220] border border-cyan-500/30 p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Scan Room QR Code</h3>
            <p className="text-xs text-slate-400">Point your camera at the QR code on the other device</p>
          </div>
        </div>

        {error ? (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3 my-4">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
            <div>
              <p className="font-medium text-rose-200">Camera Unavailable</p>
              <p className="mt-1 text-xs text-rose-300/80 leading-relaxed">{error}</p>
            </div>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-xl bg-black border border-cyan-500/20 aspect-square my-4 flex items-center justify-center">
            <div id={readerElementId} className="w-full h-full" />
            {isScanning && (
              <div className="absolute inset-0 pointer-events-none border-2 border-cyan-400/40 m-8 rounded-lg animate-pulse" />
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-800">
          <label className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-lg cursor-pointer transition">
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>Upload QR Image</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition"
          >
            Cancel
          </button>
        </div>
      </div>
      <div id="qr-temp-file-reader" className="hidden" />
    </div>
  );
};
