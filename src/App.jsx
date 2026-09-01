import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar.jsx';
import { JourneySearch } from './components/JourneySearch.jsx';
import { RouteOptionsList } from './components/RouteOptionsList.jsx';
import { StopTimeline } from './components/StopTimeline.jsx';
import { LiveMap } from './components/LiveMap.jsx';
import { PrivacyModal } from './components/PrivacyModal.jsx';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { RouteEngine } from './engine/routeEngine.js';
import { TransitFusionEngine } from './engine/transitFusionEngine.js';
import { BRTS_STATIONS, INITIAL_BUS_FLEET } from './engine/data/sitilinkData.js';
import { GeolocationService } from './services/geolocationService.js';
import { SimulationRunner } from './services/simulationService.js';

// App view states
const VIEW = {
  SEARCH: 'SEARCH',      // Show journey picker
  ROUTES: 'ROUTES',      // Show route options list (Google Maps style)
  TIMELINE: 'TIMELINE',  // Show stop timeline for selected bus
};

export default function App() {
  const [view, setView] = useState(VIEW.SEARCH);
  const [fromStop, setFromStop] = useState('ST_AASPASS');
  const [toStop, setToStop] = useState('ST_SOMESHWAR');
  const [availableBuses, setAvailableBuses] = useState([]);
  const [selectedBusId, setSelectedBusId] = useState(null);
  const [inferenceResult, setInferenceResult] = useState(null);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [isLive, setIsLive] = useState(false);

  const engineRef    = useRef(new TransitFusionEngine());
  const geoRef       = useRef(new GeolocationService());
  const simRunnerRef = useRef(null);

  // Derived: the currently selected bus object
  const selectedBus = availableBuses.find(b => b.busId === selectedBusId) || null;

  // Search: compute available buses and go to ROUTES view
  const handleSearch = () => {
    if (!fromStop || !toStop) return;
    const buses = RouteEngine.getAvailableBusesForJourney(fromStop, toStop, INITIAL_BUS_FLEET);
    setAvailableBuses(buses);
    setSelectedBusId(buses[0]?.busId || null);

    // Set up engine
    if (engineRef.current) {
      engineRef.current.setJourney(fromStop, toStop);
    }

    // Auto-start simulation for the first matching bus
    if (buses.length > 0) {
      startSim(buses[0]);
    }

    setView(VIEW.ROUTES);
  };

  // When user taps a route card → go to timeline
  const handleSelectBus = (busId) => {
    setSelectedBusId(busId);
    const bus = availableBuses.find(b => b.busId === busId);
    if (bus) startSim(bus);
    setView(VIEW.TIMELINE);
  };

  // Start a lightweight simulation for the selected bus
  const startSim = (bus) => {
    simRunnerRef.current?.stop();

    const scenarioId = bus?.routeId === '15C'  ? 'SCENARIO_15C_DIRECT'
                     : bus?.routeId === '15AC' ? 'SCENARIO_15AC_DIRECT'
                     : 'SCENARIO_15AC_DIRECT';

    try {
      const runner = new SimulationRunner(
        scenarioId,
        ({ userTelemetry, peerObservations }) => {
          if (!engineRef.current) return;
          const result = engineRef.current.ingestUserTelemetry(userTelemetry, peerObservations);
          setInferenceResult(result);
        },
        () => {}
      );
      runner.setSpeed(3);
      simRunnerRef.current = runner;
      runner.start();
    } catch {
      // simulation not available for this scenario — silently skip
    }
  };

  // Start live GPS
  const handleStartLive = () => {
    if (!fromStop || !toStop) return;
    setIsLive(true);
    geoRef.current?.startTracking?.((telemetry) => {
      if (!engineRef.current) return;
      const result = engineRef.current.ingestUserTelemetry(telemetry);
      setInferenceResult(result);
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      geoRef.current?.stopTracking?.();
      simRunnerRef.current?.stop();
    };
  }, []);

  const selectedBusForTimeline = selectedBus
    ? { ...selectedBus, currentStopId: inferenceResult?.activeBusCluster?.currentStopId || selectedBus.currentStopId }
    : null;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar onOpenPrivacy={() => setPrivacyOpen(true)} />

        <main className="max-w-2xl w-full mx-auto px-3 py-4 flex-1 flex flex-col gap-3">

          {/* ── SEARCH VIEW ── */}
          {view === VIEW.SEARCH && (
            <JourneySearch
              fromStop={fromStop}
              toStop={toStop}
              setFromStop={setFromStop}
              setToStop={setToStop}
              onSearch={handleSearch}
            />
          )}

          {/* ── ROUTES VIEW: List of route options ── */}
          {view === VIEW.ROUTES && (
            <>
              {/* Re-search bar (collapsed) */}
              <button
                onClick={() => setView(VIEW.SEARCH)}
                className="w-full text-left bg-white rounded-2xl shadow-sm border border-gray-200 px-4 py-3 flex items-center justify-between"
              >
                <div className="text-sm text-gray-700">
                  <span className="font-semibold text-gray-900">{BRTS_STATIONS[fromStop]?.shortName}</span>
                  <span className="text-gray-400 mx-2">→</span>
                  <span className="font-semibold text-gray-900">{BRTS_STATIONS[toStop]?.shortName}</span>
                </div>
                <span className="text-xs text-blue-600 font-medium">Change</span>
              </button>

              <RouteOptionsList
                availableBuses={availableBuses}
                selectedBusId={selectedBusId}
                onSelectBus={handleSelectBus}
                fromStop={fromStop}
                toStop={toStop}
              />

              {/* No routes found */}
              {availableBuses.length === 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                  <p className="text-3xl mb-2">🚌</p>
                  <p className="text-sm font-semibold text-gray-700">No routes found</p>
                  <p className="text-xs text-gray-400 mt-1">Try swapping the stations or pick a different journey</p>
                  <button
                    onClick={() => setView(VIEW.SEARCH)}
                    className="mt-4 px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </>
          )}

          {/* ── TIMELINE VIEW: Stop-by-stop for selected bus ── */}
          {view === VIEW.TIMELINE && selectedBus && (
            <>
              <StopTimeline
                bus={selectedBusForTimeline}
                fromStop={fromStop}
                toStop={toStop}
                onBack={() => setView(VIEW.ROUTES)}
              />

              {/* Live Map below timeline */}
              <LiveMap
                route={selectedBus?.routeOption}
                activeBusCluster={inferenceResult?.activeBusCluster}
              />

              {/* Other routes (quick switch) */}
              {availableBuses.length > 1 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                  <p className="text-xs font-semibold text-gray-500 mb-2">Other available buses</p>
                  <div className="flex flex-wrap gap-2">
                    {availableBuses
                      .filter(b => b.busId !== selectedBusId)
                      .map(b => (
                        <button
                          key={b.busId}
                          onClick={() => handleSelectBus(b.busId)}
                          className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-700 transition"
                        >
                          🚌 Bus {b.routeOption?.routeNumber || b.routeId}
                          <span className="font-semibold">{b.arrivalMinutes} min</span>
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </>
          )}

        </main>

        {/* Footer */}
        <footer className="py-4 text-center text-xs text-gray-400 border-t border-gray-200 bg-white">
          Where Is My BRTS · Surat Sitilink · Zero Login · 100% Privacy
        </footer>

        <PrivacyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      </div>
    </ErrorBoundary>
  );
}
