import { supabase } from '../lib/supabase';
import { WaferSample, ModelConfig, InspectionReportData } from '../types/semicon';
import { PRESET_WAFER_SAMPLES } from './imageProcessingEngine';
import { backendApi as mockApi, GpuStatus, INITIAL_PIPELINE_STAGES } from './mockBackendApi';

// Re-export for backward compat
export { GpuStatus, INITIAL_PIPELINE_STAGES };

// ─── Helper: get current user id ──────────────────────────────
async function getCurrentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data?.user?.id ?? null;
}

// ─── GPU Status (still simulated — hardware telemetry) ─────────
export function getGpuStatus(): GpuStatus {
  return mockApi.getGpuStatus();
}

// ─── MODEL CONFIG ─────────────────────────────────────────────
export async function getModelConfig(): Promise<ModelConfig> {
  const userId = await getCurrentUserId();
  if (!userId) return mockApi.getModelConfig();

  const { data, error } = await supabase
    .from('model_configs')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    // First time: create default config for this user
    const defaultConfig = mockApi.getModelConfig();
    await upsertModelConfig(defaultConfig);
    return defaultConfig;
  }

  return {
    modelName: data.model_name as ModelConfig['modelName'],
    accuracyLevel: data.accuracy_level as ModelConfig['accuracyLevel'],
    useGpuAcceleration: data.use_gpu_acceleration,
    superResMultiplier: data.super_res_multiplier as ModelConfig['superResMultiplier'],
    defectDetectionThreshold: Number(data.defect_detection_threshold),
    autoReportGeneration: data.auto_report_generation,
    theme: data.theme as ModelConfig['theme'],
  };
}

export async function upsertModelConfig(config: Partial<ModelConfig>): Promise<ModelConfig> {
  const userId = await getCurrentUserId();
  if (!userId) return mockApi.updateModelConfig(config);

  const { data, error } = await supabase
    .from('model_configs')
    .upsert(
      {
        user_id: userId,
        model_name: config.modelName,
        accuracy_level: config.accuracyLevel,
        use_gpu_acceleration: config.useGpuAcceleration,
        super_res_multiplier: config.superResMultiplier,
        defect_detection_threshold: config.defectDetectionThreshold,
        auto_report_generation: config.autoReportGeneration,
        theme: config.theme,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )
    .select()
    .single();

  if (error || !data) return mockApi.updateModelConfig(config);

  return {
    modelName: data.model_name as ModelConfig['modelName'],
    accuracyLevel: data.accuracy_level as ModelConfig['accuracyLevel'],
    useGpuAcceleration: data.use_gpu_acceleration,
    superResMultiplier: data.super_res_multiplier as ModelConfig['superResMultiplier'],
    defectDetectionThreshold: Number(data.defect_detection_threshold),
    autoReportGeneration: data.auto_report_generation,
    theme: data.theme as ModelConfig['theme'],
  };
}

// ─── WAFER SAMPLES ─────────────────────────────────────────────
export async function getSamples(): Promise<WaferSample[]> {
  const userId = await getCurrentUserId();
  if (!userId) return mockApi.getSamples();

  const { data, error } = await supabase
    .from('wafer_samples')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error || !data || data.length === 0) {
    // Return preset samples if DB is empty
    return PRESET_WAFER_SAMPLES;
  }

  return data.map(rowToWaferSample);
}

export async function addSample(sample: WaferSample): Promise<WaferSample> {
  const userId = await getCurrentUserId();
  if (!userId) return mockApi.addSample(sample);

  const { error } = await supabase.from('wafer_samples').insert({
    id: sample.id,
    user_id: userId,
    title: sample.title,
    category: sample.category,
    wafer_lot: sample.waferLot,
    foundry: sample.foundry,
    resolution: sample.resolution,
    original_image: sample.originalImage,
    noisy_image: sample.noisyImage,
    restored_image: sample.restoredImage,
    defects: sample.defects,
    metrics: sample.metrics,
    timestamp: sample.timestamp,
  });

  if (error) {
    console.error('[supabaseApi] addSample error:', error.message);
  }

  return sample;
}

export async function deleteSample(id: string): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) {
    mockApi.deleteSample(id);
    return;
  }

  const { error } = await supabase
    .from('wafer_samples')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    console.error('[supabaseApi] deleteSample error:', error.message);
  }
}

// ─── INSPECTION REPORTS ────────────────────────────────────────
export async function saveReport(report: InspectionReportData): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) return;

  const { error } = await supabase.from('inspection_reports').insert({
    report_id: report.reportId,
    user_id: userId,
    wafer_sample_id: report.waferSample.id,
    operator: report.operator,
    foundry_facility: report.foundryFacility,
    overall_quality_score: report.overallQualityScore,
    verdict: report.verdict,
    recommendations: report.actionableRecommendations,
    model_config: report.modelConfig,
    generated_at: report.generatedAt,
  });

  if (error) {
    console.error('[supabaseApi] saveReport error:', error.message);
  }
}

export async function getReports(): Promise<InspectionReportData[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const { data, error } = await supabase
    .from('inspection_reports')
    .select('*, wafer_samples(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    reportId: row.report_id,
    generatedAt: row.generated_at,
    waferSample: row.wafer_samples ? rowToWaferSample(row.wafer_samples) : PRESET_WAFER_SAMPLES[0],
    modelConfig: row.model_config as ModelConfig,
    operator: row.operator,
    foundryFacility: row.foundry_facility,
    overallQualityScore: Number(row.overall_quality_score),
    verdict: row.verdict as InspectionReportData['verdict'],
    actionableRecommendations: row.recommendations as string[],
  }));
}

export function generateReport(
  sample: WaferSample,
  operatorName: string = 'Dr. Elena Vance (Lead Metrology Engineer)'
): InspectionReportData {
  // Generation logic stays on the client (uses mock logic)
  const report = mockApi.generateReport(sample, operatorName);
  // Persist to DB asynchronously — don't block the UI
  saveReport(report).catch(console.error);
  return report;
}

// ─── Row mapper ────────────────────────────────────────────────
function rowToWaferSample(row: Record<string, unknown>): WaferSample {
  return {
    id: row.id as string,
    title: row.title as string,
    category: row.category as WaferSample['category'],
    waferLot: (row.wafer_lot ?? row.waferLot) as string,
    foundry: row.foundry as string,
    resolution: row.resolution as string,
    originalImage: (row.original_image ?? row.originalImage) as string,
    noisyImage: (row.noisy_image ?? row.noisyImage) as string,
    restoredImage: (row.restored_image ?? row.restoredImage) as string,
    defects: (row.defects ?? []) as WaferSample['defects'],
    metrics: (row.metrics ?? {}) as WaferSample['metrics'],
    timestamp: row.timestamp as string,
  };
}
