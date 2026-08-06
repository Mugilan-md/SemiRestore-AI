import React, { useState } from 'react';
import { DefectItem } from '../../types/semicon';
import { ShieldAlert, AlertTriangle, CheckCircle2, ChevronRight, Filter } from 'lucide-react';

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
    <div className="glass-panel rounded-3xl p-6 border border-slate-200 bg-white space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-rose-600" />
            <h3 className="text-sm font-bold text-slate-900">
              AI Defect Assistance & Yield Diagnostics
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated deep-learning bounding box detection with sub-micron defect area computation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Severity Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {['all', 'critical', 'major', 'minor'].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-2.5 py-1 rounded-lg capitalize transition ${
                  filterSeverity === sev
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowDefects(!showDefects)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              showDefects ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {showDefects ? 'Hide BBoxes' : 'Show BBoxes'}
          </button>
        </div>
      </div>

      {/* Defects List & Details Split */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Defects List */}
        <div className="md:col-span-6 space-y-2 max-h-80 overflow-y-auto pr-1">
          {filteredDefects.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100">
              <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
              <h4 className="text-xs font-bold text-slate-900">No Defects Identified</h4>
              <p className="text-[11px] text-slate-500 mt-1">Wafer sample passes Tier-1 yield standards.</p>
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
                      ? 'border-blue-500 bg-blue-50/60 shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-8 w-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                        def.severity === 'critical'
                          ? 'bg-rose-100 text-rose-700'
                          : def.severity === 'major'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      !
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{def.label}</h4>
                      <span className="text-[10px] text-slate-500">
                        Area: {def.areaUm2} μm² • Conf: {Math.round(def.confidence * 100)}%
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
                          : 'bg-blue-100 text-blue-700'
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

        {/* Selected Defect Detail Card */}
        <div className="md:col-span-6">
          {selectedDefect ? (
            <div className="glass-panel rounded-2xl p-5 border border-slate-200 bg-slate-50/50 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Selected Defect</span>
                  <h4 className="text-sm font-bold text-slate-900">{selectedDefect.label}</h4>
                </div>
                <span className="text-xs font-mono font-bold text-blue-600 bg-blue-100 px-2.5 py-1 rounded-lg">
                  {Math.round(selectedDefect.confidence * 100)}% AI Confidence
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{selectedDefect.description}</p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-medium block">Defect Category</span>
                  <span className="text-xs font-bold text-slate-900 capitalize">{selectedDefect.category}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-medium block">Calculated Area</span>
                  <span className="text-xs font-bold text-slate-900">{selectedDefect.areaUm2} μm²</span>
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
