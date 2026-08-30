import React from 'react';
import { Play, Pause, RotateCcw, Sliders } from 'lucide-react';
import { SIMULATION_SCENARIOS } from '../services/simulationService.js';

export function SimulationControls({
  activeScenarioId,
  onSelectScenario,
  isRunning,
  isPaused,
  onPlay,
  onPause,
  onResume,
  onReset,
  speedMultiplier,
  setSpeedMultiplier,
  progress
}) {
  return (
    <div className="bg-slate-900 border border-blue-900/50 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-white text-sm flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-400" />
          Crowdsourced Simulation Sandbox
        </h3>
        <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
          Interactive Test Bench
        </span>
      </div>

      {/* Scenario Selector */}
      <div className="space-y-2 mb-4">
        {SIMULATION_SCENARIOS.map((sc) => (
          <button
            key={sc.id}
            onClick={() => onSelectScenario(sc.id)}
            className={`w-full text-left p-3 rounded-xl border transition cursor-pointer ${
              activeScenarioId === sc.id
                ? 'bg-blue-950/60 border-blue-500/60 text-white shadow-lg shadow-blue-500/10'
                : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="text-xs font-bold flex items-center justify-between">
              <span>{sc.title}</span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-slate-400">
                {sc.routeId}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">{sc.description}</div>
          </button>
        ))}
      </div>

      {/* Playback Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span>Simulation Progress</span>
          <span className="font-mono">{Math.round(progress || 0)}%</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
          <div
            className="bg-blue-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${progress || 0}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
        <div className="flex items-center gap-2">
          {!isRunning ? (
            <button
              onClick={onPlay}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-2 rounded-xl font-semibold transition cursor-pointer shadow"
            >
              <Play className="w-3.5 h-3.5" />
              Start Simulation
            </button>
          ) : isPaused ? (
            <button
              onClick={onResume}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2 rounded-xl font-semibold transition cursor-pointer shadow"
            >
              <Play className="w-3.5 h-3.5" />
              Resume
            </button>
          ) : (
            <button
              onClick={onPause}
              className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs px-4 py-2 rounded-xl font-semibold transition cursor-pointer shadow"
            >
              <Pause className="w-3.5 h-3.5" />
              Pause
            </button>
          )}

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-2 rounded-xl border border-slate-700 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>

        {/* Speed Multiplexer */}
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
          {[1, 2, 5, 10].map((spd) => (
            <button
              key={spd}
              onClick={() => setSpeedMultiplier(spd)}
              className={`text-xs px-2 py-1 rounded-lg font-mono font-semibold transition ${
                speedMultiplier === spd
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
