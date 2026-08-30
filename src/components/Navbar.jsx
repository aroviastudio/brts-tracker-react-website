import React from 'react';
import { Bus, ShieldCheck, PlayCircle, Radio } from 'lucide-react';

export function Navbar({ mode, setMode, onOpenPrivacy, onOpenStations }) {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 text-white p-2 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center">
            <Bus className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg leading-tight tracking-tight text-white">Where Is My BRTS</h1>
              <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded-full font-medium border border-emerald-500/30">
                Surat Sitilink
              </span>
            </div>
            <p className="text-xs text-slate-400">Crowdsourced Transit Fusion Tracker</p>
          </div>
        </div>

        {/* Privacy Pill */}
        <button
          onClick={onOpenPrivacy}
          className="flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-600/40 text-emerald-400 hover:bg-emerald-900/40 text-xs px-3 py-1.5 rounded-full transition cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-medium">100% Anonymous • Zero Login • Auto-Stops</span>
        </button>

        {/* Actions & Mode Switch */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenStations}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition"
          >
            All Stations
          </button>

          <div className="bg-slate-800 p-1 rounded-xl flex items-center border border-slate-700">
            <button
              onClick={() => setMode('LIVE')}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                mode === 'LIVE'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              Live Device GPS
            </button>
            <button
              onClick={() => setMode('SIM')}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                mode === 'SIM'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <PlayCircle className="w-3.5 h-3.5" />
              Simulation Sandbox
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
