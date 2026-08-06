import React, { useState } from 'react';
import { ActiveTab } from '../../types/semicon';
import {
  Sparkles,
  ArrowRight,
  Cpu,
  Layers,
  ZoomIn,
  Zap,
  ShieldCheck,
  BarChart3,
  CheckCircle2,
  Play,
  Database,
  Server,
  Activity,
  ChevronDown,
  Microscope,
  FileCheck2,
  UploadCloud,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setActiveTab }) => {
  const [showDemoModal, setShowDemoModal] = useState(false);

  const features = [
    {
      title: 'AI Denoising',
      desc: 'Removes Poisson shot noise and SEM detector speckle while preserving 2nm sub-gate feature boundaries.',
      icon: Layers,
      highlight: '98.6% SNR Gain',
    },
    {
      title: 'Super Resolution 4x',
      desc: 'Transformer-based upscaling expands 1024x1024 die scans to 4096x4096 nanometer fidelity.',
      icon: ZoomIn,
      highlight: 'SwinIR & Restormer',
    },
    {
      title: 'Quality Metrics',
      desc: 'Real-time computation of PSNR (+15 dB), SSIM (0.99), and contrast modulation transfer function.',
      icon: BarChart3,
      highlight: 'Sub-ms Metrology',
    },
    {
      title: 'Batch Processing',
      desc: 'Simultaneous ingestion and AI restoration of 100+ 300mm wafer cassette inspection logs.',
      icon: Database,
      highlight: 'Parallel GPU Ingestion',
    },
    {
      title: 'Microscopic Zoom 1000x',
      desc: 'Smooth canvas pan and zoom up to 1000x scale with crosshair pixel luminance diagnostics.',
      icon: Microscope,
      highlight: 'Nanometer Scale',
    },
    {
      title: 'AI Defect Assistance',
      desc: 'Automated detection of pin-holes, line breaks, voids, CMP scratches, and particle contamination.',
      icon: ShieldCheck,
      highlight: '99.4% Precision',
    },
    {
      title: 'Fast GPU Processing',
      desc: 'FP16 TensorRT pipeline executes 140+ high-resolution frames per second on NVIDIA H100.',
      icon: Zap,
      highlight: '< 18ms Inference',
    },
    {
      title: 'Explainable AI Heatmaps',
      desc: 'Difference error heatmaps, Sobel edge maps, and spatial attention weight visualizations.',
      icon: Activity,
      highlight: 'Attention Weight Maps',
    },
  ];

  const workflow = [
    { step: '01', title: 'Upload & Ingest', text: 'Drag-and-drop raw 16-bit SEM TIFF/PNG wafer die scans.', icon: UploadCloud },
    { step: '02', title: 'AI Restoration', text: 'Restormer transformer denoising & 4x neural super-resolution.', icon: Cpu },
    { step: '03', title: 'Quality Analysis', text: 'Automated computation of PSNR, SSIM, and AI defect bounding boxes.', icon: Activity },
    { step: '04', title: 'Inspection Report', text: 'Instant executive PDF report generation with yield certification.', icon: FileCheck2 },
  ];

  return (
    <div className="relative overflow-hidden bg-slate-50 min-h-screen">
      {/* Background Subtle Semiconductor Grid & Glows */}
      <div className="absolute inset-0 bg-semicon-grid opacity-60 pointer-events-none" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-96 right-10 w-[500px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold text-blue-700 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
              <span>Next-Gen Semiconductor Inspection Standard 2026</span>
            </div>

            <h1 className="font-poppins text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              AI-Based Restoration for <br />
              <span className="text-gradient-brand">Semiconductor Inspection</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed">
              Intelligent deep-learning image restoration designed for sub-7nm photolithography, EUV mask metrology, and wafer die inspection.
            </p>

            {/* Micro Highlights Pill Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
              {[
                'Noise Removal',
                'Super Resolution',
                'AI Enhancement',
                'Defect Accuracy',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-white/90 rounded-lg p-2 border border-slate-200/80 shadow-2xs">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => setActiveTab('workspace')}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 hover:shadow-blue-600/35 transition-all transform active:scale-95"
              >
                <span>Start Inspection</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => setShowDemoModal(true)}
                className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white/80 px-5 py-3.5 text-sm font-semibold text-slate-800 shadow-2xs hover:bg-white hover:border-slate-400 transition"
              >
                <Play className="h-4 w-4 text-blue-600 fill-blue-600" />
                <span>Watch Demo</span>
              </button>

              <button
                onClick={() => {
                  const techSection = document.getElementById('technology-section');
                  techSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-xs font-semibold text-slate-600 hover:text-blue-600 transition px-2 py-1"
              >
                Explore Technology &rarr;
              </button>
            </div>
          </motion.div>

          {/* Right Column: Animated Wafer Illustration & AI Nodes */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative flex justify-center items-center"
          >
            <div className="relative w-full max-w-md aspect-square rounded-3xl glass-panel p-6 shadow-2xl border border-blue-100 flex items-center justify-center overflow-hidden">
              {/* Glowing Background Radial */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent" />

              {/* Silicon Wafer Circle SVG Illustration */}
              <div className="relative w-72 h-72 rounded-full border-4 border-blue-500/30 bg-slate-900/90 shadow-2xl flex items-center justify-center p-4 overflow-hidden">
                {/* Circuit Traces background */}
                <div className="absolute inset-0 bg-circuit-dots opacity-40 animate-circuit-glow" />

                {/* Sub-Die Grid Overlay */}
                <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-1 p-4 opacity-30">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div key={i} className="border border-blue-400/40 rounded-xs hover:bg-blue-400/30 transition" />
                  ))}
                </div>

                {/* Central Neural Hub Node */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/40">
                    <div className="h-full w-full bg-slate-950 rounded-2xl flex items-center justify-center">
                      <Cpu className="h-8 w-8 text-cyan-400 animate-pulse" />
                    </div>
                  </div>
                  <span className="mt-3 text-xs font-bold text-white tracking-widest uppercase">
                    RESTORMER AI ENGINE
                  </span>
                  <span className="text-[10px] text-cyan-300 font-semibold mt-0.5">
                    148 FPS • Sub-10nm Metrology
                  </span>
                </div>

                {/* Orbiting Floating AI Nodes */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-2 pointer-events-none"
                >
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-blue-600 text-white p-2 rounded-xl shadow-lg border border-blue-400">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div className="absolute bottom-4 left-6 bg-cyan-600 text-white p-2 rounded-xl shadow-lg border border-cyan-400">
                    <ZoomIn className="h-4 w-4" />
                  </div>
                  <div className="absolute bottom-4 right-6 bg-indigo-600 text-white p-2 rounded-xl shadow-lg border border-indigo-400">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                </motion.div>
              </div>

              {/* Floating Metric Badges */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md rounded-xl p-2.5 border border-slate-200 shadow-lg flex items-center gap-2.5">
                <div className="h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
                <div>
                  <div className="text-[10px] font-semibold text-slate-500">PSNR Improvement</div>
                  <div className="text-xs font-bold text-slate-900">+15.6 dB Gain</div>
                </div>
              </div>

              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md rounded-xl p-2.5 border border-slate-200 shadow-lg flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
                <div>
                  <div className="text-[10px] font-semibold text-slate-500">Defect Detection</div>
                  <div className="text-xs font-bold text-slate-900">99.4% Accuracy</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-16 flex justify-center">
          <button
            onClick={() => {
              const featuresEl = document.getElementById('features-section');
              featuresEl?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-blue-600 transition"
          >
            <span>Scroll for Platform Features</span>
            <ChevronDown className="h-4 w-4 animate-bounce" />
          </button>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features-section" className="py-20 bg-white/60 border-y border-slate-200/80 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto rounded-3xl my-6 shadow-xs">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">Platform Capabilities</h2>
          <p className="font-poppins text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
            Engineering Precision for Fab Metrology
          </p>
          <p className="text-sm text-slate-600 mt-3">
            Designed to meet the stringent standards of TSMC, Intel, NVIDIA, and Samsung Semiconductor manufacturing labs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ y: -4 }}
                className="glass-panel-interactive rounded-2xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded-md">
                      {feat.highlight}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{feat.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
                </div>
                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-blue-600">Explore Module &rarr;</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">Inspection Workflow</h2>
          <p className="font-poppins text-3xl font-bold text-slate-900 mt-2">
            4-Step Automated AI Pipeline
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {workflow.map((w, idx) => {
            const Icon = w.icon;
            return (
              <div key={idx} className="relative glass-panel rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-blue-200 font-poppins">{w.step}</span>
                  <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">{w.title}</h3>
                <p className="text-xs text-slate-600 leading-normal">{w.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology-section" className="py-20 bg-slate-900 text-white px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto rounded-3xl my-10 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-circuit-dots opacity-20" />
        <div className="relative z-10 text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">System Architecture</span>
          <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-white mt-2">
            Built on PyTorch Restormer & TensorRT Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-3">
            Sub-millisecond deep neural networks running on NVIDIA H100 / A100 SXM5 GPU nodes with WebGL front-end rendering.
          </p>
        </div>

        {/* Architecture Node Diagram */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Frontend */}
          <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-6 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4 text-cyan-400">
              <Server className="h-5 w-5" />
              <h3 className="text-sm font-bold text-white">Client & Visualization Tier</h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" /> React 18 + TypeScript</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" /> Vite + Tailwind CSS Engine</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" /> HTML5 Canvas / WebGL Inspector</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" /> Framer Motion Micro-Interactions</li>
            </ul>
          </div>

          {/* Backend API */}
          <div className="rounded-2xl border border-blue-500/50 bg-blue-950/60 p-6 backdrop-blur-md ring-2 ring-blue-500/20">
            <div className="flex items-center gap-3 mb-4 text-blue-400">
              <Cpu className="h-5 w-5" />
              <h3 className="text-sm font-bold text-white">FastAPI & Inference Core</h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-blue-400" /> FastAPI Async Endpoints</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-blue-400" /> PyTorch 2.4 Distributed CUDA</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-blue-400" /> OpenCV Metrology Operators</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-blue-400" /> ONNX Runtime / TensorRT FP16</li>
            </ul>
          </div>

          {/* AI Models */}
          <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-6 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4 text-emerald-400">
              <Layers className="h-5 w-5" />
              <h3 className="text-sm font-bold text-white">Deep AI Models</h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Restormer Denoising Network</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> SwinIR 4x Super Resolution</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> CLAHE Adaptive Contrast</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Real-time PSNR & SSIM Metrics</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Demo Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Play className="h-4 w-4 text-blue-600 fill-blue-600" /> SemiRestore AI Demonstration
              </h3>
              <button
                onClick={() => setShowDemoModal(false)}
                className="text-xs text-slate-400 hover:text-slate-700"
              >
                Close
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Experience the full interactive workspace, image comparison sliders, 1000x microscopic zoom, defect bounding box overlays, and automated PDF report generation.
            </p>
            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDemoModal(false);
                  setActiveTab('workspace');
                }}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-700 transition"
              >
                Launch Workspace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
