import React, { useState } from 'react';
import { WaferSample } from '../../types/semicon';
import { backendApi } from '../../services/mockBackendApi';
import { Search, Filter, Cpu, Trash2, Eye, Download, CheckCircle2 } from 'lucide-react';

interface RecentHistoryTableProps {
  onSelectSample: (sample: WaferSample) => void;
}

export const RecentHistoryTable: React.FC<RecentHistoryTableProps> = ({ onSelectSample }) => {
  const [samples, setSamples] = useState<WaferSample[]>(backendApi.getSamples());
  const [search, setSearch] = useState('');

  const handleDelete = (id: string) => {
    backendApi.deleteSample(id);
    setSamples(backendApi.getSamples());
  };

  const filtered = samples.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.waferLot.toLowerCase().includes(search.toLowerCase()) ||
      s.foundry.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="glass-panel rounded-3xl p-6 border border-slate-200 bg-white space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-poppins text-lg font-bold text-slate-900">
            Wafer Cassette Inspection Logs & History
          </h2>
          <p className="text-xs text-slate-500">
            Archived Metrology analysis records and Restormer AI restoration outputs.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Filter by lot, foundry, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-1.5 pl-9 pr-3 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-y border-slate-200">
            <tr>
              <th className="py-3 px-4">Wafer Sample</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Lot & Foundry</th>
              <th className="py-3 px-4">PSNR Gain</th>
              <th className="py-3 px-4">Defects</th>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-blue-50/40 transition">
                <td className="py-3.5 px-4 font-bold text-slate-900">{s.title}</td>
                <td className="py-3.5 px-4">
                  <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                    {s.category}
                  </span>
                </td>
                <td className="py-3.5 px-4">{s.waferLot} • {s.foundry}</td>
                <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{s.metrics.psnr} dB</td>
                <td className="py-3.5 px-4 font-bold text-slate-900">{s.defects.length}</td>
                <td className="py-3.5 px-4 text-slate-400">{s.timestamp}</td>
                <td className="py-3.5 px-4 text-right space-x-2">
                  <button
                    onClick={() => onSelectSample(s)}
                    className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                    title="Open Workspace"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                    title="Delete Record"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
