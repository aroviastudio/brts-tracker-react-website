import React from 'react';
import { Bus, Clock, ArrowRight, RotateCw, ChevronRight } from 'lucide-react';
import { BRTS_STATIONS } from '../engine/data/sitilinkData.js';

const ROUTE_COLORS = {
  '15C':  { bg: 'bg-emerald-50',  border: 'border-emerald-300', badge: 'bg-emerald-600', text: 'text-emerald-700' },
  '15AC': { bg: 'bg-blue-50',     border: 'border-blue-300',    badge: 'bg-blue-600',    text: 'text-blue-700'    },
  '11':   { bg: 'bg-purple-50',   border: 'border-purple-300',  badge: 'bg-purple-600',  text: 'text-purple-700'  },
  '12':   { bg: 'bg-indigo-50',   border: 'border-indigo-300',  badge: 'bg-indigo-600',  text: 'text-indigo-700'  },
  '106':  { bg: 'bg-teal-50',     border: 'border-teal-300',    badge: 'bg-teal-600',    text: 'text-teal-700'    },
  '204':  { bg: 'bg-amber-50',    border: 'border-amber-300',   badge: 'bg-amber-600',   text: 'text-amber-700'   },
};

function getColors(routeNumber) {
  return ROUTE_COLORS[routeNumber] || {
    bg: 'bg-gray-50', border: 'border-gray-300', badge: 'bg-gray-600', text: 'text-gray-700'
  };
}

export function RouteOptionsList({ availableBuses, selectedBusId, onSelectBus, fromStop, toStop }) {
  if (!availableBuses || availableBuses.length === 0) return null;

  const fromName = BRTS_STATIONS[fromStop]?.shortName || fromStop;
  const toName = BRTS_STATIONS[toStop]?.shortName || toStop;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {availableBuses.length} route{availableBuses.length !== 1 ? 's' : ''} found
          </p>
          <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
            {fromName} <ArrowRight className="w-3 h-3" /> {toName}
          </p>
        </div>
        <span className="text-xs text-gray-400">Tap to see live</span>
      </div>

      <div className="divide-y divide-gray-100">
        {availableBuses.map((bus) => {
          const route = bus.routeOption;
          const routeNum = route?.routeNumber || bus.routeId;
          const colors = getColors(routeNum);
          const isSelected = bus.busId === selectedBusId;
          const isLoop = route?.type === 'CIRCULAR_LOOP';
          const currentStName = bus.currentStopId ? (BRTS_STATIONS[bus.currentStopId]?.shortName || 'En Route') : 'Waiting for live GPS...';
          const arriving = bus.arrivalMinutes !== '??' && bus.arrivalMinutes <= 3;
          const isWaiting = bus.arrivalMinutes === '??';

          return (
            <button
              key={bus.busId}
              onClick={() => onSelectBus(bus.busId)}
              className={`w-full text-left px-4 py-4 flex items-center gap-4 transition hover:bg-gray-50 active:bg-gray-100 ${
                isSelected ? 'bg-blue-50/60' : ''
              }`}
            >
              <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center shrink-0 ${colors.bg} border ${colors.border}`}>
                <Bus className={`w-5 h-5 ${colors.text} mb-0.5`} />
                <span className={`text-xs font-bold ${colors.text}`}>{routeNum}</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-900 text-sm">Bus {routeNum}</span>
                  {isLoop && (
                    <span className="flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                      <RotateCw className="w-3 h-3" /> Loop via Depot
                    </span>
                  )}
                  {arriving && (
                    <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5 animate-pulse">
                      Arriving!
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5 truncate">
                  <span className="text-gray-700 font-medium">{currentStName}</span>
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {route?.stopCount ? `${route.stopCount - 1} stops` : ''} · {route?.estimatedTravelMinutes || '—'} min journey
                </p>
              </div>

              <div className="shrink-0 flex flex-col items-end gap-1">
                <span className={`text-lg font-bold ${arriving ? 'text-green-600' : isWaiting ? 'text-blue-600 text-sm' : 'text-gray-800'}`}>
                  {isWaiting ? 'Tap to track' : `${bus.arrivalMinutes} min`}
                </span>
                {!isWaiting && (
                  <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                    <Clock className="w-3 h-3" />
                    to your stop
                  </span>
                )}
              </div>

              <ChevronRight className={`w-4 h-4 shrink-0 transition ${isSelected ? 'text-blue-500 rotate-90' : 'text-gray-300'}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
