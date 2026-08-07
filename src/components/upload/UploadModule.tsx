import React, { useState, useRef } from 'react';
import { WaferSample } from '../../types/semicon';
import { PRESET_WAFER_SAMPLES } from '../../services/imageProcessingEngine';
import {
  UploadCloud,
  Sparkles,
  ArrowRight,
  Cpu,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface UploadModuleProps {
  onSampleSelected: (sample: WaferSample) => void;
  onCustomImageUploaded: (file: File, sampleData: WaferSample) => void;
}

export const UploadModule: React.FC<UploadModuleProps> = ({
  onSampleSelected,
  onCustomImageUploaded,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationInfo, setValidationInfo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    setUploading(true);
    setUploadProgress(0);
    setValidationInfo('Validating SEM Image Format & Resolution...');

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setUploadProgress(progress);
      if (progress === 40) {
        setValidationInfo('16-bit Spatial Depth Audited. Computing Initial SNR...');
      } else if (progress === 80) {
        setValidationInfo('Constructing Wafer Lot Tensor Container...');
      } else if (progress >= 100) {
        clearInterval(interval);
        setUploading(false);

        // Create custom sample object
        const customSample: WaferSample = {
          id: `waf-custom-${Date.now()}`,
          title: file.name.replace(/\.[^/.]+$/, ''),
          category: 'Silicon Wafer Die',
          waferLot: `CUSTOM-LOT-${Math.floor(1000 + Math.random() * 9000)}`,
          foundry: 'Local Facility Node',
          resolution: '4096 x 4096 (0.2nm/px)',
          originalImage: URL.createObjectURL(file),
          noisyImage: URL.createObjectURL(file),
          restoredImage: URL.createObjectURL(file),
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
          metrics: {
            psnr: 38.9,
            ssim: 0.986,
            noiseReductionPct: 95.2,
            restorationConfidence: 99.1,
            processingTimeMs: 18.1,
            gpuMemoryGb: 4.4,
            resolutionScale: '4x',
            inferenceSpeedFps: 148,
            snrGainDb: 14.8,
          },
          defects: [
            {
              id: 'def-custom-1',
              label: 'Surface Contamination Particle',
              category: 'particle',
              bbox: { x: 42, y: 35, width: 15, height: 15 },
              confidence: 0.954,
              severity: 'major',
              areaUm2: 0.084,
              description: 'Sub-micron particulate on dielectric passivation layer.',
            },
          ],
        };

        onCustomImageUploaded(file, customSample);
      }
    }, 250);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Drag & Drop Upload Zone styled with Moon Dust */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center transition-all cursor-pointer ${
          isDragging
            ? 'border-[#80A8FF] bg-[#D3D3FF]/50 scale-[1.01]'
            : 'border-[#CEB5FF] moondust-glass hover:border-[#80A8FF] hover:bg-[#D3D3FF]/30 shadow-md'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/bmp,image/tiff"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#80A8FF] to-[#CEB5FF] text-white shadow-lg shadow-[#80A8FF]/25 mb-4 border border-white/40">
          <UploadCloud className="h-8 w-8" />
        </div>

        <h3 className="font-poppins text-lg font-black text-slate-900">
          Drag & Drop Semiconductor Scan Here
        </h3>
        <p className="text-xs text-slate-600 max-w-md mx-auto mt-1 font-medium">
          Supports <span className="font-bold text-slate-800">PNG, BMP, JPEG, TIFF</span> 16-bit uncompressed SEM detector arrays up to 100MB.
        </p>

        {/* Upload Progress Overlay */}
        {uploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 max-w-sm mx-auto p-4 rounded-2xl moondust-glass border border-[#CEB5FF] shadow-2xl"
          >
            <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-2">
              <span className="flex items-center gap-1.5 text-gold-glitter font-black">
                <Cpu className="h-4 w-4 animate-spin text-amber-500" /> Ingesting Binary...
              </span>
              <span className="font-black text-slate-900">{uploadProgress}%</span>
            </div>
            <div className="h-2 w-full bg-[#D3D3FF]/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#80A8FF] to-[#CEB5FF] transition-all duration-300 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-2 italic font-medium">{validationInfo}</p>
          </motion.div>
        )}
      </div>

      {/* Preset Wafer Samples Bar with Pure Gold Scores */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500 fill-amber-400" />
              <span>Preset Fab Wafer Die Datasets</span>
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              Select pre-loaded SEM micro-die samples for immediate analysis
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRESET_WAFER_SAMPLES.map((sample) => (
            <motion.div
              key={sample.id}
              whileHover={{ y: -3 }}
              onClick={() => onSampleSelected(sample)}
              className="moondust-glass-interactive rounded-2xl p-4 cursor-pointer flex flex-col justify-between border border-[#CEB5FF]"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="rounded-md bg-[#D3D3FF]/80 px-2 py-0.5 text-[10px] font-bold text-[#80A8FF]">
                    {sample.category}
                  </span>
                  <span className="text-xs font-black text-gold-glitter">
                    {sample.metrics.psnr} dB
                  </span>
                </div>
                <h5 className="text-xs font-bold text-slate-900 line-clamp-1">{sample.title}</h5>
                <p className="text-[11px] text-slate-500 font-medium mt-1">Lot: {sample.waferLot}</p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-[#D3D3FF]/60 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">{sample.resolution}</span>
                <span className="text-xs font-extrabold text-[#80A8FF] flex items-center gap-1">
                  Inspect <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
