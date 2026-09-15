import React from 'react';
import { ArrowUpDown, MapPin, Navigation, Search } from 'lucide-react';
import { BRTS_STATIONS } from '../engine/data/sitilinkData.js';

const QUICK_ROUTES = [
  { label: 'Althan → Someshwar', from: 'ST_ALTHAN', to: 'ST_SOMESHWAR' },
  { label: 'Aaspass → Someshwar', from: 'ST_AASPASS', to: 'ST_SOMESHWAR' },
  { label: 'Udhna → Sachin GIDC', from: 'ST_UDHNA_DARWAJA', to: 'ST_SACHIN_GIDC' },
  { label: 'Surat Stn → Dumas', from: 'ST_SURAT_STATION', to: 'ST_DUMAS_RESORT' },
  { label: 'Surat Stn → Sarthana', from: 'ST_SURAT_STATION', to: 'ST_SARTHANA' },
];

const stations = Object.values(BRTS_STATIONS);

export function JourneySearch({ fromStop, toStop, setFromStop, setToStop, onSearch }) {
  const handleSwap = () => {
    const tmp = fromStop;
    setFromStop(toStop);
    setToStop(tmp);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
      {/* Station pickers */}
      <div className="flex items-stretch gap-2">
        {/* Left: FROM / TO stacked */}
        <div className="flex-1 flex flex-col gap-2">
          {/* FROM */}
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 hover:border-blue-400 transition">
            <Navigation className="w-4 h-4 text-green-500 shrink-0" />
            <select
              value={fromStop}
              onChange={e => setFromStop(e.target.value)}
              className="flex-1 bg-transparent text-sm font-medium text-gray-800 outline-none cursor-pointer appearance-none"
            >
              <option value="">From — pick a station</option>
              {stations.map(s => (
                <option key={s.id} value={s.id} disabled={s.id === toStop}>{s.shortName}</option>
              ))}
            </select>
          </div>

          {/* TO */}
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 hover:border-blue-400 transition">
            <MapPin className="w-4 h-4 text-red-500 shrink-0" />
            <select
              value={toStop}
              onChange={e => setToStop(e.target.value)}
              className="flex-1 bg-transparent text-sm font-medium text-gray-800 outline-none cursor-pointer appearance-none"
            >
              <option value="">To — pick a station</option>
              {stations.map(s => (
                <option key={s.id} value={s.id} disabled={s.id === fromStop}>{s.shortName}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap button */}
        <button
          onClick={handleSwap}
          className="self-center p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 hover:bg-blue-100 transition active:scale-95"
          title="Swap stations"
        >
          <ArrowUpDown className="w-4 h-4" />
        </button>
      </div>

      {/* Search button */}
      <button
        onClick={onSearch}
        disabled={!fromStop || !toStop}
        className={`mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition active:scale-95 ${
          fromStop && toStop
            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        <Search className="w-4 h-4" />
        Show Routes
      </button>

      {/* Quick route chips */}
      <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-1.5">
        <span className="text-[11px] text-gray-400 font-medium self-center mr-1">Quick:</span>
        {QUICK_ROUTES.map((r, i) => (
          <button
            key={i}
            onClick={() => { setFromStop(r.from); setToStop(r.to); }}
            className="text-[11px] px-2.5 py-1 rounded-full bg-gray-100 hover:bg-blue-50 hover:text-blue-700 text-gray-600 border border-gray-200 hover:border-blue-200 transition"
          >
            {r.label}
          </button>
        ))}
      </div>
    </div>
  );
}
