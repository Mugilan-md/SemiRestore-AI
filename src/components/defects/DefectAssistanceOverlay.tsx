import React, { useState } from 'react';
import { DefectItem } from '../../types/semicon';
import { ShieldAlert, CheckCircle2, ChevronRight } from 'lucide-react';

interface DefectAssistanceOverlayProps {
  defects: DefectItem[];
  showDefects: boolean;
  setShowDefects: (show: boolean) => void;
}

export const DefectAssistanceOverlay: React.FC<DefectAssistanceOverlayProps> = ({
  defects,
  showDefects,
  setShowDefects,
}) => {
  const [selectedDefect, setSelectedDefect] = useState<DefectItem | null>(defects[0] || null);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const filteredDefects = defects.filter(
    (d) => filterSeverity === 'all' || d.severity === filterSeverity
  );

  return (
    <div className="moondust-glass rounded-3xl p-6 border border-[#CEB5FF] space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-rose-600" />
            <h3 className="text-sm font-black text-slate-900">
              AI Defect Assistance & Yield Diagnostics
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Automated deep-learning bounding box detection with sub-micron defect area computation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Severity Filter */}
          <div className="flex items-center gap-1 bg-[#D3D3FF]/40 p-1 rounded-2xl border border-[#CEB5FF]/50 text-xs font-bold">
            {['all', 'critical', 'major', 'minor'].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-3 py-1 rounded-xl capitalize transition ${
                  filterSeverity === sev
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowDefects(!showDefects)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              showDefects
                ? 'bg-gradient-to-r from-[#80A8FF] to-[#CEB5FF] text-white shadow-xs'
                : 'bg-white text-slate-700 border border-[#CEB5FF]'
            }`}
          >
            {showDefects ? 'Hide BBoxes' : 'Show BBoxes'}
          </button>
        </div>
      </div>

      {/* Defects List & Details Split */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Defects List */}
        <div className="md:col-span-6 space-y-2.5 max-h-80 overflow-y-auto pr-1">
          {filteredDefects.length === 0 ? (
            <div className="p-8 text-center bg-white/80 rounded-2xl border border-[#CEB5FF]">
              <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
              <h4 className="text-xs font-bold text-slate-900">No Defects Identified</h4>
              <p className="text-[11px] text-slate-500 font-medium mt-1">Wafer sample passes Tier-1 yield standards.</p>
            </div>
          ) : (
            filteredDefects.map((def) => {
              const isSelected = selectedDefect?.id === def.id;
              return (
                <div
                  key={def.id}
                  onClick={() => setSelectedDefect(def)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-[#80A8FF] bg-[#D3D3FF]/40 shadow-xs'
                      : 'border-[#CEB5FF]/60 bg-white/80 hover:bg-[#D3D3FF]/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-8 w-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                        def.severity === 'critical'
                          ? 'bg-rose-100 text-rose-700'
                          : def.severity === 'major'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-[#D3D3FF] text-[#80A8FF]'
                      }`}
                    >
                      !
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{def.label}</h4>
                      <span className="text-[10px] text-slate-500 font-medium">
                        Area: {def.areaUm2} μm² • Conf: <span className="text-gold-glitter font-black">{Math.round(def.confidence * 100)}%</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md capitalize ${
                        def.severity === 'critical'
                          ? 'bg-rose-100 text-rose-700'
                          : def.severity === 'major'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-[#D3D3FF] text-[#80A8FF]'
                      }`}
                    >
                      {def.severity}
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Defect Detail Card with Pure Gold Confidence */}
        <div className="md:col-span-6">
          {selectedDefect ? (
            <div className="moondust-glass rounded-2xl p-5 border border-[#CEB5FF] bg-white/90 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#D3D3FF]/50 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Selected Defect</span>
                  <h4 className="text-sm font-black text-slate-900">{selectedDefect.label}</h4>
                </div>
                <span className="text-xs font-black text-gold-glitter badge-gold-glitter px-3 py-1 rounded-xl">
                  {Math.round(selectedDefect.confidence * 100)}% AI Confidence
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">{selectedDefect.description}</p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-[#D3D3FF]">
                  <span className="text-[10px] text-slate-400 font-bold block">Defect Category</span>
                  <span className="text-xs font-extrabold text-slate-900 capitalize">{selectedDefect.category}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-[#D3D3FF]">
                  <span className="text-[10px] text-slate-400 font-bold block">Calculated Area</span>
                  <span className="text-xs font-extrabold text-gold-glitter">{selectedDefect.areaUm2} μm²</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-8 text-xs text-slate-400">
              Select a defect from the list to view diagnostic recommendations.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
