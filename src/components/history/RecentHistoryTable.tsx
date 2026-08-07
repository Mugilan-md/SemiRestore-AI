import React, { useState } from 'react';
import { WaferSample } from '../../types/semicon';
import { backendApi } from '../../services/mockBackendApi';
import { Search, Eye, Trash2 } from 'lucide-react';

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
    <div className="moondust-glass rounded-3xl p-6 border border-[#CEB5FF] space-y-6 max-w-7xl mx-auto shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-poppins text-lg font-black text-slate-900">
            Wafer Cassette Inspection Logs & History
          </h2>
          <p className="text-xs text-slate-500 font-medium">
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
            className="w-full rounded-xl border border-[#CEB5FF] bg-white/80 py-1.5 pl-9 pr-3 text-xs text-slate-900 focus:border-[#80A8FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#80A8FF]/20"
          />
        </div>
      </div>

      {/* Table with Pure Gold Numbers */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-[#D3D3FF]/40 text-[11px] font-black text-slate-600 uppercase tracking-wider border-y border-[#CEB5FF]">
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
          <tbody className="divide-y divide-[#D3D3FF]/60">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-[#D3D3FF]/20 transition">
                <td className="py-3.5 px-4 font-bold text-slate-900">{s.title}</td>
                <td className="py-3.5 px-4">
                  <span className="rounded-md bg-[#D3D3FF]/80 px-2 py-0.5 text-[10px] font-bold text-[#80A8FF]">
                    {s.category}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-medium">{s.waferLot} • {s.foundry}</td>
                <td className="py-3.5 px-4 font-mono font-black text-gold-glitter">{s.metrics.psnr} dB</td>
                <td className="py-3.5 px-4 font-bold text-slate-900">{s.defects.length}</td>
                <td className="py-3.5 px-4 text-slate-500 font-medium">{s.timestamp}</td>
                <td className="py-3.5 px-4 text-right space-x-2">
                  <button
                    onClick={() => onSelectSample(s)}
                    className="p-1.5 rounded-lg bg-white border border-[#CEB5FF] text-[#80A8FF] hover:bg-[#D3D3FF]/40 transition shadow-2xs"
                    title="Open Workspace"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="p-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 transition shadow-2xs"
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
