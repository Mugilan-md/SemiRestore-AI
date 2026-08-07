import React, { useState } from 'react';
import { backendApi } from '../../services/mockBackendApi';
import { ModelConfig } from '../../types/semicon';
import { Settings, CheckCircle2 } from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const [config, setConfig] = useState<ModelConfig>(backendApi.getModelConfig());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    backendApi.updateModelConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="moondust-glass rounded-3xl p-6 sm:p-8 border border-[#CEB5FF] max-w-3xl mx-auto space-y-6 shadow-md">
      <div className="flex items-center justify-between border-b border-[#D3D3FF]/60 pb-4">
        <div>
          <h2 className="font-poppins text-lg font-black text-slate-900 flex items-center gap-2">
            <Settings className="h-5 w-5 text-[#80A8FF]" />
            <span>Restormer AI Model & Fab Settings</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">Configure deep neural network weights, GPU precision, and defect sensitivity.</p>
        </div>

        {saved && (
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/90 px-3 py-1 rounded-xl">
            <CheckCircle2 className="h-4 w-4" /> Saved
          </span>
        )}
      </div>

      {/* Model Mode Selection */}
      <div className="space-y-3">
        <label className="text-xs font-black text-slate-900 block uppercase tracking-wider">
          AI Architecture & Accuracy Tier
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: 'fast' as ModelConfig['accuracyLevel'],
              title: 'Fast Mode',
              desc: 'CLAHE + Bilateral Restormer Lite (5ms / 200 FPS)',
            },
            {
              id: 'balanced' as ModelConfig['accuracyLevel'],
              title: 'Balanced Mode',
              desc: 'Restormer Base FP16 (12ms / 150 FPS)',
            },
            {
              id: 'high_accuracy' as ModelConfig['accuracyLevel'],
              title: 'High Accuracy',
              desc: 'SwinIR Large + Restormer Deep 4x (18ms / 120 FPS)',
            },
          ].map((mode) => (
            <div
              key={mode.id}
              onClick={() => setConfig({ ...config, accuracyLevel: mode.id })}
              className={`p-4 rounded-2xl border cursor-pointer transition ${
                config.accuracyLevel === mode.id
                  ? 'border-[#80A8FF] bg-[#D3D3FF]/50 ring-2 ring-[#80A8FF]/30 shadow-xs'
                  : 'border-[#CEB5FF]/60 bg-white/80 hover:bg-[#D3D3FF]/20'
              }`}
            >
              <h4 className="text-xs font-bold text-slate-900">{mode.title}</h4>
              <p className="text-[11px] text-slate-500 font-medium mt-1">{mode.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* GPU Acceleration Switch */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white/80 border border-[#CEB5FF]">
        <div>
          <h4 className="text-xs font-bold text-slate-900">TensorRT FP16 Acceleration</h4>
          <p className="text-[11px] text-slate-500 font-medium">Enable NVIDIA CUDA H100 Tensor Core FP16 kernel execution.</p>
        </div>
        <input
          type="checkbox"
          checked={config.useGpuAcceleration}
          onChange={(e) => setConfig({ ...config, useGpuAcceleration: e.target.checked })}
          className="h-5 w-5 rounded border-[#CEB5FF] text-[#80A8FF] focus:ring-[#80A8FF] cursor-pointer"
        />
      </div>

      {/* Defect Sensitivity Slider */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold text-slate-900">
          <span>Defect Extraction Threshold</span>
          <span className="text-gold-glitter font-black">{Math.round(config.defectDetectionThreshold * 100)}%</span>
        </div>
        <input
          type="range"
          min="50"
          max="95"
          value={config.defectDetectionThreshold * 100}
          onChange={(e) => setConfig({ ...config, defectDetectionThreshold: Number(e.target.value) / 100 })}
          className="w-full h-2 bg-[#D3D3FF]/60 rounded-lg appearance-none cursor-pointer accent-[#80A8FF]"
        />
      </div>

      {/* Save Action */}
      <div className="pt-4 border-t border-[#D3D3FF]/60 flex justify-end">
        <button
          onClick={handleSave}
          className="rounded-xl bg-gradient-to-r from-[#80A8FF] to-[#CEB5FF] px-6 py-2.5 text-xs font-extrabold text-white shadow-md hover:shadow-lg transition border border-white/40"
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
};
