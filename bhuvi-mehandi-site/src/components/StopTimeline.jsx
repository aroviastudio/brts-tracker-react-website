import React from 'react';
import { ArrowLeft, Bus, MapPin, Clock } from 'lucide-react';
import { BRTS_STATIONS } from '../engine/data/sitilinkData.js';

export function StopTimeline({ bus, fromStop, toStop, onBack }) {
  if (!bus) return null;

  const route = bus.routeOption;
  const stops = route?.intermediateStops || [];
  const routeNum = route?.routeNumber || bus.routeId;

  const busCurrentIdx = bus.currentStopId ? stops.indexOf(bus.currentStopId) : -1;
  const destIdx = stops.indexOf(toStop);

  const fromName = BRTS_STATIONS[fromStop]?.shortName || fromStop;
  const toName   = BRTS_STATIONS[toStop]?.shortName   || toStop;

  const ROUTE_BADGE_COLORS = {
    '15C':  'bg-emerald-600',
    '15AC': 'bg-blue-600',
    '11':   'bg-purple-600',
    '12':   'bg-indigo-600',
    '106':  'bg-teal-600',
    '204':  'bg-amber-600',
  };
  const badgeColor = ROUTE_BADGE_COLORS[routeNum] || 'bg-gray-600';
  
  const isWaiting = !bus.currentStopId;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className={`${badgeColor} text-white text-xs font-bold px-2.5 py-1 rounded-lg shrink-0`}>
              Bus {routeNum}
            </span>
            <p className="text-sm font-semibold text-gray-800 truncate">
              {fromName} → {toName}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-sm font-bold text-gray-900">{isWaiting ? '--' : bus.arrivalMinutes} {isWaiting ? '' : 'min'}</p>
            <p className="text-[10px] text-gray-400">to your stop</p>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Bus className="w-3 h-3" />
            <span className={`font-medium ml-0.5 ${isWaiting ? 'text-blue-500 animate-pulse' : 'text-gray-800'}`}>
              {isWaiting ? 'Connecting to live bus...' : `Now at ${BRTS_STATIONS[bus.currentStopId]?.shortName || 'En Route'}`}
            </span>
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {route?.estimatedTravelMinutes || '—'} min journey
          </span>
        </div>
      </div>

      <div className="px-4 py-3">
        {stops.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No stop data available</p>
        ) : (
          <div className="space-y-0 relative">
            {isWaiting && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center pointer-events-none">
                 {/* Optional: subtle overlay while waiting for data */}
              </div>
            )}
            {stops.map((stopId, idx) => {
              const station = BRTS_STATIONS[stopId];
              const name = station?.shortName || stopId;
              const isBusHere  = idx === busCurrentIdx;
              const isOrigin   = stopId === fromStop;
              const isDest     = stopId === toStop;
              const isPassed   = !isWaiting && idx < busCurrentIdx;
              const isFuture   = isWaiting || idx > busCurrentIdx;

              const stopsFromBus = idx - busCurrentIdx;
              const etaMins = (!isWaiting && stopsFromBus > 0)
                ? Math.round(stopsFromBus * 3)
                : null;

              return (
                <div key={stopId} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-0.5 h-3 ${idx === 0 ? 'bg-transparent' : isPassed ? 'bg-gray-300' : isBusHere ? 'bg-blue-400' : 'bg-gray-200'}`} />
                    {isBusHere ? (
                      <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center bus-pulse shrink-0">
                        <Bus className="w-3.5 h-3.5 text-white" />
                      </div>
                    ) : isDest ? (
                      <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                        <MapPin className="w-3 h-3 text-white" />
                      </div>
                    ) : (
                      <div className={`w-3 h-3 rounded-full border-2 shrink-0 ${
                        isPassed
                          ? 'bg-gray-300 border-gray-300'
                          : isOrigin
                          ? 'bg-green-500 border-green-500'
                          : 'bg-white border-gray-300'
                      }`} />
                    )}
                    <div className={`w-0.5 flex-1 min-h-[20px] ${
                      idx === stops.length - 1 ? 'bg-transparent'
                      : isPassed ? 'bg-gray-300'
                      : isBusHere ? 'bg-blue-200'
                      : 'bg-gray-200'
                    }`} />
                  </div>

                  <div className={`flex-1 flex items-center justify-between py-2 ${
                    isDest ? 'bg-blue-50 -mx-1 px-1 rounded-xl' : ''
                  }`}>
                    <div>
                      <p className={`text-sm leading-tight ${
                        isBusHere ? 'font-bold text-blue-700'
                        : isDest    ? 'font-semibold text-blue-800'
                        : isPassed  ? 'text-gray-400'
                        : isOrigin  ? 'font-semibold text-green-700'
                        : 'text-gray-700'
                      }`}>
                        {name}
                        {isDest && <span className="ml-1.5 text-[10px] font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-full">YOUR STOP</span>}
                        {isOrigin && !isDest && <span className="ml-1.5 text-[10px] font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full">BOARDING</span>}
                      </p>
                      {isBusHere && (
                        <p className="text-[11px] text-blue-500 font-medium mt-0.5">🚌 Bus is here now</p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      {isBusHere && (
                        <span className="text-xs font-bold text-blue-600 animate-pulse">Now</span>
                      )}
                      {isFuture && etaMins !== null && (
                        <span className={`text-xs font-semibold ${isDest ? 'text-blue-700' : 'text-gray-500'}`}>
                          ~{etaMins} min
                        </span>
                      )}
                      {isPassed && !isBusHere && (
                        <span className="text-xs text-gray-300">passed</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
