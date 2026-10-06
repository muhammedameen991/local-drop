import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

function createPng(width, height, isMaskable = false) {
  // Simple uncompressed or deflated PNG generator
  const buffer = [];
  
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  function crc32(buf) {
    let c;
    const table = [];
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) {
        c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[n] = c;
    }
    let crc = 0 ^ (-1);
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
    }
    return (crc ^ (-1)) >>> 0;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    const check = crc32(Buffer.concat([typeBuf, data]));
    crcBuf.writeUInt32BE(check, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  // Scanlines with filter byte 0
  const rowLength = width * 4 + 1;
  const rawData = Buffer.alloc(rowLength * height);

  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * (isMaskable ? 0.45 : 0.48);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowLength;
    rawData[rowOffset] = 0; // Filter None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background gradient: dark navy #070d18 to #0f1c30
      const ny = y / height;
      let r = Math.round(7 + 10 * ny);
      let g = Math.round(13 + 16 * ny);
      let b = Math.round(24 + 30 * ny);
      let a = 255;

      // Cyan glowing circle and drop shape
      const dropY = y - (cy + height * 0.05);
      const dropDist = Math.sqrt(dx * dx + dropY * dropY);

      if (dist < radius) {
        // Subtle inner ring
        if (Math.abs(dist - radius * 0.9) < 3) {
          r = 0; g = 242; b = 254; a = 200; // Cyan border
        }
      }

      // Draw drop icon in cyan #00f2fe
      // Approximate tear shape: upper triangle meeting circle
      const inDropCore = (dropDist < width * 0.22 && dy > 0) || 
                         (Math.abs(dx) < (cy - y) * 0.5 && y > cy - width * 0.28 && y <= cy);
      if (inDropCore) {
        r = 0; g = 242; b = 254; a = 255; // Neon cyan
        // Center arrow cutout
        if (Math.abs(dx) < width * 0.04 && y > cy - width * 0.08 && y < cy + width * 0.14) {
          r = 11; g = 17; b = 30; a = 255; // Dark notch
        }
        if (y < cy && Math.abs(dx) + (cy - y) < width * 0.12 && y > cy - width * 0.15) {
          r = 11; g = 17; b = 30; a = 255;
        }
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idat = makeChunk('IDAT', compressed);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, makeChunk('IHDR', ihdr), idat, iend]);
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPng(192, 192));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPng(512, 512));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPng(512, 512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPng(180, 180));
console.log('Icons generated successfully.');
