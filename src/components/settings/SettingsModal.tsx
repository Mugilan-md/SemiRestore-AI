import React, { useState } from 'react';
import { backendApi } from '../../services/mockBackendApi';
import { ModelConfig } from '../../types/semicon';
import { Settings, Cpu, Zap, Sliders, CheckCircle2, ShieldCheck } from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const [config, setConfig] = useState<ModelConfig>(backendApi.getModelConfig());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    backendApi.updateModelConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 bg-white max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="font-poppins text-lg font-bold text-slate-900 flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" /> Restormer AI Model & Fab Settings
          </h2>
          <p className="text-xs text-slate-500">Configure deep neural network weights, GPU precision, and defect sensitivity.</p>
        </div>

        {saved && (
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl">
            <CheckCircle2 className="h-4 w-4" /> Saved
          </span>
        )}
      </div>

      {/* Model Mode Selection */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-900 block uppercase tracking-wider">
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
                  ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <h4 className="text-xs font-bold text-slate-900">{mode.title}</h4>
              <p className="text-[11px] text-slate-500 mt-1">{mode.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* GPU Acceleration Switch */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
        <div>
          <h4 className="text-xs font-bold text-slate-900">TensorRT FP16 Acceleration</h4>
          <p className="text-[11px] text-slate-500">Enable NVIDIA CUDA H100 Tensor Core FP16 kernel execution.</p>
        </div>
        <input
          type="checkbox"
          checked={config.useGpuAcceleration}
          onChange={(e) => setConfig({ ...config, useGpuAcceleration: e.target.checked })}
          className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
      </div>

      {/* Defect Sensitivity Slider */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold text-slate-900">
          <span>Defect Extraction Threshold</span>
          <span className="text-blue-600">{Math.round(config.defectDetectionThreshold * 100)}%</span>
        </div>
        <input
          type="range"
          min="50"
          max="95"
          value={config.defectDetectionThreshold * 100}
          onChange={(e) => setConfig({ ...config, defectDetectionThreshold: Number(e.target.value) / 100 })}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>

      {/* Save Action */}
      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <button
          onClick={handleSave}
          className="rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-700 transition"
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
};
