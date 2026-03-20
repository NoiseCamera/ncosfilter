import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Upload, Download, Settings2, Sparkles, Camera, Image as ImageIcon, ChevronDown, ChevronUp, Palette } from 'lucide-react';

type FilterParams = {
  brightness: number;
  contrast: number;
  saturation: number;
  sepia: number;
  noise: number;
  vignette: number;
  chromaticAberration: number;
  blur: number;
  scanlines: number;
  pixelate: number;
  glitch: number;
  crtCurve: number;
  colorBleed: number;
  trackingBand: number;
  timestamp: number;
  tapeJitter: number;
  tapeCrease: number;
  filmGrain: number;
  dustAndScratches: number;
  lightLeak: number;
  halation: number;
  posterize: number;
  lensDistortion: number;
  edgeBlur: number;
  colorShift: number;
  jpegArtifacts: number;
  gameboy: number;
};

const PRESETS: Record<string, { name: string, params: FilterParams, activeParams: (keyof FilterParams)[] }> = {
  normal: { 
    name: 'オリジナル', 
    params: { brightness: 0, contrast: 0, saturation: 0, sepia: 0, noise: 0, vignette: 0, chromaticAberration: 0, blur: 0, scanlines: 0, pixelate: 0, glitch: 0, crtCurve: 0, colorBleed: 0, trackingBand: 0, timestamp: 0, tapeJitter: 0, tapeCrease: 0, filmGrain: 0, dustAndScratches: 0, lightLeak: 0, halation: 0, posterize: 0, lensDistortion: 0, edgeBlur: 0, colorShift: 0, jpegArtifacts: 0, gameboy: 0 },
    activeParams: ['brightness', 'contrast', 'saturation']
  },
  vhs: { 
    name: '平成VHS風', 
    params: { brightness: 15, contrast: 15, saturation: -25, sepia: 15, noise: 50, vignette: 30, chromaticAberration: 40, blur: 3, scanlines: 70, pixelate: 0, glitch: 50, crtCurve: 30, colorBleed: 80, trackingBand: 80, timestamp: 100, tapeJitter: 60, tapeCrease: 40, filmGrain: 0, dustAndScratches: 0, lightLeak: 0, halation: 0, posterize: 0, lensDistortion: 10, edgeBlur: 0, colorShift: 0, jpegArtifacts: 0, gameboy: 0 },
    activeParams: ['noise', 'scanlines', 'glitch', 'crtCurve', 'colorBleed', 'trackingBand', 'timestamp', 'tapeJitter', 'tapeCrease', 'chromaticAberration', 'vignette']
  },
  film: { 
    name: 'フィルム風', 
    params: { brightness: 5, contrast: 20, saturation: 10, sepia: 10, noise: 0, vignette: 15, chromaticAberration: 3, blur: 0, scanlines: 0, pixelate: 0, glitch: 0, crtCurve: 0, colorBleed: 0, trackingBand: 0, timestamp: 0, tapeJitter: 0, tapeCrease: 0, filmGrain: 40, dustAndScratches: 60, lightLeak: 0, halation: 30, posterize: 0, lensDistortion: 0, edgeBlur: 0, colorShift: 10, jpegArtifacts: 0, gameboy: 0 },
    activeParams: ['filmGrain', 'dustAndScratches', 'halation', 'colorShift', 'contrast', 'saturation', 'sepia', 'vignette']
  },
  retro: { 
    name: 'オールドレンズ', 
    params: { brightness: 15, contrast: -15, saturation: -40, sepia: 70, noise: 10, vignette: 60, chromaticAberration: 15, blur: 6, scanlines: 0, pixelate: 0, glitch: 0, crtCurve: 0, colorBleed: 0, trackingBand: 0, timestamp: 0, tapeJitter: 0, tapeCrease: 0, filmGrain: 20, dustAndScratches: 10, lightLeak: 20, halation: 50, posterize: 0, lensDistortion: 30, edgeBlur: 40, colorShift: 20, jpegArtifacts: 0, gameboy: 0 },
    activeParams: ['lensDistortion', 'edgeBlur', 'halation', 'sepia', 'vignette', 'blur', 'chromaticAberration', 'colorShift']
  },
  disposable: { 
    name: '写ルンです風', 
    params: { brightness: 15, contrast: 40, saturation: 20, sepia: 0, noise: 0, vignette: 40, chromaticAberration: 5, blur: 1, scanlines: 0, pixelate: 0, glitch: 0, crtCurve: 0, colorBleed: 0, trackingBand: 0, timestamp: 100, tapeJitter: 0, tapeCrease: 0, filmGrain: 25, dustAndScratches: 5, lightLeak: 30, halation: 20, posterize: 0, lensDistortion: 10, edgeBlur: 10, colorShift: 30, jpegArtifacts: 0, gameboy: 0 },
    activeParams: ['timestamp', 'lightLeak', 'colorShift', 'filmGrain', 'vignette', 'contrast', 'saturation', 'halation']
  },
  toy: { 
    name: 'トイカメラ風', 
    params: { brightness: 5, contrast: 40, saturation: 50, sepia: 0, noise: 0, vignette: 80, chromaticAberration: 15, blur: 2, scanlines: 0, pixelate: 0, glitch: 0, crtCurve: 0, colorBleed: 0, trackingBand: 0, timestamp: 0, tapeJitter: 0, tapeCrease: 0, filmGrain: 10, dustAndScratches: 0, lightLeak: 50, halation: 10, posterize: 0, lensDistortion: 40, edgeBlur: 50, colorShift: 20, jpegArtifacts: 0, gameboy: 0 },
    activeParams: ['vignette', 'lensDistortion', 'edgeBlur', 'lightLeak', 'saturation', 'contrast', 'colorShift', 'chromaticAberration']
  },
  galapagos: { 
    name: 'ガラケー風', 
    params: { brightness: 10, contrast: 30, saturation: 10, sepia: 0, noise: 10, vignette: 0, chromaticAberration: 5, blur: 0, scanlines: 0, pixelate: 40, glitch: 0, crtCurve: 0, colorBleed: 0, trackingBand: 0, timestamp: 0, tapeJitter: 0, tapeCrease: 0, filmGrain: 0, dustAndScratches: 0, lightLeak: 0, halation: 0, posterize: 40, lensDistortion: 0, edgeBlur: 0, colorShift: -10, jpegArtifacts: 80, gameboy: 0 },
    activeParams: ['pixelate', 'jpegArtifacts', 'posterize', 'noise', 'contrast', 'saturation']
  },
  pocketCamera: {
    name: 'ポケットカメラ風',
    params: { brightness: 10, contrast: 30, saturation: 0, sepia: 0, noise: 0, vignette: 0, chromaticAberration: 0, blur: 0, scanlines: 0, pixelate: 85, glitch: 0, crtCurve: 0, colorBleed: 0, trackingBand: 0, timestamp: 0, tapeJitter: 0, tapeCrease: 0, filmGrain: 0, dustAndScratches: 0, lightLeak: 0, halation: 0, posterize: 0, lensDistortion: 0, edgeBlur: 0, colorShift: 0, jpegArtifacts: 0, gameboy: 100 },
    activeParams: ['gameboy', 'pixelate', 'contrast', 'brightness']
  },
};

type ParamConfig = {
  key: keyof FilterParams;
  label: string;
  min: number;
  max: number;
  type?: 'slider' | 'boolean';
};

const PARAM_CONFIG: ParamConfig[] = [
  { key: 'brightness', label: '明るさ', min: -100, max: 100 },
  { key: 'contrast', label: 'コントラスト', min: -100, max: 100 },
  { key: 'saturation', label: '鮮やかさ', min: -100, max: 100 },
  { key: 'sepia', label: 'セピア（色あせ）', min: 0, max: 100 },
  { key: 'noise', label: 'ノイズ（ざらつき）', min: 0, max: 100 },
  { key: 'vignette', label: '周辺減光（フチの暗さ）', min: 0, max: 100 },
  { key: 'chromaticAberration', label: '色ずれ（RGBずらし）', min: 0, max: 50 },
  { key: 'blur', label: 'ぼかし', min: 0, max: 20 },
  { key: 'scanlines', label: '走査線（VHSの横縞）', min: 0, max: 100 },
  { key: 'pixelate', label: 'ピクセル化（粗さ）', min: 0, max: 100 },
  { key: 'glitch', label: 'グリッチ（横ブレ）', min: 0, max: 100 },
  { key: 'crtCurve', label: 'ブラウン管の歪み', min: 0, max: 100 },
  { key: 'colorBleed', label: '色のにじみ（クロマバグ）', min: 0, max: 100 },
  { key: 'trackingBand', label: 'トラッキングノイズ（下部の乱れ）', min: 0, max: 100 },
  { key: 'timestamp', label: '日付・PLAY表示', min: 0, max: 100, type: 'boolean' },
  { key: 'tapeJitter', label: 'テープのヨレ（微細な横揺れ）', min: 0, max: 100 },
  { key: 'tapeCrease', label: 'テープの傷（白い横線ノイズ）', min: 0, max: 100 },
  { key: 'filmGrain', label: 'フィルムグレイン（粒状感）', min: 0, max: 100 },
  { key: 'dustAndScratches', label: 'チリと傷（フィルムの劣化）', min: 0, max: 100 },
  { key: 'lightLeak', label: 'ライトリーク（感光・光漏れ）', min: 0, max: 100 },
  { key: 'halation', label: 'ハレーション（ハイライトの滲み）', min: 0, max: 100 },
  { key: 'posterize', label: 'ポスタリゼーション（色数減・ガラケー風）', min: 0, max: 100 },
  { key: 'lensDistortion', label: 'レンズの歪み（樽型）', min: 0, max: 100 },
  { key: 'edgeBlur', label: '周辺ボケ', min: 0, max: 100 },
  { key: 'colorShift', label: '色転び（クロスプロセス）', min: -100, max: 100 },
  { key: 'jpegArtifacts', label: 'JPEGノイズ（ガラケー風）', min: 0, max: 100 },
  { key: 'gameboy', label: 'ポケットカメラ風（4階調緑）', min: 0, max: 100, type: 'boolean' },
];

const themeStyles = {
  cute: {
    bg: 'bg-pink-50',
    text: 'text-gray-800',
    panel: 'bg-white rounded-3xl shadow-xl border-4 border-pink-200',
    header: 'bg-pink-400 text-white shadow-md',
    buttonPrimary: 'bg-pink-400 hover:bg-pink-500 text-white rounded-full font-bold shadow-md transition-transform active:scale-95',
    buttonSecondary: 'bg-pink-100 hover:bg-pink-200 text-pink-800 rounded-full font-medium transition-colors',
    buttonActive: 'bg-pink-500 text-white rounded-full font-bold shadow-inner',
    slider: 'accent-pink-400 text-pink-400',
    icon: 'text-pink-400',
  },
  cool: {
    bg: 'bg-gray-950',
    text: 'text-gray-200',
    panel: 'bg-gray-900 rounded-xl shadow-2xl border border-gray-800',
    header: 'bg-gray-900 border-b border-gray-800 text-gray-100',
    buttonPrimary: 'bg-indigo-600 hover:bg-indigo-500 text-white rounded-md font-medium shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-colors',
    buttonSecondary: 'bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md font-medium transition-colors border border-gray-700',
    buttonActive: 'bg-indigo-500 text-white rounded-md font-medium shadow-[0_0_10px_rgba(79,70,229,0.5)] border border-indigo-400',
    slider: 'accent-indigo-500 text-indigo-500',
    icon: 'text-indigo-400',
  }
};

const applyFilters = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  params: FilterParams,
  intensity: number,
  customDate: string,
  customTime: string
) => {
  const width = canvas.width;
  const height = canvas.height;

  // 1. Pixelate & Blur
  const pix = params.pixelate * intensity;
  const blurVal = params.blur * intensity;
  
  if (blurVal > 0) {
    ctx.filter = `blur(${blurVal}px)`;
  } else {
    ctx.filter = 'none';
  }

  if (pix > 0) {
    // ピクセル化（ガラケー風の粗い画質）
    const scale = Math.max(0.05, 1 - (pix / 100) * 0.9); // 1.0 to 0.1
    const w = Math.max(1, Math.floor(width * scale));
    const h = Math.max(1, Math.floor(height * scale));
    
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = w;
    tempCanvas.height = h;
    const tempCtx = tempCanvas.getContext('2d');
    if (tempCtx) {
      tempCtx.drawImage(image, 0, 0, w, h);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(tempCanvas, 0, 0, w, h, 0, 0, width, height);
      ctx.imageSmoothingEnabled = true;
    } else {
      ctx.drawImage(image, 0, 0, width, height);
    }
  } else {
    ctx.drawImage(image, 0, 0, width, height);
  }
  ctx.filter = 'none';

  // 1.2 Edge Blur (周辺ボケ)
  const eb = params.edgeBlur * intensity;
  if (eb > 0) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');
    if (tempCtx) {
      tempCtx.drawImage(canvas, 0, 0);
      tempCtx.filter = `blur(${Math.max(2, eb / 5)}px)`;
      tempCtx.drawImage(canvas, 0, 0);
      
      const maskCanvas = document.createElement('canvas');
      maskCanvas.width = width;
      maskCanvas.height = height;
      const maskCtx = maskCanvas.getContext('2d');
      if (maskCtx) {
        const gradient = maskCtx.createRadialGradient(width / 2, height / 2, Math.min(width, height) * 0.3, width / 2, height / 2, Math.max(width, height) * 0.7);
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(1, `rgba(0,0,0,${eb / 100})`);
        maskCtx.fillStyle = gradient;
        maskCtx.fillRect(0, 0, width, height);
        maskCtx.globalCompositeOperation = 'source-in';
        maskCtx.drawImage(tempCanvas, 0, 0);
        
        ctx.drawImage(maskCanvas, 0, 0);
      }
    }
  }

  // 1.5 Halation (ハレーション)
  const hl = params.halation * intensity;
  if (hl > 0) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');
    if (tempCtx) {
      tempCtx.drawImage(canvas, 0, 0);
      tempCtx.globalCompositeOperation = 'screen';
      tempCtx.filter = `blur(${Math.max(2, hl / 10)}px) contrast(150%) brightness(80%) sepia(100%) hue-rotate(-30deg) saturate(300%)`;
      tempCtx.drawImage(canvas, 0, 0);
      
      ctx.globalAlpha = hl / 100;
      ctx.globalCompositeOperation = 'screen';
      ctx.drawImage(tempCanvas, 0, 0);
      ctx.globalAlpha = 1.0;
      ctx.globalCompositeOperation = 'source-over';
    }
  }

  // 2. Pixel manipulation
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const originalData = new Uint8ClampedArray(data);

  const b = params.brightness * intensity;
  const c = params.contrast * intensity;
  const s = params.saturation * intensity;
  const sep = params.sepia * intensity;
  const n = params.noise * intensity;
  const ca = Math.floor(params.chromaticAberration * intensity * (width / 800));
  
  // 新規追加: ブラウン管の歪みと色のにじみ
  const crt = (params.crtCurve * intensity) / 500; // max 0.2
  const ld = (params.lensDistortion * intensity) / 500; // max 0.2
  const totalDistortion = crt + ld;
  const cb = Math.floor((params.colorBleed * intensity) / 10); // max 10px smear
  const tj = params.tapeJitter * intensity; // Tape Jitter
  const cs = params.colorShift * intensity; // Color Shift
  const ja = params.jpegArtifacts * intensity; // JPEG Artifacts
  const gb = params.gameboy * intensity; // Game Boy
  
  const gbPalette = [
    [15, 56, 15],   // Darkest
    [48, 98, 48],   // Dark
    [139, 172, 15], // Light
    [155, 188, 15]  // Lightest
  ];
  const bayer = [
    [ 0, 8, 2, 10],
    [12, 4,14,  6],
    [ 3,11, 1,  9],
    [15, 7,13,  5]
  ];
  const pixScale = Math.max(0.05, 1 - ((params.pixelate * intensity) / 100) * 0.9);
  const pixelSize = 1 / pixScale;

  const cx = width / 2;
  const cy = height / 2;

  const contrastFactor = (259 * (c + 255)) / (255 * (259 - c));

  // Pre-calculate jitter for each line
  const lineJitter = new Int32Array(height);
  if (tj > 0) {
    for (let y = 0; y < height; y++) {
      // Randomly shift lines left or right by a few pixels
      if (Math.random() < (tj / 100)) {
        lineJitter[y] = Math.floor((Math.random() - 0.5) * (tj / 10));
      }
    }
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let srcX = x;
      let srcY = y;

      // Tape Jitter (Horizontal line displacement)
      if (tj > 0) {
        srcX += lineJitter[y];
      }

      // CRT Curvature & Lens Distortion (樽型歪み)
      if (totalDistortion > 0) {
        const nx = (x - cx) / cx;
        const ny = (y - cy) / cy;
        const r2 = nx * nx + ny * ny;
        srcX = Math.round(cx + (srcX - cx) * (1 + totalDistortion * r2));
        srcY = Math.round(cy + (srcY - cy) * (1 + totalDistortion * r2));
      }

      const i = (y * width + x) * 4;

      // 画面外は黒にする
      if (srcX < 0 || srcX >= width || srcY < 0 || srcY >= height) {
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 0;
        continue;
      }

      const srcI = (srcY * width + srcX) * 4;
      let r = originalData[srcI];
      let g = originalData[srcI + 1];
      let blue = originalData[srcI + 2];

      // Chromatic Aberration (色ずれ)
      let rX = srcX;
      let bX = srcX;
      if (ca > 0) {
        rX = Math.max(0, srcX - ca);
        bX = Math.min(width - 1, srcX + ca);
        r = originalData[(srcY * width + rX) * 4];
        blue = originalData[(srcY * width + bX) * 4 + 2];
      }

      // Color Bleed (VHS特有の赤・色の横にじみ - Y/C Delay)
      if (cb > 0) {
        let rSum = 0;
        let bSum = 0;
        let count = 0;
        for (let dx = 0; dx < cb; dx++) {
          const smearX = Math.min(width - 1, rX + dx);
          const smearBX = Math.min(width - 1, bX + dx);
          rSum += originalData[(srcY * width + smearX) * 4];
          bSum += originalData[(srcY * width + smearBX) * 4 + 2];
          count++;
        }
        r = rSum / count;
        blue = bSum / count;
      }

      // Contrast
      if (c !== 0) {
        r = contrastFactor * (r - 128) + 128;
        g = contrastFactor * (g - 128) + 128;
        blue = contrastFactor * (blue - 128) + 128;
      }

      // Brightness
      if (b !== 0) {
        r += b;
        g += b;
        blue += b;
      }

      // Saturation
      if (s !== 0) {
        const lum = 0.299 * r + 0.587 * g + 0.114 * blue;
        const satFactor = 1 + s / 100;
        r = lum + (r - lum) * satFactor;
        g = lum + (g - lum) * satFactor;
        blue = lum + (blue - lum) * satFactor;
      }

      // Sepia
      if (sep > 0) {
        const sepiaR = (r * 0.393) + (g * 0.769) + (blue * 0.189);
        const sepiaG = (r * 0.349) + (g * 0.686) + (blue * 0.168);
        const sepiaB = (r * 0.272) + (g * 0.534) + (blue * 0.131);
        const sepiaAmount = sep / 100;
        r = r + (sepiaR - r) * sepiaAmount;
        g = g + (sepiaG - g) * sepiaAmount;
        blue = blue + (sepiaB - blue) * sepiaAmount;
      }

      // Noise
      if (n > 0) {
        const noiseVal = (Math.random() - 0.5) * n * 2;
        r += noiseVal;
        g += noiseVal;
        blue += noiseVal;
      }

      // Film Grain (中間調に強く出る粒状ノイズ)
      const fg = params.filmGrain * intensity;
      if (fg > 0) {
        const lum = 0.299 * r + 0.587 * g + 0.114 * blue;
        const midtoneMask = 1 - Math.abs(lum - 128) / 128; // 1 at 128, 0 at 0 and 255
        const noiseVal = (Math.random() - 0.5) * fg * 1.5 * (0.5 + 0.5 * midtoneMask);
        r += noiseVal;
        g += noiseVal;
        blue += noiseVal;
      }

      // Posterize (色数減)
      const p = params.posterize * intensity;
      if (p > 0) {
        const levels = Math.max(2, 32 - (p / 100) * 30); // 32 down to 2
        const factor = 255 / (levels - 1);
        r = Math.round(r / factor) * factor;
        g = Math.round(g / factor) * factor;
        blue = Math.round(blue / factor) * factor;
      }

      // Color Shift (クロスプロセス風)
      if (cs > 0) {
        const shiftAmount = cs / 100;
        const lum = 0.299 * r + 0.587 * g + 0.114 * blue;
        
        if (lum > 128) {
          const factor = (lum - 128) / 127;
          r += 40 * factor * shiftAmount;
          g += 10 * factor * shiftAmount;
          blue -= 30 * factor * shiftAmount;
        } else {
          const factor = (128 - lum) / 128;
          r -= 30 * factor * shiftAmount;
          g += 20 * factor * shiftAmount;
          blue += 40 * factor * shiftAmount;
        }
      }

      // JPEG Artifacts (8x8 block noise)
      if (ja > 0) {
        const blockSize = 8;
        const blockX = Math.floor(x / blockSize);
        const blockY = Math.floor(y / blockSize);
        const blockHash = Math.sin(blockX * 12.9898 + blockY * 78.233) * 43758.5453;
        const blockNoise = (blockHash - Math.floor(blockHash) - 0.5) * ja;
        
        r += blockNoise;
        g += blockNoise;
        blue += blockNoise;
        
        if (ja > 30) {
           const q = 5 + (ja - 30) / 2;
           r = Math.round(r / q) * q;
           g = Math.round(g / q) * q;
           blue = Math.round(blue / q) * q;
        }
      }

      // Game Boy Camera Effect
      if (gb > 0) {
        const lum = 0.299 * r + 0.587 * g + 0.114 * blue;
        const ditherX = Math.floor(x / pixelSize) % 4;
        const ditherY = Math.floor(y / pixelSize) % 4;
        const dither = (bayer[ditherY][ditherX] / 16) - 0.5;
        
        const adjustedLum = lum + dither * 64; // 64 is dither spread
        
        let idx = Math.floor(adjustedLum / 64);
        idx = Math.max(0, Math.min(3, idx));
        
        const blend = gb / 100;
        r = r * (1 - blend) + gbPalette[idx][0] * blend;
        g = g * (1 - blend) + gbPalette[idx][1] * blend;
        blue = blue * (1 - blend) + gbPalette[idx][2] * blend;
      }

      data[i] = Math.min(255, Math.max(0, r));
      data[i + 1] = Math.min(255, Math.max(0, g));
      data[i + 2] = Math.min(255, Math.max(0, blue));
    }
  }

  ctx.putImageData(imageData, 0, 0);

  // 3. Glitch (横ブレ)
  const g = params.glitch * intensity;
  if (g > 0) {
    const maxShift = g * (width / 500);
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');
    if (tempCtx) {
      tempCtx.drawImage(canvas, 0, 0);
      ctx.clearRect(0, 0, width, height);
      let y = 0;
      while (y < height) {
        const sliceHeight = Math.random() * 15 + 5;
        let shift = 0;
        if (Math.random() < (g / 100)) {
          shift = (Math.random() - 0.5) * maxShift;
        }
        ctx.drawImage(tempCanvas, 0, y, width, sliceHeight, shift, y, width, sliceHeight);
        y += sliceHeight;
      }
    }
  }

  // 4. Tracking Band (テープ下部のトラッキングノイズ)
  const tb = params.trackingBand * intensity;
  if (tb > 0) {
    const bandHeight = Math.max(10, Math.floor(height * 0.15 * (tb / 100)));
    const bandY = height - bandHeight - Math.floor(height * 0.05);
    
    if (bandY > 0 && bandHeight > 0) {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = width;
      tempCanvas.height = height;
      const tempCtx = tempCanvas.getContext('2d');
      if (tempCtx) {
        tempCtx.drawImage(canvas, 0, 0);
        
        // 白飛びノイズ
        ctx.fillStyle = `rgba(255, 255, 255, ${tb / 200})`;
        for (let i = 0; i < tb * 2; i++) {
          ctx.fillRect(Math.random() * width, bandY + Math.random() * bandHeight, Math.random() * 30 + 10, Math.random() * 4 + 1);
        }
        
        // 横ズレ
        let y = bandY;
        while (y < bandY + bandHeight) {
          const sliceHeight = Math.random() * 6 + 2;
          const shift = (Math.random() - 0.5) * tb * 1.5;
          ctx.drawImage(tempCanvas, 0, y, width, sliceHeight, shift, y, width, sliceHeight);
          y += sliceHeight;
        }
      }
    }
  }

  // 4.5 Tape Crease (テープの傷・ドロップアウト)
  const tc = params.tapeCrease * intensity;
  if (tc > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${tc / 150})`;
    const numCreases = Math.floor((tc / 100) * 15);
    for (let i = 0; i < numCreases; i++) {
      const y = Math.random() * height;
      const h = Math.random() * 3 + 1;
      const w = Math.random() * width * 0.8;
      const x = Math.random() * width;
      ctx.fillRect(x, y, w, h);
    }
    
    // 黒いドロップアウト
    ctx.fillStyle = `rgba(0, 0, 0, ${tc / 150})`;
    for (let i = 0; i < numCreases / 2; i++) {
      const y = Math.random() * height;
      const h = Math.random() * 2 + 1;
      const w = Math.random() * width * 0.5;
      const x = Math.random() * width;
      ctx.fillRect(x, y, w, h);
    }
  }

  // 5. Vignette
  const v = params.vignette * intensity;
  if (v > 0) {
    const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) / 1.5);
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, `rgba(0,0,0,${v / 100})`);
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'source-over';
  }

  // 5.2 Light Leak (ライトリーク・感光)
  const ll = params.lightLeak * intensity;
  if (ll > 0) {
    const gradient = ctx.createLinearGradient(0, 0, width * 0.4, height * 0.4);
    gradient.addColorStop(0, `rgba(255, 80, 0, ${ll / 150})`);
    gradient.addColorStop(0.5, `rgba(255, 0, 0, ${ll / 300})`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    if (ll > 30) {
      const gradient2 = ctx.createLinearGradient(width, height, width * 0.6, height * 0.2);
      gradient2.addColorStop(0, `rgba(255, 120, 40, ${(ll - 30) / 150})`);
      gradient2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, width, height);
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  // 5.4 Dust and Scratches (チリと傷)
  const ds = params.dustAndScratches * intensity;
  if (ds > 0) {
    // 縦の傷（Scratches）
    ctx.fillStyle = `rgba(0, 0, 0, ${ds / 200})`;
    const numScratches = Math.floor((ds / 100) * 8);
    for (let i = 0; i < numScratches; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height * 0.2;
      const w = Math.random() * 2 + 1;
      const h = Math.random() * height * 0.8 + height * 0.2;
      ctx.fillRect(x, y, w, h);
    }
    
    // 白いチリ（Dust）
    ctx.fillStyle = `rgba(255, 255, 255, ${ds / 150})`;
    const numDust = Math.floor((ds / 100) * 40);
    for (let i = 0; i < numDust; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 2.5 + 0.5;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 6. Timestamp / OSD (日付・PLAY表示)
  const ts = params.timestamp * intensity;
  if (ts > 0) {
    const isVHS = params.scanlines > 0 || params.trackingBand > 0 || params.tapeJitter > 0;
    
    let vhsDate = "1998. 7. 24";
    let dispDate = "'98  7 24";
    if (customDate) {
      const [y, m, d] = customDate.split('-');
      if (y && m && d) {
        vhsDate = `${y}. ${parseInt(m, 10)}. ${parseInt(d, 10)}`;
        dispDate = `'${y.slice(2)}  ${parseInt(m, 10)} ${parseInt(d, 10)}`;
      }
    }

    let vhsTime = "AM 10:30";
    if (customTime) {
      let [h, min] = customTime.split(':').map(Number);
      if (!isNaN(h) && !isNaN(min)) {
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        vhsTime = `${ampm} ${h}:${min.toString().padStart(2, '0')}`;
      }
    }

    if (isVHS) {
      ctx.fillStyle = `rgba(255, 255, 255, ${ts / 100})`;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      const fontSize = Math.max(16, Math.floor(height * 0.06));
      ctx.font = `${fontSize}px "VT323", "VCR OSD Mono", "Courier New", Courier, monospace`;
      
      const paddingX = width * 0.08;
      const paddingY = height * 0.12;
      
      // PLAY with blinking effect simulation (slightly transparent sometimes)
      const playAlpha = Math.random() > 0.1 ? 1 : 0.4;
      ctx.fillStyle = `rgba(255, 255, 255, ${(ts / 100) * playAlpha})`;
      ctx.fillText("PLAY ►", paddingX, paddingY);
      
      ctx.fillStyle = `rgba(255, 255, 255, ${ts / 100})`;
      ctx.fillText("SP", width - paddingX - fontSize * 1.5, paddingY);
      
      // Randomize time slightly for "live" feel if wanted, but static is fine for a filter
      ctx.fillText(vhsDate, paddingX, height - paddingY);
      ctx.fillText(vhsTime, width - paddingX - fontSize * 4.5, height - paddingY);
      
      ctx.shadowColor = 'transparent';
    } else {
      // 写ルンです風などのオレンジ日付
      ctx.fillStyle = `rgba(255, 120, 0, ${ts / 100})`;
      const fontSize = Math.max(14, Math.floor(height * 0.04));
      ctx.font = `bold ${fontSize}px "Courier New", Courier, monospace`;
      
      // 少しにじませる
      ctx.shadowColor = 'rgba(255, 100, 0, 0.5)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      const paddingX = width * 0.05;
      const paddingY = height * 0.05;
      
      // 右下に配置 ('98 7 24 のようなフォーマット)
      ctx.textAlign = "right";
      ctx.fillText(dispDate, width - paddingX, height - paddingY);
      ctx.textAlign = "left"; // 戻す
      
      ctx.shadowColor = 'transparent';
    }
  }

  // 7. Scanlines (ガビガビ走査線)
  const sl = params.scanlines * intensity;
  if (sl > 0) {
    const lineThickness = Math.max(3, Math.floor(height / 150));
    const lineSpacing = lineThickness * 2;
    
    for (let y = 0; y < height; y += lineSpacing) {
      const noiseAlpha = Math.random() * 0.5 + 0.5;
      const gabigabiShift = (Math.random() - 0.5) * (sl / 5);
      
      ctx.fillStyle = `rgba(0, 0, 0, ${(sl / 200) * noiseAlpha})`;
      ctx.fillRect(gabigabiShift, y, width + Math.abs(gabigabiShift), lineThickness);
    }
    
    for (let y = lineThickness; y < height; y += lineSpacing) {
      const noiseAlpha = Math.random() * 0.5 + 0.5;
      const gabigabiShift = (Math.random() - 0.5) * (sl / 5);
      
      ctx.fillStyle = `rgba(255, 255, 255, ${(sl / 400) * noiseAlpha})`;
      ctx.fillRect(gabigabiShift, y, width + Math.abs(gabigabiShift), lineThickness);
    }
  }
};

export default function App() {
  const [theme, setTheme] = useState<'cute' | 'cool'>('cute');
  const [previewImage, setPreviewImage] = useState<HTMLImageElement | null>(null);
  const [preset, setPreset] = useState<string>('normal');
  const [intensity, setIntensity] = useState<number>(100);
  const [customParams, setCustomParams] = useState<FilterParams>(PRESETS.normal.params);
  const [showDetails, setShowDetails] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [customDate, setCustomDate] = useState<string>('1998-07-24');
  const [customTime, setCustomTime] = useState<string>('10:30');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const styles = themeStyles[theme];

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('画像ファイルを選択してください。');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setPreviewImage(img);
        setPreset('normal');
        setCustomParams(PRESETS.normal.params);
        setIntensity(100);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  useEffect(() => {
    if (!previewImage || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const MAX_PREVIEW_WIDTH = 800;
    let width = previewImage.width;
    let height = previewImage.height;
    if (width > MAX_PREVIEW_WIDTH) {
      height = Math.floor(height * (MAX_PREVIEW_WIDTH / width));
      width = MAX_PREVIEW_WIDTH;
    }
    canvas.width = width;
    canvas.height = height;

    applyFilters(canvas, ctx, previewImage, customParams, intensity / 100, customDate, customTime);
  }, [previewImage, customParams, intensity, customDate, customTime]);

  const handleDownload = () => {
    if (!previewImage) return;
    setIsDownloading(true);
    
    setTimeout(() => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = previewImage.width;
        canvas.height = previewImage.height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          applyFilters(canvas, ctx, previewImage, customParams, intensity / 100, customDate, customTime);
          const link = document.createElement('a');
          link.download = `cosplay_filter_${Date.now()}.png`;
          link.href = canvas.toDataURL('image/png', 1.0);
          link.click();
        }
      } catch (e) {
        console.error("Download failed", e);
        alert("画像の保存に失敗しました。");
      } finally {
        setIsDownloading(false);
      }
    }, 50);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${styles.bg} ${styles.text}`}>
      <header className={`${styles.header} py-4 px-6 flex justify-between items-center sticky top-0 z-10`}>
        <div className="flex items-center gap-2">
          <Camera className="w-6 h-6" />
          <h1 className="text-xl font-bold tracking-wider">Cosplay Filter</h1>
        </div>
        <div className="flex bg-black/10 rounded-full p-1">
          <button 
            onClick={() => setTheme('cute')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${theme === 'cute' ? 'bg-white text-pink-500 shadow-sm' : 'text-white/70 hover:text-white'}`}
          >
            可愛い
          </button>
          <button 
            onClick={() => setTheme('cool')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${theme === 'cool' ? 'bg-gray-800 text-indigo-400 shadow-sm' : 'text-white/70 hover:text-white'}`}
          >
            クール
          </button>
        </div>
      </header>

      <main className="p-4 md:p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
          
          {/* 左側：プレビューエリア */}
          <div className={`lg:col-span-7 flex flex-col gap-4 sticky top-[72px] lg:top-24 z-20 pt-2 pb-4 ${styles.bg} -mx-4 px-4 md:mx-0 md:px-0`}>
            <div 
              className={`${styles.panel} p-4 flex-grow flex flex-col items-center justify-center min-h-[300px] lg:min-h-[400px] relative overflow-hidden`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
            >
              {!previewImage ? (
                <div 
                  className={`flex flex-col items-center justify-center w-full h-full border-2 border-dashed ${theme === 'cute' ? 'border-pink-300 bg-pink-50/50' : 'border-gray-700 bg-gray-800/50'} rounded-2xl cursor-pointer transition-colors hover:bg-opacity-80`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className={`w-12 h-12 mb-4 ${styles.icon} opacity-80`} />
                  <p className="text-lg font-medium">画像を選択してアップロード</p>
                  <p className="text-sm opacity-60 mt-2">またはドラッグ＆ドロップ</p>
                </div>
              ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                  <canvas ref={canvasRef} className="max-w-full max-h-[40vh] lg:max-h-[60vh] object-contain rounded-lg shadow-sm" />
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={(e) => e.target.files && handleFile(e.target.files[0])} 
                accept="image/*" 
                className="hidden" 
              />
            </div>

            {/* アクションボタン */}
            <div className="flex gap-4">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 ${styles.buttonSecondary}`}
              >
                <ImageIcon className="w-5 h-5" />
                別の画像を選ぶ
              </button>
              <button 
                onClick={handleDownload}
                disabled={!previewImage || isDownloading}
                className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 ${styles.buttonPrimary} ${( !previewImage || isDownloading ) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Download className="w-5 h-5" />
                {isDownloading ? '保存中...' : '画像を保存'}
              </button>
            </div>
          </div>

          {/* 右側：コントロールエリア */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* プリセット */}
            <div className={`${styles.panel} p-6`}>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className={`w-5 h-5 ${styles.icon}`} />
                <h2 className="text-lg font-bold">フィルターを選ぶ</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(PRESETS).map(([key, { name, params }]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setPreset(key);
                      setCustomParams(params);
                    }}
                    className={`py-2 px-3 text-sm text-center transition-all ${preset === key ? styles.buttonActive : styles.buttonSecondary}`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {/* 強度と詳細設定 */}
            <div className={`${styles.panel} p-6 flex-grow flex flex-col`}>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="font-bold flex items-center gap-2">
                    <Palette className={`w-5 h-5 ${styles.icon}`} />
                    フィルターの強さ
                  </label>
                  <span className="text-sm font-medium">{intensity}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={intensity} 
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className={`w-full h-2 bg-black/10 rounded-lg appearance-none ${styles.slider}`}
                />
              </div>

              <div className="border-t border-black/10 pt-4 flex-grow flex flex-col">
                <button 
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center justify-between w-full py-2 font-bold"
                >
                  <div className="flex items-center gap-2">
                    <Settings2 className={`w-5 h-5 ${styles.icon}`} />
                    細かく調整する
                  </div>
                  {showDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>

                {showDetails && (
                  <div className="mt-4 space-y-5 pr-2 overflow-y-auto custom-scrollbar flex-grow max-h-[40vh] lg:max-h-[60vh]">
                    {PARAM_CONFIG.filter(config => preset === 'custom' || PRESETS[preset]?.activeParams.includes(config.key as keyof FilterParams)).map(({ key, label, min, max, type }) => (
                      <div key={key}>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-sm font-medium opacity-80">{label}</label>
                          {type !== 'boolean' && <span className="text-xs opacity-60">{customParams[key as keyof FilterParams]}</span>}
                        </div>
                        {type === 'boolean' ? (
                          <div className="mt-1">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="sr-only peer"
                                checked={customParams[key as keyof FilterParams] > 0}
                                onChange={(e) => {
                                  setCustomParams(prev => ({ ...prev, [key]: e.target.checked ? 100 : 0 }));
                                }}
                              />
                              <div className={`w-11 h-6 bg-black/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${theme === 'cute' ? 'peer-checked:bg-pink-400' : 'peer-checked:bg-indigo-500'}`}></div>
                            </label>
                            {key === 'timestamp' && customParams.timestamp > 0 && (
                              <div className="flex gap-3 mt-3 p-3 bg-black/5 rounded-xl border border-black/5">
                                <div className="flex-1">
                                  <label className="block text-xs font-bold opacity-70 mb-1.5">日付</label>
                                  <input 
                                    type="date" 
                                    value={customDate} 
                                    onChange={(e) => setCustomDate(e.target.value)} 
                                    className={`w-full bg-white/80 dark:bg-black/20 border border-black/10 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 ${theme === 'cute' ? 'focus:ring-pink-400' : 'focus:ring-indigo-500'} transition-shadow`} 
                                  />
                                </div>
                                <div className="flex-1">
                                  <label className="block text-xs font-bold opacity-70 mb-1.5">時間</label>
                                  <input 
                                    type="time" 
                                    value={customTime} 
                                    onChange={(e) => setCustomTime(e.target.value)} 
                                    className={`w-full bg-white/80 dark:bg-black/20 border border-black/10 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 ${theme === 'cute' ? 'focus:ring-pink-400' : 'focus:ring-indigo-500'} transition-shadow`} 
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <input 
                            type="range" 
                            min={min} max={max} 
                            value={customParams[key as keyof FilterParams]} 
                            onChange={(e) => {
                              setCustomParams(prev => ({ ...prev, [key]: Number(e.target.value) }));
                            }}
                            className={`w-full h-1.5 bg-black/10 rounded-lg appearance-none ${styles.slider}`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
