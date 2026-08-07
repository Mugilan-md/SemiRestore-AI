import React from 'react';
import { QualityMetrics } from '../../types/semicon';
import {
  Sparkles,
  Activity,
  Zap,
  Server,
  ZoomIn,
  ShieldCheck,
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
      color: 'text-amber-500',
      bg: 'bg-amber-100/60',
    },
    {
      title: 'Structural Similarity (SSIM)',
      value: `${metrics.ssim}`,
      sub: 'Sub-nanometer Fidelity',
      icon: Activity,
      color: 'text-[#80A8FF]',
      bg: 'bg-[#D3D3FF]/50',
    },
    {
      title: 'Noise Reduction %',
      value: `${metrics.noiseReductionPct}%`,
      sub: 'Poisson Noise Removed',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-100/60',
    },
    {
      title: 'Restoration Confidence',
      value: `${metrics.restorationConfidence}%`,
      sub: 'Deep Neural Certitude',
      icon: ShieldCheck,
      color: 'text-[#CEB5FF]',
      bg: 'bg-[#CEB5FF]/30',
    },
    {
      title: 'Processing Time',
      value: `${metrics.processingTimeMs} ms`,
      sub: 'TensorRT FP16 Latency',
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-100/50',
    },
    {
      title: 'GPU VRAM Allocation',
      value: `${metrics.gpuMemoryGb} GB`,
      sub: 'NVIDIA H100 SXM5',
      icon: Server,
      color: 'text-[#80A8FF]',
      bg: 'bg-[#D3D3FF]/40',
    },
    {
      title: 'Resolution Multiplier',
      value: `${metrics.resolutionScale} Super-Res`,
      sub: 'SwinIR Transformer',
      icon: ZoomIn,
      color: 'text-[#8EC1DE]',
      bg: 'bg-[#8EC1DE]/30',
    },
    {
      title: 'Inference Throughput',
      value: `${metrics.inferenceSpeedFps} FPS`,
      sub: '4096 x 4096 Resolution',
      icon: Zap,
      color: 'text-amber-500',
      bg: 'bg-amber-100/60',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
            Quantitative Image Quality Metrics
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Real-time metrology diagnostic scores calculated against ISO-12233 standards.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="moondust-glass rounded-2xl p-4 border border-[#CEB5FF]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">{card.title}</span>
                <div className={`h-8 w-8 rounded-xl ${card.bg} ${card.color} flex items-center justify-center border border-white/60 shadow-2xs`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-gold-glitter">{card.value}</span>
                <p className="text-[11px] font-bold text-[#80A8FF] mt-1">{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
