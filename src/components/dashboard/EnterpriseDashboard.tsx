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

  const vramData = [
    { time: '14:00', vram: 12.4, load: 58 },
    { time: '14:05', vram: 14.8, load: 68 },
    { time: '14:10', vram: 13.2, load: 62 },
    { time: '14:15', vram: 16.1, load: 74 },
    { time: '14:20', vram: 14.8, load: 65 },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 bg-slate-50 min-h-screen">
      {/* Top Header & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-poppins text-2xl sm:text-3xl font-extrabold text-slate-900">
            Fab Metrology & Restormer AI Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time semiconductor image inspection, GPU throughput, and yield statistics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('workspace')}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition"
          >
            <UploadCloud className="h-4 w-4" />
            <span>Upload New Wafer Scan</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* PSNR Improvement Gain */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-200">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Avg PSNR Improvement</span>
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900">+15.6 dB</span>
            <span className="ml-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
              +14.2% vs baseline
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Denoised from 24.2 dB to 39.8 dB average.</p>
        </div>

        {/* SSIM Index */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-200">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Structural Similarity (SSIM)</span>
            <div className="h-8 w-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900">0.989 / 1.000</span>
            <span className="ml-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
              Sub-nm fidelity
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Gate edge boundaries preserved intact.</p>
        </div>

        {/* Inference Latency */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-200">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Inference Latency</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900">18.4 ms</span>
            <span className="ml-2 text-xs font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md">
              148 FPS
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">TensorRT 10.2 FP16 execution speed.</p>
        </div>

        {/* Tier-1 Yield Rate */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-200">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Tier-1 Wafer Yield</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900">98.4%</span>
            <span className="ml-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
              Passed Audit
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Based on 1,420 inspected dies today.</p>
        </div>
      </div>

      {/* Main Grid: Upload Card & Recent Scans + GPU Cluster */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Upload Quick Card & Charts */}
        <div className="lg:col-span-8 space-y-6">
          {/* Quick Action Upload Card */}
          <div className="glass-panel rounded-3xl p-6 border border-blue-200/80 bg-gradient-to-r from-blue-50/50 via-white to-cyan-50/40 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                    Quick Inspection
                  </span>
                  <span className="text-xs text-slate-500 font-medium">PNG, BMP, JPEG, TIFF (Up to 16-bit)</span>
                </div>
                <h3 className="font-poppins text-lg font-bold text-slate-900">
                  Inspect Semiconductor Image or Select Wafer Sample
                </h3>
                <p className="text-xs text-slate-600">
                  Run Restormer denoising, SwinIR super resolution 4x, and AI defect extraction.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('workspace')}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-semibold text-white shadow-md hover:bg-blue-700 transition shrink-0"
              >
                <span>Launch Workspace</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* PSNR Improvement Chart */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-200 bg-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">PSNR & SSIM Quality Restoration Trends</h3>
                <p className="text-xs text-slate-500">Comparing Raw SEM Noise vs AI Denoised Output (dB)</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300" /> Raw Input
                </span>
                <span className="flex items-center gap-1.5 text-blue-600">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-600" /> Restormer Output
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={psnrTrendData}>
                  <defs>
                    <linearGradient id="colorRestored" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F62FE" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0F62FE" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                  <YAxis domain={[15, 45]} stroke="#94a3b8" fontSize={11} />
                  <Tooltip />
                  <Area type="monotone" dataKey="restoredPsnr" stroke="#0F62FE" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRestored)" />
                  <Line type="monotone" dataKey="psnr" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 4" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Inspection Log */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-200 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Recent Metrology Inspections</h3>
              <button
                onClick={() => setActiveTab('history')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
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
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 transition cursor-pointer gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-slate-900 text-cyan-400 flex items-center justify-center shrink-0">
                      <Cpu className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{sample.title}</span>
                        <span className="rounded-md bg-blue-100/70 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700">
                          {sample.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Lot: {sample.waferLot} • {sample.foundry}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <div className="text-right">
                      <span className="text-blue-600 block">{sample.metrics.psnr} dB</span>
                      <span className="text-[10px] text-slate-400 font-normal">PSNR Score</span>
                    </div>

                    <div className="text-right">
                      <span className="text-slate-900 block">{sample.defects.length} Defects</span>
                      <span className="text-[10px] text-slate-400 font-normal">Extracted</span>
                    </div>

                    <button className="rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-xs text-slate-700 hover:border-blue-400 hover:text-blue-600 transition">
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
          <div className="glass-panel rounded-3xl p-6 border border-slate-200 bg-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">NVIDIA H100 SXM5</h3>
              </div>
              <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" /> Online
              </span>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500 font-medium">GPU Compute Load</span>
                  <span className="font-bold text-slate-900">{gpuStatus.gpuLoadPct}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${gpuStatus.gpuLoadPct}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500 font-medium">VRAM Allocation</span>
                  <span className="font-bold text-slate-900">
                    {gpuStatus.vramUsedGb} GB / {gpuStatus.vramTotalGb} GB
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                    style={{ width: `${(gpuStatus.vramUsedGb / gpuStatus.vramTotalGb) * 100}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-medium block">Core Temperature</span>
                  <span className="text-xs font-bold text-slate-900">{gpuStatus.temperatureC} °C</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-medium block">Inference Speed</span>
                  <span className="text-xs font-bold text-slate-900">{gpuStatus.throughputFps} FPS</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                <p><span className="font-semibold text-slate-700">CUDA Engine:</span> {gpuStatus.cudaVersion}</p>
                <p><span className="font-semibold text-slate-700">TensorRT:</span> {gpuStatus.tensorRtEngine}</p>
              </div>
            </div>
          </div>

          {/* Model Health Status */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-200 bg-white">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Layers className="h-4 w-4 text-blue-600" /> Deep Neural Network Health
            </h3>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Restormer Denoising v2.4</h4>
                  <p className="text-[10px] text-slate-500">Primary Sub-10nm Denoising Network</p>
                </div>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                  Active
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">SwinIR Super Resolution</h4>
                  <p className="text-[10px] text-slate-500">4x Neural Upscaling Network</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  Ready
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">YOLO-Semicon Metrology</h4>
                  <p className="text-[10px] text-slate-500">Pin-hole & Scratch BBox Detection</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
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
