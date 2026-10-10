const fs = require('fs');

// Simple pure-JS GIF89a encoder for animated noise
function createNoiseGIF(width, height, numFrames, filename) {
  // 64-color grayscale palette (0 to 255)
  const palette = [];
  for (let i = 0; i < 64; i++) {
    const v = Math.round((i / 63) * 255);
    palette.push(v, v, v);
  }

  const buf = [];

  // 1. Header & Logical Screen Descriptor
  buf.push(0x47, 0x49, 0x46, 0x38, 0x39, 0x61); // GIF89a
  buf.push(width & 0xff, (width >> 8) & 0xff);
  buf.push(height & 0xff, (height >> 8) & 0xff);
  buf.push(0xf5, 0x00, 0x00); // GCT present, 64 colors (2^(5+1) = 64)

  // Global Color Table
  for (let i = 0; i < palette.length; i++) {
    buf.push(palette[i]);
  }

  // Netscape 2.0 Looping Extension
  buf.push(0x21, 0xff, 0x0b);
  const netscape = Buffer.from('NETSCAPE2.0');
  for (let b of netscape) buf.push(b);
  buf.push(0x03, 0x01, 0x00, 0x00, 0x00);

  // Helper: minimal LZW compression
  function compressLZW(pixels, colorDepth) {
    const clearCode = 1 << colorDepth;
    const endCode = clearCode + 1;
    let codeSize = colorDepth + 1;
    let nextCode = endCode + 1;

    let dict = new Map();
    function resetDict() {
      dict.clear();
      for (let i = 0; i < clearCode; i++) {
        dict.set(String.fromCharCode(i), i);
      }
      codeSize = colorDepth + 1;
      nextCode = endCode + 1;
    }
    resetDict();

    const outputCodes = [clearCode];
    let curPrefix = '';

    for (let i = 0; i < pixels.length; i++) {
      const c = String.fromCharCode(pixels[i]);
      const combined = curPrefix + c;
      if (dict.has(combined)) {
        curPrefix = combined;
      } else {
        outputCodes.push(dict.get(curPrefix));
        if (nextCode < 4096) {
          dict.set(combined, nextCode++);
          if (nextCode === (1 << codeSize) && codeSize < 12) {
            codeSize++;
          }
        } else {
          outputCodes.push(clearCode);
          resetDict();
        }
        curPrefix = c;
      }
    }
    if (curPrefix.length > 0) {
      outputCodes.push(dict.get(curPrefix));
    }
    outputCodes.push(endCode);

    // Pack codes into bitstream
    const bitStream = [];
    let curByte = 0;
    let curBits = 0;
    let currentCodeSize = colorDepth + 1;
    let dictSize = endCode + 1;

    for (let code of outputCodes) {
      let temp = code;
      for (let b = 0; b < currentCodeSize; b++) {
        if (temp & 1) curByte |= (1 << curBits);
        curBits++;
        if (curBits === 8) {
          bitStream.push(curByte);
          curByte = 0;
          curBits = 0;
        }
        temp >>= 1;
      }
      if (code === clearCode) {
        currentCodeSize = colorDepth + 1;
        dictSize = endCode + 1;
      } else {
        dictSize++;
        if (dictSize === (1 << currentCodeSize) && currentCodeSize < 12) {
          currentCodeSize++;
        }
      }
    }
    if (curBits > 0) bitStream.push(curByte);

    // Split bitstream into blocks <= 255 bytes
    const blocks = [];
    blocks.push(colorDepth); // LZW minimum code size
    for (let i = 0; i < bitStream.length; i += 254) {
      const slice = bitStream.slice(i, i + 254);
      blocks.push(slice.length);
      for (let b of slice) blocks.push(b);
    }
    blocks.push(0x00); // Block terminator
    return blocks;
  }

  // Write Frames
  for (let f = 0; f < numFrames; f++) {
    // Graphic Control Extension (delay = 4 -> 40ms, 25fps)
    buf.push(0x21, 0xf9, 0x04, 0x00, 0x04, 0x00, 0x00, 0x00);

    // Image Descriptor
    buf.push(0x2c, 0x00, 0x00, 0x00, 0x00);
    buf.push(width & 0xff, (width >> 8) & 0xff);
    buf.push(height & 0xff, (height >> 8) & 0xff);
    buf.push(0x00); // No local color table

    // Generate random film grain pixels
    const pixels = new Uint8Array(width * height);
    for (let p = 0; p < pixels.length; p++) {
      // Gaussian-like noise distribution for authentic film grain
      const r1 = Math.random();
      const r2 = Math.random();
      const gaussian = (r1 + r2) / 2; // bell curve centered around 0.5
      pixels[p] = Math.floor(gaussian * 63);
    }

    const compressed = compressLZW(pixels, 6);
    for (let b of compressed) buf.push(b);
  }

  // Trailer
  buf.push(0x3b);

  fs.writeFileSync(filename, Buffer.from(buf));
  console.log(`Generated ${filename} (${buf.length} bytes) successfully!`);
}

createNoiseGIF(180, 180, 5, 'public/noise.gif');
