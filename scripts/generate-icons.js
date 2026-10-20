const fs = require('fs');
const zlib = require('zlib');

function createPng(width, height, r, g, b) {
  // 8-bit RGBA
  const rowSize = width * 4;
  const rawData = Buffer.alloc((rowSize + 1) * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (rowSize + 1);
    rawData[rowOffset] = 0; // Filter type: None

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      // Border and corner radius effect
      const dx = Math.min(x, width - 1 - x);
      const dy = Math.min(y, height - 1 - y);
      const isCorner = dx < 24 && dy < 24 && (24 - dx) * (24 - dx) + (24 - dy) * (24 - dy) > 24 * 24;

      if (isCorner) {
        rawData[pixelOffset] = 0;
        rawData[pixelOffset + 1] = 0;
        rawData[pixelOffset + 2] = 0;
        rawData[pixelOffset + 3] = 0;
      } else {
        // Inner violet glow or brand background (#161412 / #7c3aed)
        const cx = width / 2;
        const cy = height / 2;
        const dist = Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy));
        const maxDist = width / 2;

        if (dist < width * 0.3) {
          // Inner violet emblem
          rawData[pixelOffset] = 124;     // R (violet-600)
          rawData[pixelOffset + 1] = 58;  // G
          rawData[pixelOffset + 2] = 237; // B
          rawData[pixelOffset + 3] = 255;
        } else {
          // Dark obsidian shell (#161412)
          rawData[pixelOffset] = 22;
          rawData[pixelOffset + 1] = 20;
          rawData[pixelOffset + 2] = 18;
          rawData[pixelOffset + 3] = 255;
        }
      }
    }
  }

  const compressed = zlib.deflateSync(rawData);

  function createChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);

    const typeAndData = Buffer.concat([Buffer.from(type), data]);
    const crc = crc32(typeAndData);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc, 0);

    return Buffer.concat([len, typeAndData, crcBuf]);
  }

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth
  ihdrData[9] = 6; // Color type (RGBA)
  ihdrData[10] = 0; // Compression
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Interlace
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // IDAT
  const idatChunk = createChunk('IDAT', compressed);

  // IEND
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// CRC32 implementation
function crc32(buf) {
  let table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c;
  }

  let crc = 0 ^ -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

// Write files
fs.writeFileSync('public/pwa-192x192.png', createPng(192, 192));
fs.writeFileSync('public/pwa-512x512.png', createPng(512, 512));
fs.writeFileSync('public/pwa-maskable-512x512.png', createPng(512, 512));
fs.writeFileSync('public/apple-touch-icon.png', createPng(180, 180));
console.log('PWA PNG icons generated successfully');
