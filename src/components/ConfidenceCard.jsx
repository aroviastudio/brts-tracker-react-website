import React from 'react';
import { ShieldCheck, Activity, Compass, Milestone, Users, Zap } from 'lucide-react';

export function ConfidenceCard({ candidateScores, activeBusCluster }) {
  const topCandidate = candidateScores?.[0];
  if (!topCandidate) return null;

  const { totalScore, breakdown } = topCandidate;

  const signals = [
    { label: 'Journey Sequence Match', pts: breakdown.journeyMatch, max: 30, icon: Milestone, desc: 'FROM and TO served in sequential order' },
    { label: 'Boarding State Match', pts: breakdown.boardingMatch, max: 15, icon: Zap, desc: 'Station dwell followed by corridor acceleration' },
    { label: 'Corridor Proximity', pts: breakdown.corridorMatch, max: 20, icon: Activity, desc: 'GPS snapped within dedicated BRTS lane (< 25m)' },
    { label: 'Heading / Direction Vector', pts: breakdown.directionMatch, max: 10, icon: Compass, desc: 'Alignment with route corridor heading' },
    { label: 'Stop Progression Order', pts: breakdown.stopSequenceMatch, max: 10, icon: Milestone, desc: 'Passing stops in ascending index order' },
    { label: 'Passenger Clustering', pts: breakdown.clusterMatch, max: 10, icon: Users, desc: `${activeBusCluster?.passengerCount || 1} passenger(s) moving in sync` }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white text-base flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          Multi-Signal Confidence Inspector
        </h3>
        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          Total: {totalScore}% Score
        </span>
      </div>

      <p className="text-xs text-slate-400 mb-4">
        Real-time multi-signal mathematical breakdown proving how the engine inferred the bus route without manual input:
      </p>

      <div className="space-y-3">
        {signals.map((sig, idx) => {
          const Icon = sig.icon;
          const pct = Math.round((sig.pts / sig.max) * 100);
          return (
            <div key={idx} className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-slate-200 flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-slate-400" />
                  {sig.label}
                </span>
                <span className="font-mono text-emerald-400 font-semibold">
                  +{sig.pts} / {sig.max} pts
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-500 mt-1">{sig.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
