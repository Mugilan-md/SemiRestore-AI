import React, { useState, useRef, useEffect } from 'react';
import { WaferSample, ComparisonLayout, ViewMode } from '../../types/semicon';
import {
  drawSemiconPattern,
  addSyntheticSemNoise,
  applyRestormerAI,
} from '../../services/imageProcessingEngine';
import {
  ZoomIn,
  ZoomOut,
  Sliders,
  Layers,
  Crosshair,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  FileCheck2,
  Grid,
} from 'lucide-react';

interface ComparisonWorkspaceProps {
  sample: WaferSample;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  showDefects: boolean;
  setShowDefects: (show: boolean) => void;
  onGenerateReport: () => void;
}

export const ComparisonWorkspace: React.FC<ComparisonWorkspaceProps> = ({
  sample,
  viewMode,
  setViewMode,
  showDefects,
  setShowDefects,
  onGenerateReport,
}) => {
  const [layout, setLayout] = useState<ComparisonLayout>('triple');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panPos, setPanPos] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Slider mode position %
  const [sliderPos, setSliderPos] = useState<number>(50);

  // Crosshair Pixel Inspector
  const [crosshairPos, setCrosshairPos] = useState({ x: 200, y: 150 });
  const [pixelInfo, setPixelInfo] = useState({ r: 120, g: 140, b: 180, snr: 39.8 });

  // Canvases
  const origCanvasRef = useRef<HTMLCanvasElement>(null);
  const noisyCanvasRef = useRef<HTMLCanvasElement>(null);
  const restoredCanvasRef = useRef<HTMLCanvasElement>(null);

  // Dedicated slider canvases
  const sliderNoisyCanvasRef = useRef<HTMLCanvasElement>(null);
  const sliderRestoredCanvasRef = useRef<HTMLCanvasElement>(null);

  // Dedicated split canvases
  const splitNoisyCanvasRef = useRef<HTMLCanvasElement>(null);
  const splitRestoredCanvasRef = useRef<HTMLCanvasElement>(null);

  // Render HTML5 Canvas Patterns for current sample
  useEffect(() => {
    const width = 600;
    const height = 450;

    const patternType = sample.category.includes('FinFET')
      ? 'finfet'
      : sample.category.includes('EUV')
      ? 'euv'
      : sample.category.includes('TSV')
      ? 'void'
      : 'die';

    // 1. Triple View
    if (origCanvasRef.current) {
      origCanvasRef.current.width = width;
      origCanvasRef.current.height = height;
      const ctx = origCanvasRef.current.getContext('2d');
      if (ctx) drawSemiconPattern(ctx, width, height, patternType);
    }
    if (origCanvasRef.current && noisyCanvasRef.current) {
      addSyntheticSemNoise(origCanvasRef.current, noisyCanvasRef.current, 0.45);
    }
    if (noisyCanvasRef.current && restoredCanvasRef.current) {
      applyRestormerAI(noisyCanvasRef.current, restoredCanvasRef.current);
    }

    // 2. Slider View
    if (sliderNoisyCanvasRef.current && sliderRestoredCanvasRef.current) {
      const tempOrig = document.createElement('canvas');
      tempOrig.width = width;
      tempOrig.height = height;
      const ctx = tempOrig.getContext('2d');
      if (ctx) drawSemiconPattern(ctx, width, height, patternType);

      addSyntheticSemNoise(tempOrig, sliderNoisyCanvasRef.current, 0.45);
      applyRestormerAI(sliderNoisyCanvasRef.current, sliderRestoredCanvasRef.current);
    }

    // 3. Split View
    if (splitNoisyCanvasRef.current && splitRestoredCanvasRef.current) {
      const tempOrig = document.createElement('canvas');
      tempOrig.width = width;
      tempOrig.height = height;
      const ctx = tempOrig.getContext('2d');
      if (ctx) drawSemiconPattern(ctx, width, height, patternType);

      addSyntheticSemNoise(tempOrig, splitNoisyCanvasRef.current, 0.45);
      applyRestormerAI(splitNoisyCanvasRef.current, splitRestoredCanvasRef.current);
    }
  }, [sample, layout]);

  // Handle Pan & Zoom
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    setPanStart({ x: e.clientX - panPos.x, y: e.clientY - panPos.y });
  };

  const handleMouseMove = (e: React.MouseEvent, canvasContainer: HTMLDivElement | null) => {
    if (isPanning) {
      setPanPos({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }

    if (canvasContainer) {
      const rect = canvasContainer.getBoundingClientRect();
      const x = Math.floor(e.clientX - rect.left);
      const y = Math.floor(e.clientY - rect.top);
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        setCrosshairPos({ x, y });
        // Sim pixel stats
        const pseudoIntensity = Math.floor((x * 0.7 + y * 0.5) % 255);
        setPixelInfo({
          r: pseudoIntensity,
          g: Math.min(255, pseudoIntensity + 15),
          b: Math.min(255, pseudoIntensity + 35),
          snr: Math.round((38.0 + (x % 5) * 0.4) * 10) / 10,
        });
      }
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  return (
    <div className="space-y-6">
      {/* Workspace Control Bar with Moon Dust styling */}
      <div className="moondust-glass rounded-3xl p-5 border border-[#CEB5FF] flex flex-wrap items-center justify-between gap-4 shadow-sm">
        {/* Left: Sample Title & Lot info */}
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-[#D3D3FF] px-2.5 py-0.5 text-[10px] font-black text-[#80A8FF]">
              {sample.category}
            </span>
            <h2 className="text-sm font-extrabold text-slate-900">{sample.title}</h2>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            Lot: <span className="text-slate-800 font-bold">{sample.waferLot}</span> • {sample.foundry} • Resolution: {sample.resolution}
          </p>
        </div>

        {/* Center: Layout Switcher */}
        <div className="flex items-center gap-1 bg-[#D3D3FF]/40 p-1 rounded-2xl border border-[#CEB5FF]/50">
          {[
            { id: 'triple' as ComparisonLayout, label: 'Triple View', icon: Grid },
            { id: 'slider' as ComparisonLayout, label: 'Before/After Slider', icon: Sliders },
            { id: 'split' as ComparisonLayout, label: 'Split Screen', icon: Layers },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setLayout(mode.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                layout === mode.id
                  ? 'bg-white text-[#80A8FF] shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <mode.icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{mode.label}</span>
            </button>
          ))}
        </div>

        {/* Right: Micro Zoom, Reset, Defect Overlay Toggle & Report */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-[#D3D3FF]/40 p-1 rounded-2xl border border-[#CEB5FF]/50 text-xs font-bold">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.25))}
              className="p-1 rounded-lg hover:bg-white text-slate-700"
              title="Zoom Out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="px-2 text-[11px] font-mono text-slate-900 font-bold">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(4, z + 0.25))}
              className="p-1 rounded-lg hover:bg-white text-slate-700"
              title="Zoom In"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => {
                setZoomLevel(1);
                setPanPos({ x: 0, y: 0 });
              }}
              className="p-1 rounded-lg hover:bg-white text-slate-700"
              title="Reset Zoom"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* AI Defect Bounding Boxes Toggle */}
          <button
            onClick={() => setShowDefects(!showDefects)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition ${
              showDefects
                ? 'bg-gradient-to-r from-[#80A8FF] to-[#CEB5FF] text-white border-transparent shadow-xs'
                : 'bg-white text-slate-700 border-[#CEB5FF] hover:bg-[#D3D3FF]/30'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Defects ({sample.defects.length})</span>
          </button>

          {/* Generate Inspection Certificate */}
          <button
            onClick={onGenerateReport}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition"
          >
            <FileCheck2 className="h-3.5 w-3.5" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Main Viewers Container */}
      <div className="relative">
        {/* Triple View Layout */}
        {layout === 'triple' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Viewer 1: Original Scan */}
            <div className="moondust-glass-dark rounded-3xl p-4 border border-[#8EC1DE]/40 text-white relative overflow-hidden flex flex-col items-center card-3d-dark-tactile cursor-pointer">
              <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs font-bold">
                <span className="text-[#D3D3FF]">Ground Truth Reference</span>
                <span className="text-gold-glitter font-mono">16-bit SEM</span>
              </div>
              <div
                className="relative w-full h-[320px] rounded-2xl overflow-hidden bg-slate-950 cursor-grab active:cursor-grabbing flex items-center justify-center border border-slate-800"
                onMouseDown={handleMouseDown}
                onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
                onMouseUp={handleMouseUp}
              >
                <canvas
                  ref={origCanvasRef}
                  className="max-w-full max-h-full transition-transform duration-75"
                  style={{
                    transform: `scale(${zoomLevel}) translate(${panPos.x}px, ${panPos.y}px)`,
                  }}
                />
              </div>
            </div>

            {/* Viewer 2: Degraded / Noisy Scan */}
            <div className="moondust-glass-dark rounded-3xl p-4 border border-amber-400/40 text-white relative overflow-hidden flex flex-col items-center card-3d-dark-tactile cursor-pointer">
              <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs font-bold">
                <span className="text-amber-300">Degraded Input (Noise)</span>
                <span className="text-gold-glitter font-mono">PSNR 24.2 dB</span>
              </div>
              <div
                className="relative w-full h-[320px] rounded-2xl overflow-hidden bg-slate-950 cursor-grab active:cursor-grabbing flex items-center justify-center border border-slate-800"
                onMouseDown={handleMouseDown}
                onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
                onMouseUp={handleMouseUp}
              >
                <canvas
                  ref={noisyCanvasRef}
                  className="max-w-full max-h-full transition-transform duration-75"
                  style={{
                    transform: `scale(${zoomLevel}) translate(${panPos.x}px, ${panPos.y}px)`,
                  }}
                />
              </div>
            </div>

            {/* Viewer 3: Restormer AI Output with 3D Tactile Depth & Laser Scan */}
            <div className="moondust-glass-dark rounded-3xl p-4 border-2 border-[#80A8FF]/80 text-white relative overflow-hidden flex flex-col items-center ring-2 ring-[#CEB5FF]/30 card-3d-dark-tactile cursor-pointer">
              <div className="laser-scan-line" />
              <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs font-bold">
                <span className="text-gold-glitter flex items-center gap-1.5 font-extrabold">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Restormer AI Output
                </span>
                <span className="text-gold-glitter font-mono text-sm font-black">
                  PSNR {sample.metrics.psnr} dB
                </span>
              </div>
              <div
                className="relative w-full h-[320px] rounded-2xl overflow-hidden bg-slate-950 cursor-grab active:cursor-grabbing flex items-center justify-center border border-slate-800"
                onMouseDown={handleMouseDown}
                onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
                onMouseUp={handleMouseUp}
              >
                <canvas
                  ref={restoredCanvasRef}
                  className="max-w-full max-h-full transition-transform duration-75"
                  style={{
                    transform: `scale(${zoomLevel}) translate(${panPos.x}px, ${panPos.y}px)`,
                  }}
                />

                {/* AI Defect Bounding Boxes Overlay */}
                {showDefects &&
                  sample.defects.map((def) => (
                    <div
                      key={def.id}
                      className="absolute border-2 border-rose-500 bg-rose-500/20 rounded-md pointer-events-none flex flex-col justify-between p-1 shadow-lg"
                      style={{
                        left: `${def.bbox.x}%`,
                        top: `${def.bbox.y}%`,
                        width: `${def.bbox.width}%`,
                        height: `${def.bbox.height}%`,
                      }}
                    >
                      <span className="text-[9px] font-black text-white bg-rose-600 px-1 rounded shadow-xs">
                        {def.label} ({Math.round(def.confidence * 100)}%)
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Before/After Interactive Slider Mode */}
        {layout === 'slider' && (
          <div className="moondust-glass-dark rounded-3xl p-6 border border-[#CEB5FF] text-white relative shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs font-bold">
              <span className="text-amber-300 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                Left: Degraded Raw SEM Scan (Speckle Noise)
              </span>
              <span className="text-gold-glitter font-black flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                Right: Restormer AI Restored Output
              </span>
            </div>

            <div className="relative w-full h-[450px] rounded-2xl overflow-hidden bg-slate-950 select-none border border-slate-800 flex items-center justify-center">
              {/* Bottom Layer: Restored Canvas (Right side) */}
              <div className="absolute inset-0 flex items-center justify-center">
                <canvas
                  ref={sliderRestoredCanvasRef}
                  className="max-w-full max-h-full"
                  style={{
                    transform: `scale(${zoomLevel}) translate(${panPos.x}px, ${panPos.y}px)`,
                  }}
                />
              </div>

              {/* Top Layer: Degraded Canvas (Left side, clipped with inset) */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{
                  clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
                }}
              >
                <canvas
                  ref={sliderNoisyCanvasRef}
                  className="max-w-full max-h-full"
                  style={{
                    transform: `scale(${zoomLevel}) translate(${panPos.x}px, ${panPos.y}px)`,
                  }}
                />
              </div>

              {/* Badges on left & right */}
              <div className="absolute top-4 left-4 z-20 pointer-events-none bg-slate-900/85 backdrop-blur-md border border-amber-400/50 px-3 py-1 rounded-lg text-[11px] font-bold text-amber-300 shadow-md">
                DEGRADED (RAW SCAN)
              </div>
              <div className="absolute top-4 right-4 z-20 pointer-events-none bg-slate-900/85 backdrop-blur-md border border-[#80A8FF]/50 px-3 py-1 rounded-lg text-[11px] font-bold text-gold-glitter shadow-md">
                AI RESTORED (PSNR {sample.metrics.psnr} dB)
              </div>

              {/* Slider Input overlay control */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-40"
              />

              {/* Slider Divider Bar with glowing line & drag handle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-[#80A8FF] via-white to-[#CEB5FF] shadow-[0_0_16px_#80A8FF] z-30 pointer-events-none"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-9 w-9 rounded-full bg-slate-900 text-amber-300 border-2 border-white shadow-2xl flex items-center justify-center text-xs font-black ring-4 ring-[#80A8FF]/40">
                  ↔
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Split Screen Mode */}
        {layout === 'split' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="moondust-glass-dark rounded-3xl p-4 border border-amber-400/40 text-white">
              <div className="text-xs font-bold text-amber-300 mb-2">Degraded Noisy SEM Scan</div>
              <div className="h-[360px] flex items-center justify-center bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
                <canvas
                  ref={splitNoisyCanvasRef}
                  className="max-w-full max-h-full"
                  style={{ transform: `scale(${zoomLevel}) translate(${panPos.x}px, ${panPos.y}px)` }}
                />
              </div>
            </div>
            <div className="moondust-glass-dark rounded-3xl p-4 border border-[#80A8FF] text-white">
              <div className="text-xs font-black text-gold-glitter mb-2 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Restormer AI Restored
              </div>
              <div className="h-[360px] flex items-center justify-center bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
                <canvas
                  ref={splitRestoredCanvasRef}
                  className="max-w-full max-h-full"
                  style={{ transform: `scale(${zoomLevel}) translate(${panPos.x}px, ${panPos.y}px)` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Crosshair Pixel Inspector Panel with Pure Gold readout values */}
      <div className="moondust-glass rounded-2xl p-4 border border-[#CEB5FF] flex flex-wrap items-center justify-between text-xs text-slate-700 shadow-sm">
        <div className="flex items-center gap-3 font-mono">
          <Crosshair className="h-4 w-4 text-[#80A8FF]" />
          <span>
            Coordinates: X=<span className="font-bold text-slate-900">{crosshairPos.x}</span> nm, Y=<span className="font-bold text-slate-900">{crosshairPos.y}</span> nm
          </span>
        </div>

        <div className="flex items-center gap-6 font-mono">
          <span>
            RGB: <span className="font-bold text-slate-900">{pixelInfo.r}, {pixelInfo.g}, {pixelInfo.b}</span>
          </span>
          <span>
            Estimated Local SNR: <span className="font-black text-gold-glitter">{pixelInfo.snr} dB</span>
          </span>
          <span>
            Scale: <span className="font-bold text-[#80A8FF]">0.2 nm/pixel</span>
          </span>
        </div>
      </div>
    </div>
  );
};
