import React from 'react';
import { WaferSample } from '../../types/semicon';
import { backendApi } from '../../services/mockBackendApi';
import {
  FileCheck2,
  Printer,
  CheckCircle2,
  Cpu,
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
      <div className="flex items-center justify-between moondust-glass p-4 rounded-3xl border border-[#CEB5FF] shadow-sm">
        <div>
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <FileCheck2 className="h-4 w-4 text-[#80A8FF]" /> Metrology Certificate & Yield Report
          </h2>
          <p className="text-xs text-slate-500 font-medium">Report ID: {reportData.reportId}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#80A8FF] to-[#CEB5FF] px-5 py-2.5 text-xs font-extrabold text-white shadow-md hover:shadow-lg transition border border-white/40"
          >
            <Printer className="h-4 w-4" />
            <span>Print / Export PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Certificate Document */}
      <div className="moondust-glass p-8 sm:p-12 rounded-3xl border-2 border-[#CEB5FF] shadow-2xl space-y-8 print:p-0 print:border-none print:shadow-none bg-white">
        {/* Document Corporate Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b-2 border-slate-900 gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-slate-900 text-[#8EC1DE] flex items-center justify-center font-bold border border-[#8EC1DE]/40">
              <Cpu className="h-7 w-7" />
            </div>
            <div>
              <h1 className="font-cinzel text-xl font-black text-slate-900 tracking-tight">
                SemiRestore<span className="text-gold-glitter">.AI</span>
              </h1>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest font-cinzel">
                Semiconductor Image Metrology & Yield Certificate
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs font-mono text-slate-700">
            <p className="font-black text-slate-900">{reportData.reportId}</p>
            <p className="font-medium">{reportData.generatedAt}</p>
            <p className="text-gold-glitter font-bold">{sample.foundry}</p>
          </div>
        </div>

        {/* Wafer Lot Info & Quality Score Verdict */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-2xl bg-[#D3D3FF]/20 border border-[#CEB5FF]">
          <div className="space-y-2 text-xs">
            <h3 className="font-black text-slate-900 uppercase tracking-wider text-[11px]">
              Wafer Inspection Metadata
            </h3>
            <p><span className="text-slate-500 font-medium">Wafer Lot ID:</span> <span className="font-mono font-bold text-slate-900">{sample.waferLot}</span></p>
            <p><span className="text-slate-500 font-medium">Pattern Category:</span> <span className="font-bold text-slate-900">{sample.category}</span></p>
            <p><span className="text-slate-500 font-medium">Metrology Inspector:</span> <span className="font-bold text-slate-900">{reportData.operator}</span></p>
            <p><span className="text-slate-500 font-medium">AI Restormer Engine:</span> <span className="font-mono text-gold-glitter font-black">Restormer v2.4 FP16</span></p>
          </div>

          <div className="flex flex-col items-start sm:items-end justify-center">
            <span className="text-xs font-black text-slate-400 uppercase">Yield Audit Verdict</span>
            <div className={`mt-1 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black shadow-xs ${
              reportData.verdict.includes('PASSED')
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-rose-100 text-rose-800 border border-rose-300'
            }`}>
              <CheckCircle2 className="h-5 w-5" />
              <span>{reportData.verdict}</span>
            </div>
            <span className="text-xs font-extrabold text-slate-800 mt-2">
              Overall Yield Score: <span className="text-gold-glitter text-base font-black">{reportData.overallQualityScore}%</span>
            </span>
          </div>
        </div>

        {/* Metrics Grid with Pure Gold Numbers */}
        <div>
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3">
            Quantitative Restoration Metrics
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3.5 rounded-2xl bg-white border border-[#CEB5FF] shadow-2xs">
              <span className="text-[10px] text-slate-500 font-bold block">PSNR Score</span>
              <span className="text-lg font-black text-gold-glitter">{sample.metrics.psnr} dB</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-[#CEB5FF] shadow-2xs">
              <span className="text-[10px] text-slate-500 font-bold block">SSIM Index</span>
              <span className="text-lg font-black text-gold-glitter">{sample.metrics.ssim}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-[#CEB5FF] shadow-2xs">
              <span className="text-[10px] text-slate-500 font-bold block">Noise Reduction</span>
              <span className="text-lg font-black text-gold-glitter">{sample.metrics.noiseReductionPct}%</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-[#CEB5FF] shadow-2xs">
              <span className="text-[10px] text-slate-500 font-bold block">Extracted Defects</span>
              <span className="text-lg font-black text-slate-900">{sample.defects.length}</span>
            </div>
          </div>
        </div>

        {/* Actionable Engineering Recommendations */}
        <div className="p-5 rounded-2xl bg-[#D3D3FF]/30 border border-[#CEB5FF]">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500 fill-amber-400" />
            <span className="text-gold-glitter">Actionable Fab Engineering Recommendations</span>
          </h3>
          <ul className="space-y-2 text-xs text-slate-800 font-medium">
            {reportData.actionableRecommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#80A8FF] mt-1.5 shrink-0" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Certificate Signatures Footer */}
        <div className="pt-8 border-t border-[#CEB5FF] flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <div>
            <p className="font-bold text-slate-800">SemiRestore AI Enterprise Platform</p>
            <p>ISO/IEC 27001 Metrology Standards Compliant</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-slate-700 font-bold">Digital Signature Hash:</p>
            <p className="font-mono text-[9px] text-[#80A8FF] font-bold">0x8F9A4B...C21E</p>
          </div>
        </div>
      </div>
    </div>
  );
};
