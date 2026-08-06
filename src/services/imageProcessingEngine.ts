import { WaferSample, DefectItem, QualityMetrics } from '../types/semicon';

/**
 * Generate a realistic Semiconductor SEM (Scanning Electron Microscope) canvas
 */
export function drawSemiconPattern(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  type: 'die' | 'finfet' | 'euv' | 'void' | 'interconnect'
) {
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, width, height);

  // Background grain texture
  const bgData = ctx.getImageData(0, 0, width, height);
  for (let i = 0; i < bgData.data.length; i += 4) {
    const val = 15 + Math.random() * 25;
    bgData.data[i] = val;
    bgData.data[i + 1] = val + 5;
    bgData.data[i + 2] = val + 15;
  }
  ctx.putImageData(bgData, 0, 0);

  if (type === 'finfet') {
    // Parallel sub-10nm FinFET silicon channels
    const spacing = 28;
    for (let x = 30; x < width; x += spacing) {
      const grad = ctx.createLinearGradient(x, 0, x + 14, 0);
      grad.addColorStop(0, '#1e293b');
      grad.addColorStop(0.5, '#00aeef');
      grad.addColorStop(1, '#0f62fe');

      ctx.fillStyle = grad;
      ctx.fillRect(x, 20, 14, height - 40);

      // Gate lines perpendicular
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      for (let y = 40; y < height - 40; y += 45) {
        ctx.beginPath();
        ctx.moveTo(x - 5, y);
        ctx.lineTo(x + 19, y);
        ctx.stroke();
      }
    }
  } else if (type === 'euv') {
    // EUV Photolithography Reticle Mask Pattern
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#00aeef';
    for (let r = 40; r < Math.min(width, height) / 2 - 20; r += 35) {
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    // Cross grid
    ctx.strokeStyle = '#0f62fe';
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 6) {
      ctx.beginPath();
      ctx.moveTo(width / 2, height / 2);
      ctx.lineTo(
        width / 2 + Math.cos(angle) * (width / 2 - 30),
        height / 2 + Math.sin(angle) * (height / 2 - 30)
      );
      ctx.stroke();
    }
  } else if (type === 'void') {
    // TSV Micro-Void & Copper Pillars
    const cols = 5;
    const rows = 4;
    const stepX = width / (cols + 1);
    const stepY = height / (rows + 1);

    for (let i = 1; i <= cols; i++) {
      for (let j = 1; j <= rows; j++) {
        const cx = i * stepX;
        const cy = j * stepY;

        ctx.fillStyle = '#1e3a8a';
        ctx.beginPath();
        ctx.arc(cx, cy, 32, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(cx, cy, 20, 0, Math.PI * 2);
        ctx.fill();

        // Copper core
        ctx.fillStyle = '#60a5fa';
        ctx.beginPath();
        ctx.arc(cx, cy, 8, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else {
    // Silicon Wafer Die Grid Pattern
    const step = 40;
    ctx.strokeStyle = 'rgba(15, 98, 254, 0.4)';
    ctx.lineWidth = 1.5;

    for (let x = 0; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Circuit IC Blocks
    for (let x = 10; x < width; x += step * 2) {
      for (let y = 10; y < height; y += step * 2) {
        ctx.fillStyle = 'rgba(0, 174, 239, 0.2)';
        ctx.fillRect(x + 5, y + 5, step - 10, step - 10);

        ctx.fillStyle = '#2563eb';
        ctx.fillRect(x + 12, y + 12, step - 24, step - 24);
      }
    }
  }
}

/**
 * Add high-frequency Gaussian + Speckle noise to simulate SEM raw detector output
 */
export function addSyntheticSemNoise(
  sourceCanvas: HTMLCanvasElement,
  targetCanvas: HTMLCanvasElement,
  noiseLevel: number = 0.45
) {
  const ctx = targetCanvas.getContext('2d');
  if (!ctx) return;

  targetCanvas.width = sourceCanvas.width;
  targetCanvas.height = sourceCanvas.height;

  ctx.drawImage(sourceCanvas, 0, 0);
  const imgData = ctx.getImageData(0, 0, targetCanvas.width, targetCanvas.height);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Calculate intensity
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;

    // Add noise factor
    const noise = (Math.random() - 0.5) * 255 * noiseLevel;
    const speckle = Math.random() < 0.04 ? (Math.random() - 0.5) * 180 : 0;

    const finalVal = Math.min(255, Math.max(0, gray + noise + speckle));

    data[i] = finalVal;
    data[i + 1] = Math.min(255, Math.max(0, finalVal + 5));
    data[i + 2] = Math.min(255, Math.max(0, finalVal + 15));
  }

  ctx.putImageData(imgData, 0, 0);
}

/**
 * Restormer AI Image Restoration Filter Simulation
 */
export function applyRestormerAI(
  noisyCanvas: HTMLCanvasElement,
  restoredCanvas: HTMLCanvasElement
) {
  const ctx = restoredCanvas.getContext('2d');
  if (!ctx) return;

  restoredCanvas.width = noisyCanvas.width;
  restoredCanvas.height = noisyCanvas.height;

  // Denoise using spatial median + bilateral contrast enhancement
  ctx.drawImage(noisyCanvas, 0, 0);
  const imgData = ctx.getImageData(0, 0, restoredCanvas.width, restoredCanvas.height);
  const data = imgData.data;
  const w = restoredCanvas.width;
  const h = restoredCanvas.height;

  const copy = new Uint8ClampedArray(data);

  // 3x3 Denoising & Sharpening kernel
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = (y * w + x) * 4;

      // Average 3x3 neighborhood
      let sumR = 0, sumG = 0, sumB = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nIdx = ((y + dy) * w + (x + dx)) * 4;
          sumR += copy[nIdx];
          sumG += copy[nIdx + 1];
          sumB += copy[nIdx + 2];
        }
      }

      const avgR = sumR / 9;
      const avgG = sumG / 9;
      const avgB = sumB / 9;

      // Unsharp mask boost for semiconductor micro-edges
      const centerR = copy[idx];
      const sharpR = centerR + (centerR - avgR) * 1.6;
      const sharpG = copy[idx + 1] + (copy[idx + 1] - avgG) * 1.6;
      const sharpB = copy[idx + 2] + (copy[idx + 2] - avgB) * 1.6;

      data[idx] = Math.min(255, Math.max(0, sharpR));
      data[idx + 1] = Math.min(255, Math.max(0, sharpG));
      data[idx + 2] = Math.min(255, Math.max(0, sharpB));
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

/**
 * Generate Difference Heatmap (Error map)
 */
export function generateDifferenceHeatmap(
  degradedCanvas: HTMLCanvasElement,
  restoredCanvas: HTMLCanvasElement,
  targetCanvas: HTMLCanvasElement
) {
  const ctx = targetCanvas.getContext('2d');
  if (!ctx) return;

  const w = (targetCanvas.width = degradedCanvas.width);
  const h = (targetCanvas.height = degradedCanvas.height);

  const ctxDeg = degradedCanvas.getContext('2d');
  const ctxRes = restoredCanvas.getContext('2d');

  if (!ctxDeg || !ctxRes) return;

  const degData = ctxDeg.getImageData(0, 0, w, h).data;
  const resData = ctxRes.getImageData(0, 0, w, h).data;

  const heatmap = ctx.createImageData(w, h);
  const hData = heatmap.data;

  for (let i = 0; i < degData.length; i += 4) {
    const diff = Math.abs(degData[i] - resData[i]) / 255; // 0..1

    // JET Colormap (Blue -> Cyan -> Yellow -> Red)
    let r = 0, g = 0, b = 0;
    if (diff < 0.25) {
      b = 255;
      g = Math.round(diff * 4 * 255);
    } else if (diff < 0.5) {
      g = 255;
      b = Math.round((0.5 - diff) * 4 * 255);
    } else if (diff < 0.75) {
      g = 255;
      r = Math.round((diff - 0.5) * 4 * 255);
    } else {
      r = 255;
      g = Math.round((1 - diff) * 4 * 255);
    }

    hData[i] = r;
    hData[i + 1] = g;
    hData[i + 2] = b;
    hData[i + 3] = 255;
  }

  ctx.putImageData(heatmap, 0, 0);
}

/**
 * Generate Sobel Edge Map
 */
export function generateSobelEdgeMap(
  sourceCanvas: HTMLCanvasElement,
  targetCanvas: HTMLCanvasElement
) {
  const ctx = targetCanvas.getContext('2d');
  if (!ctx) return;

  const w = (targetCanvas.width = sourceCanvas.width);
  const h = (targetCanvas.height = sourceCanvas.height);

  const srcCtx = sourceCanvas.getContext('2d');
  if (!srcCtx) return;

  const srcData = srcCtx.getImageData(0, 0, w, h).data;
  const edgeImg = ctx.createImageData(w, h);
  const edgeData = edgeImg.data;

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = (y * w + x) * 4;

      // Sobel Kernels
      // Gx = [-1 0 1; -2 0 2; -1 0 1]
      // Gy = [-1 -2 -1; 0 0 0; 1 2 1]

      let gx = 0;
      let gy = 0;

      const p00 = srcData[((y - 1) * w + (x - 1)) * 4];
      const p01 = srcData[((y - 1) * w + x) * 4];
      const p02 = srcData[((y - 1) * w + (x + 1)) * 4];
      const p10 = srcData[(y * w + (x - 1)) * 4];
      const p12 = srcData[(y * w + (x + 1)) * 4];
      const p20 = srcData[((y + 1) * w + (x - 1)) * 4];
      const p21 = srcData[((y + 1) * w + x) * 4];
      const p22 = srcData[((y + 1) * w + (x + 1)) * 4];

      gx = -p00 + p02 - 2 * p10 + 2 * p12 - p20 + p22;
      gy = -p00 - 2 * p01 - p02 + p20 + 2 * p21 + p22;

      const mag = Math.min(255, Math.sqrt(gx * gx + gy * gy));

      edgeData[idx] = 0;
      edgeData[idx + 1] = mag > 40 ? Math.round(mag * 0.9) : 0;
      edgeData[idx + 2] = mag > 40 ? 255 : 0;
      edgeData[idx + 3] = 255;
    }
  }

  ctx.putImageData(edgeImg, 0, 0);
}

/**
 * Preset Semiconductor Samples with realistic data
 */
export const PRESET_WAFER_SAMPLES: WaferSample[] = [
  {
    id: 'waf-7nm-0941',
    title: 'Sub-7nm FinFET Gate Transistor Array',
    category: 'Sub-7nm FinFET',
    waferLot: 'TSMC-N7-LOT-8829',
    foundry: 'TSMC Fab 18 (Hsinchu)',
    resolution: '4096 x 4096 (0.3nm/px)',
    originalImage: '',
    noisyImage: '',
    restoredImage: '',
    timestamp: '2026-08-05 14:22:10 UTC',
    metrics: {
      psnr: 39.8,
      ssim: 0.989,
      noiseReductionPct: 96.4,
      restorationConfidence: 99.4,
      processingTimeMs: 16.2,
      gpuMemoryGb: 4.8,
      resolutionScale: '4x',
      inferenceSpeedFps: 156,
      snrGainDb: 15.6,
    },
    defects: [
      {
        id: 'def-101',
        label: 'Gate Oxide Pin-hole',
        category: 'void',
        bbox: { x: 38, y: 28, width: 14, height: 14 },
        confidence: 0.972,
        severity: 'critical',
        areaUm2: 0.042,
        description: 'Micro-void detected in silicon dioxide gate layer causing potential leakage current.',
      },
      {
        id: 'def-102',
        label: 'Interconnect Scratch',
        category: 'scratch',
        bbox: { x: 65, y: 62, width: 22, height: 10 },
        confidence: 0.941,
        severity: 'major',
        areaUm2: 0.118,
        description: 'Physical surface scratch across metal layer line M3.',
      },
    ],
  },
  {
    id: 'waf-euv-3301',
    title: 'EUV Photolithography Reticle Mask',
    category: 'EUV Gate Mask',
    waferLot: 'INTEL-18A-MASK-004',
    foundry: 'Intel D1X (Oregon)',
    resolution: '8192 x 8192 (0.15nm/px)',
    originalImage: '',
    noisyImage: '',
    restoredImage: '',
    timestamp: '2026-08-05 11:05:40 UTC',
    metrics: {
      psnr: 41.2,
      ssim: 0.994,
      noiseReductionPct: 98.1,
      restorationConfidence: 99.8,
      processingTimeMs: 22.8,
      gpuMemoryGb: 6.2,
      resolutionScale: '4x',
      inferenceSpeedFps: 124,
      snrGainDb: 17.2,
    },
    defects: [
      {
        id: 'def-201',
        label: 'Absorber Particle Contamination',
        category: 'contamination',
        bbox: { x: 48, y: 45, width: 12, height: 12 },
        confidence: 0.988,
        severity: 'critical',
        areaUm2: 0.028,
        description: 'Sub-micrometer airborne particle deposited on EUV pellicle surface.',
      },
    ],
  },
  {
    id: 'waf-tsv-8842',
    title: 'TSV (Through-Silicon Via) Micro-Pillar',
    category: 'TSV Micro-Void',
    waferLot: 'SAMSUNG-3D-HBM3-991',
    foundry: 'Samsung Hwaseong Fab',
    resolution: '2048 x 2048 (0.5nm/px)',
    originalImage: '',
    noisyImage: '',
    restoredImage: '',
    timestamp: '2026-08-05 09:14:02 UTC',
    metrics: {
      psnr: 36.5,
      ssim: 0.974,
      noiseReductionPct: 92.8,
      restorationConfidence: 98.2,
      processingTimeMs: 14.1,
      gpuMemoryGb: 3.6,
      resolutionScale: '2x',
      inferenceSpeedFps: 180,
      snrGainDb: 13.1,
    },
    defects: [
      {
        id: 'def-301',
        label: 'Copper Fill Micro-Void',
        category: 'void',
        bbox: { x: 30, y: 48, width: 16, height: 16 },
        confidence: 0.963,
        severity: 'major',
        areaUm2: 0.185,
        description: 'Incomplete electroplating void inside 3D HBM via interconnect channel.',
      },
    ],
  },
  {
    id: 'waf-die-1002',
    title: 'NVIDIA Blackwell GPU Silicon Die Edge',
    category: 'Silicon Wafer Die',
    waferLot: 'NV-B200-WAFER-4412',
    foundry: 'TSMC Fab 18B (Southern Taiwan)',
    resolution: '4096 x 4096 (0.2nm/px)',
    originalImage: '',
    noisyImage: '',
    restoredImage: '',
    timestamp: '2026-08-05 13:45:22 UTC',
    metrics: {
      psnr: 42.6,
      ssim: 0.996,
      noiseReductionPct: 98.9,
      restorationConfidence: 99.9,
      processingTimeMs: 19.5,
      gpuMemoryGb: 5.4,
      resolutionScale: '4x',
      inferenceSpeedFps: 145,
      snrGainDb: 18.4,
    },
    defects: [],
  },
];
