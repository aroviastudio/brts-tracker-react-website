import React from 'react';
import { Bus, Clock, MapPin, Sparkles, Users, CheckCircle2 } from 'lucide-react';
import { BRTS_STATIONS } from '../engine/data/sitilinkData.js';

export function BusOptionsList({
  availableBuses = [],
  selectedBusId,
  onSelectBus,
  fromStop,
  toStop
}) {
  if (availableBuses.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
        <Bus className="w-10 h-10 mx-auto mb-2 text-slate-600" />
        <p className="text-sm font-semibold text-slate-300">No active routes found between these stops</p>
        <p className="text-xs text-slate-500 mt-1">Please select different starting and destination stations.</p>
      </div>
    );
  }

  const fromName = BRTS_STATIONS[fromStop]?.shortName || 'Origin';
  const toName = BRTS_STATIONS[toStop]?.shortName || 'Destination';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Bus className="w-5 h-5 text-emerald-400" />
            Available Buses & Live Options
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Traveling from <span className="text-emerald-400 font-semibold">{fromName}</span> ➔ <span className="text-blue-400 font-semibold">{toName}</span>
          </p>
        </div>
        <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700">
          {availableBuses.length} Bus{availableBuses.length > 1 ? 'es' : ''} Available
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {availableBuses.map((bus) => {
          const isSelected = selectedBusId === bus.busId;
          const isDirect = bus.routeOption?.type === 'DIRECT';

          return (
            <div
              key={bus.busId}
              onClick={() => onSelectBus?.(bus)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-br from-emerald-950/70 to-slate-900 border-emerald-500 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/30'
                  : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80 text-slate-300'
              }`}
            >
              {/* Highlight ribbon for recommended */}
              {bus.isRecommended && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-bl-xl flex items-center gap-1 shadow">
                  <Sparkles className="w-3 h-3" /> Fastest Direct
                </div>
              )}

              {/* Route Number & Title */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm text-white shadow"
                    style={{ backgroundColor: bus.routeOption?.color || '#059669' }}
                  >
                    {bus.routeOption?.routeNumber || 'BRTS'}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                      {bus.busNumber}
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </h4>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {bus.direction}
                    </span>
                  </div>
                </div>
              </div>

              {/* Live Location & ETA Status Banner */}
              <div className="bg-slate-900/80 rounded-xl p-2.5 border border-slate-700/60 space-y-1.5 mb-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    Current Location:
                  </span>
                  <span className="font-semibold text-white truncate max-w-[170px]">
                    {bus.currentStationName}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    Arrival at your stop:
                  </span>
                  <span className="font-bold text-emerald-400">
                    {bus.arrivalMinutes} min{bus.arrivalMinutes > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Footer Meta: Passengers & Journey Type */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1 text-slate-300">
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  {bus.passengerCount} passengers on board
                </span>

                <span className={`px-2 py-0.5 rounded font-medium ${
                  isDirect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300'
                }`}>
                  {bus.routeOption?.typeLabel}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
