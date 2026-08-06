export type ActiveTab = 'landing' | 'dashboard' | 'workspace' | 'pipeline' | 'report' | 'history' | 'settings';

export type ViewMode = 'original' | 'degraded' | 'restored' | 'heatmap' | 'edge' | 'attention' | 'confidence' | 'false_color';

export type ComparisonLayout = 'triple' | 'slider' | 'split' | 'overlay' | 'microscope';

export interface DefectItem {
  id: string;
  label: string;
  category: 'scratch' | 'crack' | 'void' | 'particle' | 'contamination' | 'bridge';
  bbox: { x: number; y: number; width: number; height: number }; // percentage 0..100
  confidence: number;
  severity: 'critical' | 'major' | 'minor';
  areaUm2: number; // area in square micrometers
  description: string;
}

export interface QualityMetrics {
  psnr: number; // e.g. 38.4 dB
  ssim: number; // e.g. 0.984
  noiseReductionPct: number; // e.g. 94.6%
  restorationConfidence: number; // e.g. 99.2%
  processingTimeMs: number; // e.g. 18.4 ms
  gpuMemoryGb: number; // e.g. 4.2 GB
  resolutionScale: '1x' | '2x' | '4x';
  inferenceSpeedFps: number; // e.g. 142 FPS
  snrGainDb: number; // e.g. 14.8 dB
}

export interface PipelineStage {
  id: string;
  name: string;
  description: string;
  estimatedTimeMs: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number; // 0..100
  logs: string[];
}

export interface WaferSample {
  id: string;
  title: string;
  category: 'Sub-7nm FinFET' | 'EUV Gate Mask' | 'Silicon Wafer Die' | 'TSV Micro-Void' | 'Copper Interconnect';
  waferLot: string;
  foundry: string;
  resolution: string;
  originalImage: string;
  noisyImage: string;
  restoredImage: string;
  defects: DefectItem[];
  metrics: QualityMetrics;
  timestamp: string;
}

export interface ModelConfig {
  modelName: 'Restormer' | 'SwinIR' | 'CLAHE-Lite';
  accuracyLevel: 'fast' | 'balanced' | 'high_accuracy';
  useGpuAcceleration: boolean;
  superResMultiplier: 1 | 2 | 4;
  defectDetectionThreshold: number; // 0.5 to 0.95
  autoReportGeneration: boolean;
  theme: 'light' | 'dark';
}

export interface InspectionReportData {
  reportId: string;
  generatedAt: string;
  waferSample: WaferSample;
  modelConfig: ModelConfig;
  operator: string;
  foundryFacility: string;
  overallQualityScore: number; // 0..100
  verdict: 'PASSED (Tier 1 Yield)' | 'CONDITIONAL PASS' | 'DEFECT REJECTED';
  actionableRecommendations: string[];
}
