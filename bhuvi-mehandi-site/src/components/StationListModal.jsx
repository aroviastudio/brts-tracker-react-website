import React, { useState } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { BRTS_STATIONS } from '../engine/data/sitilinkData.js';

export function StationListModal({ isOpen, onClose, onSelectStation }) {
  const [query, setQuery] = useState('');
  if (!isOpen) return null;

  const list = Object.values(BRTS_STATIONS).filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.code.toLowerCase().includes(query.toLowerCase()) ||
      s.corridors.some((c) => c.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative max-h-[85vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="font-bold text-white text-lg mb-1">Surat Sitilink BRTS Stations</h3>
        <p className="text-xs text-slate-400 mb-4">Official station codes, platform counts & corridor mappings</p>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by station name or code (e.g. Althan, PRV-05)..."
            className="w-full bg-slate-800 text-white text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Stations List */}
        <div className="overflow-y-auto space-y-2 flex-1 pr-1">
          {list.map((st) => (
            <div
              key={st.id}
              onClick={() => {
                onSelectStation?.(st.id);
                onClose();
              }}
              className="p-3 bg-slate-800/60 hover:bg-slate-800 rounded-xl border border-slate-700/60 flex items-center justify-between transition cursor-pointer"
            >
              <div>
                <div className="font-semibold text-xs text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  {st.name}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Corridors: {st.corridors.join(', ')}
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-[11px] font-bold bg-slate-700 text-slate-200 px-2 py-0.5 rounded">
                  {st.code}
                </span>
                <div className="text-[10px] text-slate-500 mt-1">{st.platformCount} Platforms</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
