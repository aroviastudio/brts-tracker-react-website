import React from 'react';
import { ArrowUpDown, Search, MapPin, Navigation } from 'lucide-react';
import { BRTS_STATIONS } from '../engine/data/sitilinkData.js';

export function JourneySearch({ fromStop, toStop, setFromStop, setToStop, onSearch, isTracking }) {
  const stationList = Object.values(BRTS_STATIONS);

  const handleSwap = () => {
    const temp = fromStop;
    setFromStop(toStop);
    setToStop(temp);
  };

  const quickPicks = [
    { label: 'Aaspass ➔ Someshwar (15C / 15AC)', from: 'ST_AASPASS', to: 'ST_SOMESHWAR' },
    { label: 'Althan ➔ Someshwar (15C Loop)', from: 'ST_ALTHAN', to: 'ST_SOMESHWAR' },
    { label: 'Udhna ➔ Sachin GIDC (11)', from: 'ST_UDHNA_DARWAJA', to: 'ST_SACHIN_GIDC' },
    { label: 'Surat Station ➔ Dumas Resort (106 EV)', from: 'ST_SURAT_STATION', to: 'ST_DUMAS_RESORT' },
    { label: 'Surat Station ➔ Sarthana Zoo (12)', from: 'ST_SURAT_STATION', to: 'ST_SARTHANA' },
    { label: 'Kharwar ➔ Someshwar (15C)', from: 'ST_KHARWAR', to: 'ST_SOMESHWAR' }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-white text-base flex items-center gap-2">
          <Navigation className="w-4 h-4 text-emerald-400" />
          Where Do You Want To Go?
        </h2>
        <span className="text-xs text-emerald-400 font-medium">Surat Sitilink Network</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-3 items-center">
        {/* FROM Stop */}
        <div className="relative">
          <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-emerald-400" />
            FROM (Starting BRTS Station)
          </label>
          <select
            value={fromStop}
            onChange={(e) => setFromStop(e.target.value)}
            className="w-full bg-slate-800 text-white text-sm font-medium border border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
          >
            <option value="">-- Select Origin Station --</option>
            {stationList.map((st) => (
              <option key={st.id} value={st.id} disabled={st.id === toStop}>
                {st.name} ({st.code})
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center md:pt-5">
          <button
            type="button"
            onClick={handleSwap}
            title="Swap Stations"
            className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition shadow cursor-pointer active:scale-95"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>

        {/* TO Stop */}
        <div className="relative">
          <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-red-400" />
            TO (Destination BRTS Station)
          </label>
          <select
            value={toStop}
            onChange={(e) => setToStop(e.target.value)}
            className="w-full bg-slate-800 text-white text-sm font-medium border border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
          >
            <option value="">-- Select Destination Station --</option>
            {stationList.map((st) => (
              <option key={st.id} value={st.id} disabled={st.id === fromStop}>
                {st.name} ({st.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Corridors */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 font-medium">Quick Routes:</span>
        {quickPicks.map((pick, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setFromStop(pick.from);
              setToStop(pick.to);
            }}
            className="text-xs bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg transition cursor-pointer"
          >
            {pick.label}
          </button>
        ))}
      </div>

      {/* Action Button */}
      <div className="mt-4 pt-4 border-t border-slate-800 flex justify-end">
        <button
          type="button"
          onClick={onSearch}
          disabled={!fromStop || !toStop}
          className={`flex items-center justify-center gap-2 w-full md:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm transition shadow-lg ${
            !fromStop || !toStop
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 cursor-pointer active:scale-95'
          }`}
        >
          <Search className="w-4 h-4" />
          {isTracking ? 'Refresh Active Journey' : 'Find Buses & Track Live'}
        </button>
      </div>
    </div>
  );
}
