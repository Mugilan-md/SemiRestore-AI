import React, { useState } from 'react';
import { ActiveTab, WaferSample, ViewMode } from './types/semicon';
import { AuthProvider } from './contexts/AuthContext';
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

  const navigateToModule = (
    tab: ActiveTab,
    options?: {
      viewMode?: ViewMode;
      showDefects?: boolean;
      scrollToId?: string;
    }
  ) => {
    if (options?.viewMode) {
      setViewMode(options.viewMode);
    }
    if (options?.showDefects !== undefined) {
      setShowDefects(options.showDefects);
    }
    setActiveTab(tab);
    if (options?.scrollToId) {
      setTimeout(() => {
        const el = document.getElementById(options.scrollToId!);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <AuthProvider>
    <div className="min-h-screen bg-moondust-mesh text-slate-900 flex flex-col font-sans selection:bg-[#CEB5FF] selection:text-slate-900 relative">
      {/* Background Ambient Moon Dust Glow Orbs */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[500px] bg-[#CEB5FF]/30 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-10 w-[550px] h-[450px] bg-[#8EC1DE]/35 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-10 left-10 w-[500px] h-[400px] bg-[#80A8FF]/25 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-20 right-1/4 w-[450px] h-[400px] bg-[#D3D3FF]/35 blur-[110px] rounded-full pointer-events-none -z-10" />

      {/* Top Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16 relative z-10">
        {activeTab === 'landing' && (
          <LandingPage
            setActiveTab={setActiveTab}
            onNavigateModule={navigateToModule}
          />
        )}

        {activeTab === 'dashboard' && (
          <EnterpriseDashboard
            setActiveTab={setActiveTab}
            onSelectSample={handleSampleSelected}
          />
        )}

        {activeTab === 'workspace' && (
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
            {/* Quick Upload Banner */}
            <div id="workspace-upload">
              <UploadModule
                onSampleSelected={handleSampleSelected}
                onCustomImageUploaded={handleCustomImageUploaded}
              />
            </div>

            {/* Synchronized Multi-Viewer Workspace */}
            <div id="workspace-viewer">
              <ComparisonWorkspace
                sample={currentSample}
                viewMode={viewMode}
                setViewMode={setViewMode}
                showDefects={showDefects}
                setShowDefects={setShowDefects}
                onGenerateReport={() => setActiveTab('report')}
              />
            </div>

            {/* Quantitative Quality Metrics Panel */}
            <div id="workspace-metrics">
              <QualityMetricsPanel metrics={currentSample.metrics} />
            </div>

            {/* Heatmap & Spectral Diagnostic Layer */}
            <div id="workspace-heatmaps">
              <HeatmapViewer
                sample={currentSample}
                viewMode={viewMode}
                setViewMode={setViewMode}
              />
            </div>

            {/* AI Defect Assistance Overlay */}
            <div id="workspace-defects">
              <DefectAssistanceOverlay
                defects={currentSample.defects}
                showDefects={showDefects}
                setShowDefects={setShowDefects}
              />
            </div>
          </div>
        )}

        {activeTab === 'pipeline' && (
          <div id="batch-pipeline-monitor" className="p-4 sm:p-6 lg:p-8">
            <LivePipelineMonitor />
          </div>
        )}

        {activeTab === 'report' && (
          <div id="inspection-report-view" className="p-4 sm:p-6 lg:p-8">
            <InspectionReportView sample={currentSample} />
          </div>
        )}

        {activeTab === 'history' && (
          <div id="recent-history-table" className="p-4 sm:p-6 lg:p-8">
            <RecentHistoryTable onSelectSample={handleSampleSelected} />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="p-4 sm:p-6 lg:p-8">
            <SettingsModal />
          </div>
        )}
      </main>

      {/* Enterprise Footer with Moon Dust & Shimmering Gold Accents */}
      <footer className="border-t border-[#CEB5FF]/50 bg-white/70 backdrop-blur-md py-6 text-xs text-slate-600 relative z-10">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
          <p>© 2026 SemiRestore AI Inc. Engineered for Intel, TSMC, NVIDIA & Samsung Metrology.</p>
          <div className="flex items-center gap-4 text-slate-500 font-medium">
            <span className="text-gold-glitter font-bold">Restormer v2.4 FP16</span>
            <span>•</span>
            <span className="text-gold-glitter font-bold">NVIDIA H100 Accelerated</span>
            <span>•</span>
            <span className="text-[#80A8FF] font-semibold">ISO/IEC 27001 Certified</span>
          </div>
        </div>
      </footer>
    </div>
    </AuthProvider>
  );
}

export default App;
