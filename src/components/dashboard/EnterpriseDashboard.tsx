import React, { useState, useEffect } from 'react';
import { ActiveTab, WaferSample } from '../../types/semicon';
import { backendApi, GpuStatus } from '../../services/mockBackendApi';
import {
  UploadCloud,
  Cpu,
  Activity,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ShieldAlert,
  Server,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

interface EnterpriseDashboardProps {
  setActiveTab: (tab: ActiveTab) => void;
  onSelectSample: (sample: WaferSample) => void;
}

export const EnterpriseDashboard: React.FC<EnterpriseDashboardProps> = ({
  setActiveTab,
  onSelectSample,
}) => {
  const [gpuStatus, setGpuStatus] = useState<GpuStatus>(backendApi.getGpuStatus());
  const [samples, setSamples] = useState<WaferSample[]>(backendApi.getSamples());

  useEffect(() => {
    const timer = setInterval(() => {
      setGpuStatus(backendApi.getGpuStatus());
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const psnrTrendData = [
    { time: '09:00', psnr: 24.2, restoredPsnr: 38.4, ssim: 0.94 },
    { time: '10:00', psnr: 25.1, restoredPsnr: 39.1, ssim: 0.96 },
    { time: '11:00', psnr: 23.8, restoredPsnr: 37.9, ssim: 0.93 },
    { time: '12:00', psnr: 26.0, restoredPsnr: 41.2, ssim: 0.99 },
    { time: '13:00', psnr: 24.9, restoredPsnr: 39.8, ssim: 0.97 },
    { time: '14:00', psnr: 25.4, restoredPsnr: 40.5, ssim: 0.98 },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      {/* Top Header & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-black text-slate-900">
            Fab Metrology & Restormer AI Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium font-royal-sans">
            Real-time semiconductor image inspection, GPU throughput, and yield statistics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('workspace')}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#80A8FF] to-[#CEB5FF] px-5 py-3 text-xs font-extrabold text-white shadow-md shadow-[#80A8FF]/20 hover:shadow-lg transition border border-white/40"
          >
            <UploadCloud className="h-4 w-4" />
            <span>Upload New Wafer Scan</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid with Pure Shimmering 24K Gold Values & 3D Tactile Effects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* PSNR Improvement Gain */}
        <div className="moondust-glass rounded-2xl p-5 border border-[#CEB5FF] card-3d-tactile cursor-pointer">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">Avg PSNR Improvement</span>
            <div className="h-8 w-8 rounded-xl bg-[#D3D3FF]/50 text-[#80A8FF] flex items-center justify-center border border-[#80A8FF]/30">
              <Sparkles className="h-4 w-4 text-amber-500 fill-amber-400" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-gold-glitter">+15.6 dB</span>
            <span className="ml-2 text-xs font-extrabold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
              +14.2% gain
            </span>
          </div>
          <p className="text-[11px] text-slate-600 font-medium mt-2">Denoised from 24.2 dB to 39.8 dB average.</p>
        </div>

        {/* SSIM Index */}
        <div className="moondust-glass rounded-2xl p-5 border border-[#CEB5FF] card-3d-tactile cursor-pointer">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">Structural Similarity (SSIM)</span>
            <div className="h-8 w-8 rounded-xl bg-[#CEB5FF]/50 text-[#CEB5FF] flex items-center justify-center border border-[#CEB5FF]/60">
              <Activity className="h-4 w-4 text-[#80A8FF]" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-gold-glitter">0.989</span>
            <span className="ml-2 text-xs font-extrabold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
              Sub-nm fidelity
            </span>
          </div>
          <p className="text-[11px] text-slate-600 font-medium mt-2">Gate edge boundaries preserved intact.</p>
        </div>

        {/* Inference Latency */}
        <div className="moondust-glass rounded-2xl p-5 border border-[#CEB5FF] card-3d-tactile cursor-pointer">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">Inference Latency</span>
            <div className="h-8 w-8 rounded-xl bg-[#8EC1DE]/40 text-[#8EC1DE] flex items-center justify-center border border-[#8EC1DE]/60">
              <Zap className="h-4 w-4 text-amber-500 fill-amber-400" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-gold-glitter">18.4 ms</span>
            <span className="ml-2 text-xs font-extrabold text-[#80A8FF] bg-[#D3D3FF]/80 px-2 py-0.5 rounded-md">
              148 FPS
            </span>
          </div>
          <p className="text-[11px] text-slate-600 font-medium mt-2">TensorRT 10.2 FP16 execution speed.</p>
        </div>

        {/* Tier-1 Yield Rate */}
        <div className="moondust-glass rounded-2xl p-5 border border-[#CEB5FF] card-3d-tactile cursor-pointer">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">Tier-1 Wafer Yield</span>
            <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-gold-glitter">98.4%</span>
            <span className="ml-2 text-xs font-extrabold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
              Passed Audit
            </span>
          </div>
          <p className="text-[11px] text-slate-600 font-medium mt-2">Based on 1,420 inspected dies today.</p>
        </div>
      </div>

      {/* Main Grid: Upload Card & Recent Scans + GPU Cluster */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Upload Quick Card & Charts */}
        <div className="lg:col-span-8 space-y-6">
          {/* Quick Action Upload Card */}
          <div className="moondust-glass rounded-3xl p-6 border border-[#CEB5FF] bg-gradient-to-r from-white/90 via-[#D3D3FF]/40 to-[#8EC1DE]/30 relative overflow-hidden shadow-lg card-3d-tactile cursor-pointer">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-md badge-gold-glitter px-2 py-0.5 text-[10px] font-black uppercase">
                    Quick Inspection
                  </span>
                  <span className="text-xs text-slate-600 font-bold">PNG, BMP, JPEG, TIFF (Up to 16-bit)</span>
                </div>
                <h3 className="font-poppins text-lg font-bold text-slate-900">
                  Inspect Semiconductor Image or Select Wafer Sample
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  Run Restormer denoising, SwinIR super resolution 4x, and AI defect extraction.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('workspace')}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#80A8FF] to-[#CEB5FF] px-6 py-3.5 text-xs font-extrabold text-white shadow-md hover:shadow-lg transition shrink-0 border border-white/40"
              >
                <span>Launch Workspace</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* PSNR Improvement Chart */}
          <div className="moondust-glass rounded-3xl p-6 border border-[#CEB5FF] card-3d-tactile">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">PSNR & SSIM Quality Restoration Trends</h3>
                <p className="text-xs text-slate-500 font-medium">Comparing Raw SEM Noise vs AI Denoised Output (dB)</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-400" /> Raw Input
                </span>
                <span className="flex items-center gap-1.5 text-gold-glitter">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#B38728]" /> Restormer Output
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={psnrTrendData}>
                  <defs>
                    <linearGradient id="colorRestoredGold" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#CEB5FF" opacity={0.3} />
                  <XAxis dataKey="time" stroke="#80A8FF" fontSize={11} fontWeight={600} />
                  <YAxis domain={[15, 45]} stroke="#80A8FF" fontSize={11} fontWeight={600} />
                  <Tooltip />
                  <Area type="monotone" dataKey="restoredPsnr" stroke="#B38728" strokeWidth={3} fillOpacity={1} fill="url(#colorRestoredGold)" />
                  <Line type="monotone" dataKey="psnr" stroke="#8EC1DE" strokeWidth={2} strokeDasharray="4 4" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Inspection Log */}
          <div className="moondust-glass rounded-3xl p-6 border border-[#CEB5FF] card-3d-tactile">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Recent Metrology Inspections</h3>
              <button
                onClick={() => setActiveTab('history')}
                className="text-xs font-bold text-[#80A8FF] hover:text-[#6C8BEB]"
              >
                View All History &rarr;
              </button>
            </div>

            <div className="space-y-3">
              {samples.map((sample) => (
                <div
                  key={sample.id}
                  onClick={() => {
                    onSelectSample(sample);
                    setActiveTab('workspace');
                  }}
                  className="table-row-3d flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-white/80 border border-[#D3D3FF] hover:border-[#80A8FF] hover:bg-[#D3D3FF]/20 transition cursor-pointer gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-slate-900 text-[#8EC1DE] flex items-center justify-center shrink-0 border border-[#8EC1DE]/40">
                      <Cpu className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{sample.title}</span>
                        <span className="rounded-md bg-[#D3D3FF]/80 px-1.5 py-0.5 text-[10px] font-bold text-[#80A8FF]">
                          {sample.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Lot: {sample.waferLot} • {sample.foundry}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <div className="text-right">
                      <span className="text-gold-glitter font-black block">{sample.metrics.psnr} dB</span>
                      <span className="text-[10px] text-slate-500 font-normal">PSNR Score</span>
                    </div>

                    <div className="text-right">
                      <span className="text-slate-900 font-bold block">{sample.defects.length} Defects</span>
                      <span className="text-[10px] text-slate-500 font-normal">Extracted</span>
                    </div>

                    <button className="rounded-xl bg-white border border-[#CEB5FF] px-3.5 py-1.5 text-xs font-bold text-slate-800 hover:border-[#80A8FF] hover:text-[#80A8FF] transition shadow-2xs">
                      Inspect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: GPU Status & Model Health */}
        <div className="lg:col-span-4 space-y-6">
          {/* GPU Health Card */}
          <div className="moondust-glass rounded-3xl p-6 border border-[#CEB5FF] card-3d-tactile">
            <div className="flex items-center justify-between pb-3 border-b border-[#D3D3FF]/50">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-[#80A8FF]" />
                <h3 className="text-xs font-black text-gold-glitter">NVIDIA H100 SXM5</h3>
              </div>
              <span className="flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" /> Online
              </span>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600 font-bold">GPU Compute Load</span>
                  <span className="font-extrabold text-gold-glitter">{gpuStatus.gpuLoadPct}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#D3D3FF]/40 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#80A8FF] to-[#CEB5FF] rounded-full transition-all duration-500"
                    style={{ width: `${gpuStatus.gpuLoadPct}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600 font-bold">VRAM Allocation</span>
                  <span className="font-extrabold text-gold-glitter">
                    {gpuStatus.vramUsedGb} GB / {gpuStatus.vramTotalGb} GB
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#D3D3FF]/40 overflow-hidden">
                  <div
                    className="h-full bg-[#8EC1DE] rounded-full transition-all duration-500"
                    style={{ width: `${(gpuStatus.vramUsedGb / gpuStatus.vramTotalGb) * 100}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-white/90 border border-[#D3D3FF]">
                  <span className="text-[10px] text-slate-500 font-bold block">Core Temp</span>
                  <span className="text-sm font-black text-slate-900">{gpuStatus.temperatureC} °C</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/90 border border-[#D3D3FF]">
                  <span className="text-[10px] text-slate-500 font-bold block">Throughput</span>
                  <span className="text-sm font-black text-gold-glitter">{gpuStatus.throughputFps} FPS</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#D3D3FF]/50 text-[11px] text-slate-600 space-y-1 font-medium">
                <p><span className="font-bold text-slate-800">CUDA Engine:</span> {gpuStatus.cudaVersion}</p>
                <p><span className="font-bold text-slate-800">TensorRT:</span> {gpuStatus.tensorRtEngine}</p>
              </div>
            </div>
          </div>

          {/* Model Health Status */}
          <div className="moondust-glass rounded-3xl p-6 border border-[#CEB5FF]">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#80A8FF]" /> Deep Neural Network Health
            </h3>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-white/90 border border-[#CEB5FF] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Restormer Denoising v2.4</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Primary Sub-10nm Denoising Network</p>
                </div>
                <span className="text-[10px] font-black text-gold-glitter badge-gold-glitter px-2 py-0.5 rounded-md">
                  Active
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white/90 border border-[#D3D3FF] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">SwinIR Super Resolution</h4>
                  <p className="text-[10px] text-slate-500 font-medium">4x Neural Upscaling Network</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                  Ready
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white/90 border border-[#D3D3FF] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">YOLO-Semicon Metrology</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Pin-hole & Scratch BBox Detection</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                  Ready
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
