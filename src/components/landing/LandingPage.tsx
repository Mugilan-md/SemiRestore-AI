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
      desc: 'Real-time computation of PSNR (+15.6 dB), SSIM (0.99), and contrast modulation transfer function.',
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
      desc: 'FP16 TensorRT pipeline executes 148+ high-resolution frames per second on NVIDIA H100.',
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
    <div className="relative overflow-hidden min-h-screen">
      {/* Moon Dust Background Grid & Fluid Mesh */}
      <div className="absolute inset-0 bg-moondust-grid opacity-70 pointer-events-none" />
      <div className="absolute top-16 left-1/3 w-[700px] h-[450px] bg-[#CEB5FF]/30 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-96 right-10 w-[600px] h-[350px] bg-[#8EC1DE]/35 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-[550px] h-[380px] bg-[#80A8FF]/25 blur-[130px] rounded-full pointer-events-none" />

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
            {/* Top Pill with Pure Gold Glittering Accent */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#CEB5FF] bg-white/90 backdrop-blur-md px-4 py-1.5 text-xs font-extrabold shadow-sm">
              <Sparkles className="h-4 w-4 text-amber-500 fill-amber-400 animate-pulse" />
              <span className="text-gold-glitter font-black tracking-wide">Next-Gen Semiconductor Inspection Standard 2026</span>
            </div>

            {/* Main Headline with Royal Cinzel & Pure Real 24K Gold Glittering Text */}
            <h1 className="font-cinzel text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
              <span className="block text-slate-900">AI-Based Restoration</span>
              <span className="block text-slate-900 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-800">for</span>
              <span className="text-gold-glitter-lg block mt-1">Semiconductor Inspection</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-700 max-w-2xl font-medium leading-relaxed">
              Intelligent deep-learning image restoration designed for sub-7nm photolithography, EUV mask metrology, and wafer die inspection.
            </p>

            {/* Micro Highlights Pill Bar styled with Moon Dust & Pure Gold */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
              {[
                'Noise Removal',
                'Super Resolution',
                'AI Enhancement',
                'Defect Accuracy',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-800 bg-white/90 rounded-xl p-2.5 border border-[#CEB5FF]/70 shadow-2xs backdrop-blur-md">
                  <CheckCircle2 className="h-4 w-4 text-[#80A8FF] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => setActiveTab('workspace')}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#80A8FF] via-[#7B9EFF] to-[#6C8BEB] px-7 py-4 text-sm font-extrabold text-white shadow-xl shadow-[#80A8FF]/35 hover:shadow-[#80A8FF]/50 transition-all transform active:scale-95 border border-white/40"
              >
                <span>Start Inspection</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => setShowDemoModal(true)}
                className="flex items-center gap-2 rounded-xl border border-[#CEB5FF] bg-white/90 px-6 py-4 text-sm font-extrabold text-slate-800 shadow-2xs hover:bg-white hover:border-[#80A8FF] transition"
              >
                <Play className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span>Watch Demo</span>
              </button>

              <button
                onClick={() => {
                  const techSection = document.getElementById('technology-section');
                  techSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-xs font-bold text-slate-700 hover:text-[#80A8FF] transition px-3 py-2"
              >
                Explore Technology &rarr;
              </button>
            </div>
          </motion.div>

          {/* Right Column: Animated Wafer Illustration & Pure Gold AI Engine Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative flex justify-center items-center"
          >
            <div className="relative w-full max-w-md aspect-square rounded-3xl moondust-glass p-6 shadow-2xl border border-[#CEB5FF] flex items-center justify-center overflow-hidden card-important-hover">
              {/* Glowing Background Radial using Moon dust */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#CEB5FF]/30 via-[#8EC1DE]/20 to-transparent" />

              {/* Silicon Wafer Circle Illustration */}
              <div className="relative w-72 h-72 rounded-full border-4 border-[#8EC1DE]/50 bg-slate-950 shadow-2xl flex items-center justify-center p-4 overflow-hidden">
                {/* Circuit Traces background */}
                <div className="absolute inset-0 bg-moondust-dots opacity-40" />

                {/* Sub-Die Grid Overlay */}
                <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-1 p-4 opacity-30">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div key={i} className="border border-[#80A8FF]/40 rounded-xs hover:bg-[#8EC1DE]/30 transition" />
                  ))}
                </div>

                {/* Central Neural Hub Node with Pure Gold Glittering Text */}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-[#80A8FF] via-[#CEB5FF] to-[#8EC1DE] p-0.5 shadow-lg shadow-[#80A8FF]/40">
                    <div className="h-full w-full bg-slate-950 rounded-2xl flex items-center justify-center">
                      <Cpu className="h-8 w-8 text-[#8EC1DE] animate-pulse" />
                    </div>
                  </div>
                  <span className="mt-3 text-xs font-black tracking-widest uppercase text-gold-glitter">
                    RESTORMER AI ENGINE
                  </span>
                  <span className="text-[11px] text-[#D3D3FF] font-bold mt-0.5">
                    148 FPS • Sub-10nm Metrology
                  </span>
                </div>

                {/* Orbiting Floating AI Nodes */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-2 pointer-events-none"
                >
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-[#80A8FF] text-white p-2 rounded-xl shadow-lg border border-white/50">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div className="absolute bottom-4 left-6 bg-[#8EC1DE] text-slate-900 p-2 rounded-xl shadow-lg border border-white/50">
                    <ZoomIn className="h-4 w-4" />
                  </div>
                  <div className="absolute bottom-4 right-6 bg-[#CEB5FF] text-slate-900 p-2 rounded-xl shadow-lg border border-white/50">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                </motion.div>
              </div>

              {/* Floating Metric Badges with PURE GOLD NUMBERS */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-[#CEB5FF] shadow-xl flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
                <div>
                  <div className="text-[10px] font-bold text-slate-500">PSNR Improvement</div>
                  <div className="text-sm font-black text-gold-glitter">+15.6 dB Gain</div>
                </div>
              </div>

              <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-[#CEB5FF] shadow-xl flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 text-[#80A8FF]" />
                <div>
                  <div className="text-[10px] font-bold text-slate-500">Defect Detection</div>
                  <div className="text-sm font-black text-gold-glitter">99.4% Accuracy</div>
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
            className="flex flex-col items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#80A8FF] transition"
          >
            <span>Scroll for Platform Features</span>
            <ChevronDown className="h-4 w-4 animate-bounce text-[#80A8FF]" />
          </button>
        </div>
      </section>

      {/* Feature Section with Moon Dust Glass Panels & Pure Gold Highlights */}
      <section id="features-section" className="py-20 moondust-glass border-y border-[#CEB5FF]/70 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto rounded-3xl my-6 shadow-md">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-black uppercase tracking-widest text-gold-glitter">Platform Capabilities</h2>
          <p className="font-cinzel text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Engineering Precision for Fab Metrology
          </p>
          <p className="text-sm text-slate-600 mt-3 font-medium">
            Designed to meet the stringent standards of TSMC, Intel, NVIDIA, and Samsung Semiconductor manufacturing labs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div
                key={index}
                className="moondust-glass rounded-2xl p-6 flex flex-col justify-between card-3d-tactile cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#D3D3FF] to-[#CEB5FF]/50 border border-[#80A8FF]/40 flex items-center justify-center text-slate-900 shadow-xs">
                      <Icon className="h-6 w-6 text-[#80A8FF]" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider badge-gold-glitter px-2.5 py-0.5 rounded-lg">
                      {feat.highlight}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{feat.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{feat.desc}</p>
                </div>
                <div className="mt-6 pt-3 border-t border-[#CEB5FF]/40 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#80A8FF]">Explore Module &rarr;</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section with 3D Step Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs font-black uppercase tracking-widest text-gold-glitter">Inspection Workflow</h2>
          <p className="font-cinzel text-3xl font-extrabold text-slate-900 mt-2">
            4-Step Automated AI Pipeline
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {workflow.map((w, idx) => {
            const Icon = w.icon;
            return (
              <div key={idx} className="relative moondust-glass rounded-2xl p-6 border border-[#CEB5FF] card-3d-tactile cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-gold-glitter font-cinzel">{w.step}</span>
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#80A8FF] to-[#CEB5FF] text-white flex items-center justify-center shadow-md shadow-[#80A8FF]/20">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">{w.title}</h3>
                <p className="text-xs text-slate-600 leading-normal font-medium">{w.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Technology Section styled with Moon Dust Cosmic Tone & 3D Dark Cards */}
      <section id="technology-section" className="py-20 moondust-glass-dark text-white px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto rounded-3xl my-10 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-moondust-dots opacity-20" />
        <div className="relative z-10 text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-gold-glitter">System Architecture</span>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-white mt-2">
            Built on PyTorch Restormer & TensorRT Engine
          </h2>
          <p className="text-xs sm:text-sm text-[#D3D3FF] mt-3 font-medium">
            Sub-millisecond deep neural networks running on NVIDIA H100 / A100 SXM5 GPU nodes with WebGL front-end rendering.
          </p>
        </div>

        {/* Architecture Node Diagram with 3D Depth & Pure Gold Highlights */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Frontend */}
          <div className="rounded-2xl border border-[#8EC1DE]/30 bg-slate-900/80 p-6 backdrop-blur-md shadow-xl card-3d-dark-tactile cursor-pointer">
            <div className="flex items-center gap-3 mb-4 text-[#8EC1DE]">
              <Server className="h-5 w-5" />
              <h3 className="text-sm font-bold text-white">Client & Visualization Tier</h3>
            </div>
            <ul className="space-y-2 text-xs text-[#D3D3FF]">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[#8EC1DE]" /> React 19 + TypeScript Engine</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[#8EC1DE]" /> Vite + Moon Dust Design System</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[#8EC1DE]" /> HTML5 Canvas / WebGL Inspector</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[#8EC1DE]" /> Framer Motion Micro-Interactions</li>
            </ul>
          </div>

          {/* Backend API */}
          <div className="rounded-2xl border border-[#CEB5FF]/50 bg-slate-900/90 p-6 backdrop-blur-md ring-2 ring-[#CEB5FF]/30 shadow-xl card-3d-dark-tactile cursor-pointer">
            <div className="flex items-center gap-3 mb-4 text-[#CEB5FF]">
              <Cpu className="h-5 w-5" />
              <h3 className="text-sm font-bold text-white">FastAPI & Inference Core</h3>
            </div>
            <ul className="space-y-2 text-xs text-[#D3D3FF]">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[#CEB5FF]" /> FastAPI Async Endpoints</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[#CEB5FF]" /> PyTorch 2.4 Distributed CUDA</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[#CEB5FF]" /> OpenCV Metrology Operators</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[#CEB5FF]" /> ONNX Runtime / TensorRT FP16</li>
            </ul>
          </div>

          {/* AI Models */}
          <div className="rounded-2xl border border-[#80A8FF]/30 bg-slate-900/80 p-6 backdrop-blur-md shadow-xl card-3d-dark-tactile cursor-pointer">
            <div className="flex items-center gap-3 mb-4 text-[#80A8FF]">
              <Layers className="h-5 w-5" />
              <h3 className="text-sm font-bold text-white">Deep AI Models</h3>
            </div>
            <ul className="space-y-2 text-xs text-[#D3D3FF]">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[#80A8FF]" /> Restormer Denoising Network</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[#80A8FF]" /> SwinIR 4x Super Resolution</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[#80A8FF]" /> CLAHE Adaptive Contrast</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[#80A8FF]" /> Real-time PSNR & SSIM Metrics</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Demo Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="moondust-glass rounded-3xl p-6 max-w-xl w-full border border-[#CEB5FF] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#D3D3FF]/60 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Play className="h-4 w-4 text-amber-500 fill-amber-500" /> SemiRestore AI Demonstration
              </h3>
              <button
                onClick={() => setShowDemoModal(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                Close
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Experience the full interactive workspace, image comparison sliders, 1000x microscopic zoom, defect bounding box overlays, and automated PDF report generation.
            </p>
            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDemoModal(false);
                  setActiveTab('workspace');
                }}
                className="rounded-xl bg-gradient-to-r from-[#80A8FF] to-[#CEB5FF] px-6 py-2.5 text-xs font-extrabold text-white shadow-md hover:shadow-lg transition"
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
