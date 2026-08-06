import React from 'react';
import { QualityMetrics } from '../../types/semicon';
import {
  Sparkles,
  Activity,
  Zap,
  Server,
  ZoomIn,
  ShieldCheck,
  BarChart3,
  TrendingUp,
  Clock,
} from 'lucide-react';

interface QualityMetricsPanelProps {
  metrics: QualityMetrics;
}

export const QualityMetricsPanel: React.FC<QualityMetricsPanelProps> = ({ metrics }) => {
  const cards = [
    {
      title: 'PSNR Peak Signal-Noise Ratio',
      value: `${metrics.psnr} dB`,
      sub: `+${metrics.snrGainDb} dB SNR Gain`,
      icon: Sparkles,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Structural Similarity (SSIM)',
      value: `${metrics.ssim}`,
      sub: 'Sub-nanometer Fidelity',
      icon: Activity,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50',
    },
    {
      title: 'Noise Reduction %',
      value: `${metrics.noiseReductionPct}%`,
      sub: 'Poisson Noise Removed',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      title: 'Restoration Confidence',
      value: `${metrics.restorationConfidence}%`,
      sub: 'Deep Neural Certitude',
      icon: ShieldCheck,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      title: 'Processing Time',
      value: `${metrics.processingTimeMs} ms`,
      sub: 'TensorRT FP16 Latency',
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      title: 'GPU VRAM Allocation',
      value: `${metrics.gpuMemoryGb} GB`,
      sub: 'NVIDIA H100 SXM5',
      icon: Server,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      title: 'Resolution Multiplier',
      value: `${metrics.resolutionScale} Super-Res`,
      sub: 'SwinIR Transformer',
      icon: ZoomIn,
      color: 'text-pink-600',
      bg: 'bg-pink-50',
    },
    {
      title: 'Inference Throughput',
      value: `${metrics.inferenceSpeedFps} FPS`,
      sub: '4096 x 4096 Resolution',
      icon: Zap,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Quantitative Image Quality Metrics</h3>
          <p className="text-xs text-slate-500">
            Real-time metrology diagnostic scores calculated against ISO-12233 standards.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="glass-panel rounded-2xl p-4 border border-slate-200 bg-white">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{card.title}</span>
                <div className={`h-8 w-8 rounded-lg ${card.bg} ${card.color} flex items-center justify-center`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-xl font-extrabold text-slate-900">{card.value}</span>
                <p className="text-[11px] font-semibold text-slate-400 mt-1">{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
