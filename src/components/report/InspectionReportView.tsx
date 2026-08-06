import React from 'react';
import { WaferSample } from '../../types/semicon';
import { backendApi } from '../../services/mockBackendApi';
import {
  FileCheck2,
  Printer,
  Download,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  ShieldCheck,
  Building2,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface InspectionReportViewProps {
  sample: WaferSample;
}

export const InspectionReportView: React.FC<InspectionReportViewProps> = ({ sample }) => {
  const reportData = backendApi.generateReport(sample);

  const handleExportPDF = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileCheck2 className="h-4 w-4 text-blue-600" /> Metrology Certificate & Yield Report
          </h2>
          <p className="text-xs text-slate-500">Report ID: {reportData.reportId}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-blue-700 transition"
          >
            <Printer className="h-4 w-4" />
            <span>Print / Export PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Certificate Document */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl space-y-8 print:p-0 print:border-none print:shadow-none">
        {/* Document Corporate Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b-2 border-slate-900 gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-slate-900 text-cyan-400 flex items-center justify-center font-bold">
              <Cpu className="h-7 w-7" />
            </div>
            <div>
              <h1 className="font-poppins text-xl font-extrabold text-slate-900 tracking-tight">
                SemiRestore<span className="text-blue-600">.AI</span>
              </h1>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Semiconductor Image Metrology & Yield Certificate
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs font-mono text-slate-600">
            <p className="font-bold text-slate-900">{reportData.reportId}</p>
            <p>{reportData.generatedAt}</p>
            <p className="text-blue-600 font-semibold">{sample.foundry}</p>
          </div>
        </div>

        {/* Wafer Lot Info & Quality Score Verdict */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="space-y-2 text-xs">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Wafer Inspection Metadata
            </h3>
            <p><span className="text-slate-500 font-medium">Wafer Lot ID:</span> <span className="font-mono font-bold text-slate-900">{sample.waferLot}</span></p>
            <p><span className="text-slate-500 font-medium">Pattern Category:</span> <span className="font-semibold text-slate-900">{sample.category}</span></p>
            <p><span className="text-slate-500 font-medium">Metrology Inspector:</span> <span className="font-semibold text-slate-900">{reportData.operator}</span></p>
            <p><span className="text-slate-500 font-medium">AI Restormer Engine:</span> <span className="font-mono text-blue-600">Restormer v2.4 FP16</span></p>
          </div>

          <div className="flex flex-col items-start sm:items-end justify-center">
            <span className="text-xs font-bold text-slate-400 uppercase">Yield Audit Verdict</span>
            <div className={`mt-1 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-extrabold shadow-xs ${
              reportData.verdict.includes('PASSED')
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-rose-100 text-rose-800 border border-rose-300'
            }`}>
              <CheckCircle2 className="h-5 w-5" />
              <span>{reportData.verdict}</span>
            </div>
            <span className="text-xs font-bold text-slate-700 mt-2">
              Overall Yield Score: <span className="text-blue-600">{reportData.overallQualityScore}%</span>
            </span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-3">
            Quantitative Restoration Metrics
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 font-medium block">PSNR Score</span>
              <span className="text-base font-extrabold text-blue-600">{sample.metrics.psnr} dB</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 font-medium block">SSIM Index</span>
              <span className="text-base font-extrabold text-cyan-600">{sample.metrics.ssim}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 font-medium block">Noise Reduction</span>
              <span className="text-base font-extrabold text-emerald-600">{sample.metrics.noiseReductionPct}%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 font-medium block">Extracted Defects</span>
              <span className="text-base font-extrabold text-rose-600">{sample.defects.length}</span>
            </div>
          </div>
        </div>

        {/* Actionable Engineering Recommendations */}
        <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200">
          <h3 className="text-xs font-bold text-blue-900 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-600" /> Actionable Fab Engineering Recommendations
          </h3>
          <ul className="space-y-2 text-xs text-blue-950 font-medium">
            {reportData.actionableRecommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Certificate Signatures Footer */}
        <div className="pt-8 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
          <div>
            <p className="font-semibold text-slate-700">SemiRestore AI Enterprise Platform</p>
            <p>ISO/IEC 27001 Metrology Standards Compliant</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-slate-600">Digital Signature Hash:</p>
            <p className="font-mono text-[9px] text-slate-400">0x8F9A4B...C21E</p>
          </div>
        </div>
      </div>
    </div>
  );
};
