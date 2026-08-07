import React, { useRef, useEffect } from 'react';
import { ViewMode, WaferSample } from '../../types/semicon';
import {
  generateDifferenceHeatmap,
  generateSobelEdgeMap,
  drawSemiconPattern,
  addSyntheticSemNoise,
  applyRestormerAI,
} from '../../services/imageProcessingEngine';
import { Activity } from 'lucide-react';

interface HeatmapViewerProps {
  sample: WaferSample;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export const HeatmapViewer: React.FC<HeatmapViewerProps> = ({
  sample,
  viewMode,
  setViewMode,
}) => {
  const sourceCanvasRef = useRef<HTMLCanvasElement>(null);
  const degradedCanvasRef = useRef<HTMLCanvasElement>(null);
  const restoredCanvasRef = useRef<HTMLCanvasElement>(null);
  const heatmapCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const width = 600;
    const height = 400;

    const patternType = sample.category.includes('FinFET')
      ? 'finfet'
      : sample.category.includes('EUV')
      ? 'euv'
      : sample.category.includes('TSV')
      ? 'void'
      : 'die';

    if (sourceCanvasRef.current) {
      sourceCanvasRef.current.width = width;
      sourceCanvasRef.current.height = height;
      const ctx = sourceCanvasRef.current.getContext('2d');
      if (ctx) drawSemiconPattern(ctx, width, height, patternType);
    }

    if (sourceCanvasRef.current && degradedCanvasRef.current) {
      addSyntheticSemNoise(sourceCanvasRef.current, degradedCanvasRef.current, 0.45);
    }

    if (degradedCanvasRef.current && restoredCanvasRef.current) {
      applyRestormerAI(degradedCanvasRef.current, restoredCanvasRef.current);
    }

    if (degradedCanvasRef.current && restoredCanvasRef.current && heatmapCanvasRef.current) {
      if (viewMode === 'heatmap') {
        generateDifferenceHeatmap(
          degradedCanvasRef.current,
          restoredCanvasRef.current,
          heatmapCanvasRef.current
        );
      } else if (viewMode === 'edge') {
        generateSobelEdgeMap(restoredCanvasRef.current, heatmapCanvasRef.current);
      }
    }
  }, [sample, viewMode]);

  const viewButtons: { mode: ViewMode; label: string }[] = [
    { mode: 'restored', label: 'Restored AI View' },
    { mode: 'heatmap', label: 'Difference Error Heatmap' },
    { mode: 'edge', label: 'Sobel Edge Map' },
    { mode: 'attention', label: 'Transformer Attention Map' },
    { mode: 'false_color', label: 'False Color SEM' },
  ];

  return (
    <div className="moondust-glass rounded-3xl p-6 border border-[#CEB5FF] space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Activity className="h-4 w-4 text-[#80A8FF]" />
            <span>Spectral & Heatmap Diagnostic Layer</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Switch layer masks to inspect high-frequency noise error and transformer attention weights.
          </p>
        </div>

        {/* View Mode Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#D3D3FF]/40 p-1.5 rounded-2xl border border-[#CEB5FF]/50">
          {viewButtons.map((btn) => (
            <button
              key={btn.mode}
              onClick={() => setViewMode(btn.mode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                viewMode === btn.mode
                  ? 'bg-gradient-to-r from-[#80A8FF] to-[#CEB5FF] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-white hover:text-slate-900'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Display Canvas with Moon Dust Frame */}
      <div className="relative w-full h-[400px] rounded-2xl bg-slate-950 overflow-hidden flex items-center justify-center border border-[#8EC1DE]/40 shadow-inner">
        {/* Hidden source canvases */}
        <canvas ref={sourceCanvasRef} className="hidden" />
        <canvas ref={degradedCanvasRef} className="hidden" />
        <canvas ref={restoredCanvasRef} className="hidden" />

        {/* Target display canvas */}
        <canvas ref={heatmapCanvasRef} className="max-w-full max-h-full" />

        {/* JET Heatmap Color Legend */}
        {viewMode === 'heatmap' && (
          <div className="absolute bottom-4 left-4 moondust-glass-dark p-3 rounded-xl border border-slate-700 flex items-center gap-3 text-[11px] text-white font-mono shadow-xl">
            <span className="text-[#D3D3FF] font-bold">Low Error (0.0)</span>
            <div className="h-3 w-32 rounded bg-gradient-to-r from-blue-600 via-cyan-400 via-yellow-400 to-red-600" />
            <span className="text-gold-glitter font-black">High Variance (1.0)</span>
          </div>
        )}
      </div>
    </div>
  );
};
