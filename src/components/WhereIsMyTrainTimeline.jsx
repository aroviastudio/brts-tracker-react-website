import React from 'react';
import { Bus, Clock, Gauge, Users, CheckCircle2 } from 'lucide-react';
import { BRTS_STATIONS } from '../engine/data/sitilinkData.js';
import { BOARDING_STATES } from '../engine/boardingDetector.js';

export function WhereIsMyTrainTimeline({
  route,
  boardingState,
  activeBusCluster,
  upcomingEtas = [],
  telemetry,
  candidateScores
}) {
  if (!route || !route.stopSequence) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
        <Bus className="w-12 h-12 mx-auto mb-3 text-slate-600 animate-pulse" />
        <p className="text-base font-medium text-slate-300">Select FROM & TO stations to track your BRTS bus</p>
        <p className="text-xs text-slate-500 mt-1">Our transit engine will automatically identify the route & live bus</p>
      </div>
    );
  }

  const speedKmh = activeBusCluster?.speedKmh ?? Math.round(telemetry?.speedKmh || 0);
  const passengerCount = activeBusCluster?.passengerCount || (telemetry ? 1 : 0);
  const confidenceScore = candidateScores?.[0]?.totalScore || 75;
  const nextStop = upcomingEtas?.[0];

  const getBoardingBadge = () => {
    switch (boardingState) {
      case BOARDING_STATES.AT_ORIGIN_STATION:
        return { label: 'Waiting at Platform', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case BOARDING_STATES.BOARDING_DETECTED:
        return { label: 'Boarding Detected', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
      case BOARDING_STATES.IN_TRANSIT:
        return { label: 'In Transit on Corridor', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case BOARDING_STATES.APPROACHING_DESTINATION:
        return { label: 'Arriving at Destination', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
      case BOARDING_STATES.ALIGHTED:
        return { label: 'Alighted from Bus', color: 'bg-slate-700 text-slate-300 border-slate-600' };
      case BOARDING_STATES.AUTO_STOPPED:
        return { label: 'Privacy Geofence: Auto-Stopped', color: 'bg-red-500/20 text-red-300 border-red-500/30' };
      default:
        return { label: 'Ready to Track', color: 'bg-slate-800 text-slate-400 border-slate-700' };
    }
  };

  const badge = getBoardingBadge();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Banner with Route & Bus info */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 p-5 border-b border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="font-black text-sm px-2.5 py-0.5 rounded-lg shadow text-white"
                style={{ backgroundColor: route.color || '#059669' }}
              >
                {route.routeNumber}
              </span>
              <h3 className="font-bold text-white text-base">{route.name}</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              Series: <span className="font-mono text-emerald-400 font-medium">{route.seriesCode || 'BRTS'}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-xs px-3 py-1 rounded-full border font-medium ${badge.color}`}>
              {badge.label}
            </span>
          </div>
        </div>

        {/* Live Telemetry Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3">
            <div className="text-xs text-slate-400 flex items-center gap-1 mb-1">
              <Gauge className="w-3.5 h-3.5 text-emerald-400" />
              Live Speed
            </div>
            <div className="text-xl font-black text-white">{speedKmh} <span className="text-xs font-normal text-slate-400">km/h</span></div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3">
            <div className="text-xs text-slate-400 flex items-center gap-1 mb-1">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              Crowd Fusion
            </div>
            <div className="text-sm font-bold text-white flex items-center gap-1">
              {passengerCount >= 3 ? '👥 3+ Users' : passengerCount === 2 ? '👥 2 Users' : '👤 1 User'}
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3">
            <div className="text-xs text-slate-400 flex items-center gap-1 mb-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Next Station ETA
            </div>
            <div className="text-base font-bold text-white">
              {nextStop ? `${nextStop.etaMinutes} min` : 'At Terminus'}
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3">
            <div className="text-xs text-slate-400 flex items-center gap-1 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Confidence
            </div>
            <div className="text-base font-bold text-emerald-400">
              {confidenceScore}%
            </div>
          </div>
        </div>
      </div>

      {/* Iconic "Where Is My Train" Vertical Progression Line */}
      <div className="p-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center justify-between">
          <span>Corridor Stations Progression</span>
          <span>Predicted Arrival / Distance</span>
        </div>

        <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-1 before:bg-gradient-to-b before:from-emerald-500 before:via-emerald-600 before:to-slate-700">
          {route.stopSequence.map((stopId, _idx) => {
            const station = BRTS_STATIONS[stopId] || { name: stopId, shortName: stopId, code: 'STN', platformCount: 2, corridors: [] };
            const etaInfo = upcomingEtas?.find((e) => e.stopId === stopId);
            const isPassed = !etaInfo && upcomingEtas && upcomingEtas.length > 0;
            const isNext = nextStop?.stopId === stopId;

            return (
              <div key={`${stopId}-${_idx}`} className="relative flex items-center justify-between group">
                {/* Vertical Node Indicator */}
                <div
                  className={`absolute -left-6 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${
                    isNext
                      ? 'bg-emerald-500 border-white ring-4 ring-emerald-500/30 scale-125'
                      : isPassed
                      ? 'bg-slate-700 border-slate-500'
                      : 'bg-slate-900 border-emerald-400'
                  }`}
                >
                  {isNext && <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>}
                </div>

                {/* Station Details */}
                <div className="pl-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${isNext ? 'text-emerald-400 font-bold' : isPassed ? 'text-slate-500' : 'text-slate-200'}`}>
                      {station.name}
                    </span>
                    <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
                      Plat {station.platformCount || 2}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    Code: {station.code} {station.corridors?.length ? `• ${station.corridors.join(', ')}` : ''}
                  </div>
                </div>

                {/* ETA / Status */}
                <div className="text-right">
                  {isNext ? (
                    <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-lg border border-emerald-500/30 text-xs font-bold animate-pulse">
                      <Bus className="w-3.5 h-3.5" />
                      Arriving in {etaInfo?.etaMinutes || 1}m
                    </div>
                  ) : etaInfo ? (
                    <div>
                      <span className="text-xs font-bold text-slate-300">{etaInfo.etaTimestamp}</span>
                      <div className="text-[11px] text-slate-500">{etaInfo.distanceMeters}m away</div>
                    </div>
                  ) : isPassed ? (
                    <span className="text-xs text-slate-500 flex items-center gap-1 justify-end">
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" /> Passed
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500">Scheduled</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
