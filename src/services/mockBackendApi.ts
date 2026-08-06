import { WaferSample, PipelineStage, ModelConfig, QualityMetrics, InspectionReportData } from '../types/semicon';
import { PRESET_WAFER_SAMPLES } from './imageProcessingEngine';

export interface GpuStatus {
  device: string;
  temperatureC: number;
  gpuLoadPct: number;
  vramUsedGb: number;
  vramTotalGb: number;
  cudaVersion: string;
  tensorRtEngine: string;
  activeModel: string;
  throughputFps: number;
}

const DEFAULT_GPU_STATUS: GpuStatus = {
  device: 'NVIDIA H100 SXM5 80GB (Fab-Node-04)',
  temperatureC: 48,
  gpuLoadPct: 68,
  vramUsedGb: 14.8,
  vramTotalGb: 80.0,
  cudaVersion: 'CUDA 12.4 / cuDNN 9.1',
  tensorRtEngine: 'TensorRT 10.2 FP16 Optimized',
  activeModel: 'Restormer-Semicon-v2.4',
  throughputFps: 148,
};

export const INITIAL_PIPELINE_STAGES: PipelineStage[] = [
  { id: 'stg-1', name: 'Uploading Image Data', description: 'Ingesting 16-bit SEM TIFF binary array', estimatedTimeMs: 300, status: 'pending', progress: 0, logs: [] },
  { id: 'stg-2', name: 'Image Validation & Resolution Audit', description: 'Auditing bit-depth, spatial sampling rate & spatial contrast', estimatedTimeMs: 400, status: 'pending', progress: 0, logs: [] },
  { id: 'stg-3', name: 'Noise Spectral Analysis', description: 'Estimating Gaussian SNR variance & Poisson shot noise distribution', estimatedTimeMs: 600, status: 'pending', progress: 0, logs: [] },
  { id: 'stg-4', name: 'Speckle & Sensor Artifact Removal', description: 'Bilateral spatial transform and spatial-frequency filtering', estimatedTimeMs: 800, status: 'pending', progress: 0, logs: [] },
  { id: 'stg-5', name: 'Restormer / SwinIR Super-Resolution', description: 'Multi-head transposed attention neural upscaling (4x)', estimatedTimeMs: 1200, status: 'pending', progress: 0, logs: [] },
  { id: 'stg-6', name: 'Sub-Nanometer Edge Recovery', description: 'High-pass unsharp transformer gradient sharpening', estimatedTimeMs: 700, status: 'pending', progress: 0, logs: [] },
  { id: 'stg-7', name: 'Dynamic Contrast & CLAHE Optimization', description: 'Local histogram equalization for sub-10nm feature contrast', estimatedTimeMs: 500, status: 'pending', progress: 0, logs: [] },
  { id: 'stg-8', name: 'Quality Metrics & Metrology Audit', description: 'Computing PSNR, SSIM, SNR gain, and AI defect bounding boxes', estimatedTimeMs: 600, status: 'pending', progress: 0, logs: [] },
  { id: 'stg-9', name: 'Inspection Report Assembly', description: 'Formulating executive PDF inspection certificate and JSON schema', estimatedTimeMs: 400, status: 'pending', progress: 0, logs: [] },
];

class MockBackendApi {
  private currentSamples: WaferSample[] = [...PRESET_WAFER_SAMPLES];
  private modelConfig: ModelConfig = {
    modelName: 'Restormer',
    accuracyLevel: 'high_accuracy',
    useGpuAcceleration: true,
    superResMultiplier: 4,
    defectDetectionThreshold: 0.85,
    autoReportGeneration: true,
    theme: 'light',
  };

  public getGpuStatus(): GpuStatus {
    // Add micro variations
    return {
      ...DEFAULT_GPU_STATUS,
      gpuLoadPct: Math.floor(62 + Math.random() * 14),
      temperatureC: Math.floor(46 + Math.random() * 5),
      throughputFps: Math.floor(140 + Math.random() * 20),
    };
  }

  public getModelConfig(): ModelConfig {
    return { ...this.modelConfig };
  }

  public updateModelConfig(newConfig: Partial<ModelConfig>): ModelConfig {
    this.modelConfig = { ...this.modelConfig, ...newConfig };
    return this.modelConfig;
  }

  public getSamples(): WaferSample[] {
    return this.currentSamples;
  }

  public addSample(sample: WaferSample): WaferSample {
    this.currentSamples = [sample, ...this.currentSamples];
    return sample;
  }

  public deleteSample(id: string): void {
    this.currentSamples = this.currentSamples.filter((s) => s.id !== id);
  }

  public generateReport(sample: WaferSample, operatorName: string = 'Dr. Elena Vance (Lead Metrology Engineer)'): InspectionReportData {
    const defectCount = sample.defects.length;
    const criticalCount = sample.defects.filter((d) => d.severity === 'critical').length;

    let verdict: InspectionReportData['verdict'] = 'PASSED (Tier 1 Yield)';
    let overallQualityScore = 98.4;

    if (criticalCount > 0) {
      verdict = 'DEFECT REJECTED';
      overallQualityScore = 64.2;
    } else if (defectCount > 0) {
      verdict = 'CONDITIONAL PASS';
      overallQualityScore = 86.8;
    }

    const recommendations = [];
    if (criticalCount > 0) {
      recommendations.push('Halt Lot production on Fab Node 18 for immediate EUV reticle cleaning.');
      recommendations.push('Trigger automated atomic force microscopy (AFM) depth profile verification.');
    } else if (defectCount > 0) {
      recommendations.push('Flag wafer lot for secondary chemical mechanical planarization (CMP) audit.');
      recommendations.push('Monitor M3 interconnect spatial variance across subsequent 25-wafer cassettes.');
    } else {
      recommendations.push('Wafer batch qualifies for Tier 1 high-yield packaging delivery.');
      recommendations.push('Proceed directly to automated wire bonding and flip-chip assembly.');
    }

    return {
      reportId: `REP-SEMI-${Math.floor(100000 + Math.random() * 900000)}`,
      generatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      waferSample: sample,
      modelConfig: this.modelConfig,
      operator: operatorName,
      foundryFacility: sample.foundry,
      overallQualityScore,
      verdict,
      actionableRecommendations: recommendations,
    };
  }
}

export const backendApi = new MockBackendApi();
