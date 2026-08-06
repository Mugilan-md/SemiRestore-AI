import React, { useState } from 'react';
import { ActiveTab, WaferSample, ViewMode } from './types/semicon';
import { PRESET_WAFER_SAMPLES } from './services/imageProcessingEngine';
import { Navbar } from './components/layout/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { EnterpriseDashboard } from './components/dashboard/EnterpriseDashboard';
import { UploadModule } from './components/upload/UploadModule';
import { ComparisonWorkspace } from './components/workspace/ComparisonWorkspace';
import { LivePipelineMonitor } from './components/pipeline/LivePipelineMonitor';
import { QualityMetricsPanel } from './components/metrics/QualityMetricsPanel';
import { HeatmapViewer } from './components/heatmap/HeatmapViewer';
import { DefectAssistanceOverlay } from './components/defects/DefectAssistanceOverlay';
import { InspectionReportView } from './components/report/InspectionReportView';
import { RecentHistoryTable } from './components/history/RecentHistoryTable';
import { SettingsModal } from './components/settings/SettingsModal';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');
  const [currentSample, setCurrentSample] = useState<WaferSample>(PRESET_WAFER_SAMPLES[0]);
  const [viewMode, setViewMode] = useState<ViewMode>('restored');
  const [showDefects, setShowDefects] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSampleSelected = (sample: WaferSample) => {
    setCurrentSample(sample);
    setActiveTab('workspace');
  };

  const handleCustomImageUploaded = (_file: File, sampleData: WaferSample) => {
    setCurrentSample(sampleData);
    setActiveTab('workspace');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'landing' && <LandingPage setActiveTab={setActiveTab} />}

        {activeTab === 'dashboard' && (
          <EnterpriseDashboard
            setActiveTab={setActiveTab}
            onSelectSample={handleSampleSelected}
          />
        )}

        {activeTab === 'workspace' && (
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
            {/* Quick Upload Banner */}
            <UploadModule
              onSampleSelected={handleSampleSelected}
              onCustomImageUploaded={handleCustomImageUploaded}
            />

            {/* Synchronized Multi-Viewer Workspace */}
            <ComparisonWorkspace
              sample={currentSample}
              viewMode={viewMode}
              setViewMode={setViewMode}
              showDefects={showDefects}
              setShowDefects={setShowDefects}
              onGenerateReport={() => setActiveTab('report')}
            />

            {/* Quantitative Quality Metrics Panel */}
            <QualityMetricsPanel metrics={currentSample.metrics} />

            {/* Heatmap & Spectral Diagnostic Layer */}
            <HeatmapViewer
              sample={currentSample}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />

            {/* AI Defect Assistance Overlay */}
            <DefectAssistanceOverlay
              defects={currentSample.defects}
              showDefects={showDefects}
              setShowDefects={setShowDefects}
            />
          </div>
        )}

        {activeTab === 'pipeline' && (
          <div className="p-4 sm:p-6 lg:p-8">
            <LivePipelineMonitor />
          </div>
        )}

        {activeTab === 'report' && (
          <div className="p-4 sm:p-6 lg:p-8">
            <InspectionReportView sample={currentSample} />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="p-4 sm:p-6 lg:p-8">
            <RecentHistoryTable onSelectSample={handleSampleSelected} />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="p-4 sm:p-6 lg:p-8">
            <SettingsModal />
          </div>
        )}
      </main>

      {/* Enterprise Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 text-xs text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
          <p>© 2026 SemiRestore AI Inc. Engineered for Intel, TSMC, NVIDIA & Samsung Metrology.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Restormer v2.4 FP16</span>
            <span>•</span>
            <span>NVIDIA H100 Accelerated</span>
            <span>•</span>
            <span>ISO/IEC 27001 Certified</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
