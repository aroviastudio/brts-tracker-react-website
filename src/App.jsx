import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar.jsx';
import { JourneySearch } from './components/JourneySearch.jsx';
import { BusOptionsList } from './components/BusOptionsList.jsx';
import { WhereIsMyTrainTimeline } from './components/WhereIsMyTrainTimeline.jsx';
import { LiveMap } from './components/LiveMap.jsx';
import { ConfidenceCard } from './components/ConfidenceCard.jsx';
import { SimulationControls } from './components/SimulationControls.jsx';
import { PrivacyModal } from './components/PrivacyModal.jsx';
import { StationListModal } from './components/StationListModal.jsx';
import { TransitFusionEngine } from './engine/transitFusionEngine.js';
import { RouteEngine } from './engine/routeEngine.js';
import { BRTS_STATIONS, BRTS_ROUTES, INITIAL_BUS_FLEET } from './engine/data/sitilinkData.js';
import { GeolocationService } from './services/geolocationService.js';
import { SimulationRunner, SIMULATION_SCENARIOS } from './services/simulationService.js';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

export default function App() {
  // App Modes: 'LIVE' or 'SIM'
  const [mode, setMode] = useState('SIM');
  
  // Journey state (Default: Aaspass -> Someshwar)
  const [fromStop, setFromStop] = useState('ST_AASPASS');
  const [toStop, setToStop] = useState('ST_SOMESHWAR');
  
  // Available buses & selected bus
  const [availableBuses, setAvailableBuses] = useState([]);
  const [selectedBusId, setSelectedBusId] = useState(null);

  // Engine & Inference state
  const [inferenceResult, setInferenceResult] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [trackingError, setTrackingError] = useState(null);
  const [autoStopNotice, setAutoStopNotice] = useState(null);

  // Simulation controls state
  const [activeScenarioId, setActiveScenarioId] = useState('SCENARIO_15AC_DIRECT');
  const [simProgress, setSimProgress] = useState(0);
  const [simRunning, setSimRunning] = useState(false);
  const [simPaused, setSimPaused] = useState(false);
  const [simSpeedMultiplier, setSimSpeedMultiplier] = useState(2);

  // Modals
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [stationsModalOpen, setStationsModalOpen] = useState(false);

  // Refs for engine and runners
  const engineRef = useRef(new TransitFusionEngine());
  const geoServiceRef = useRef(new GeolocationService());
  const simRunnerRef = useRef(null);

  // Update available buses when fromStop or toStop changes
  useEffect(() => {
    if (fromStop && toStop) {
      const buses = RouteEngine.getAvailableBusesForJourney(fromStop, toStop, INITIAL_BUS_FLEET);
      setAvailableBuses(buses);
      if (buses.length > 0) {
        setSelectedBusId(buses[0].busId);
        const topRouteId = buses[0].routeOption?.routeId || buses[0].routeId;
        if (engineRef.current) {
          engineRef.current.setJourney(fromStop, toStop);
          if (BRTS_ROUTES[topRouteId]) {
            engineRef.current.topRoute = BRTS_ROUTES[topRouteId];
          }
        }
      }
    }
  }, [fromStop, toStop]);

  // Initialize engine on mount
  useEffect(() => {
    if (!engineRef.current) {
      engineRef.current = new TransitFusionEngine();
    }
    if (!geoServiceRef.current) {
      geoServiceRef.current = new GeolocationService();
    }

    engineRef.current.setJourney(fromStop, toStop);
    const initialStation = BRTS_STATIONS[fromStop] || { lat: 21.1895, lng: 72.8648 };
    
    const initialEval = engineRef.current.ingestUserTelemetry({
      lat: initialStation.lat,
      lng: initialStation.lng,
      speed: 0.5,
      accuracy: 6,
      heading: 45,
      timestamp: Date.now()
    });
    setInferenceResult(initialEval);

    const buses = RouteEngine.getAvailableBusesForJourney(fromStop, toStop, INITIAL_BUS_FLEET);
    setAvailableBuses(buses);
    if (buses.length > 0) {
      setSelectedBusId(buses[0].busId);
      const topRouteId = buses[0].routeOption?.routeId || buses[0].routeId;
      if (BRTS_ROUTES[topRouteId]) {
        engineRef.current.topRoute = BRTS_ROUTES[topRouteId];
      }
    }

    return () => {
      geoServiceRef.current?.stopTracking();
      simRunnerRef.current?.stop();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle Search / Journey Selection
  const handleSearch = () => {
    if (!fromStop || !toStop) return;

    engineRef.current?.setJourney(fromStop, toStop);
    setAutoStopNotice(null);
    setTrackingError(null);

    const buses = RouteEngine.getAvailableBusesForJourney(fromStop, toStop, INITIAL_BUS_FLEET);
    setAvailableBuses(buses);
    if (buses.length > 0) {
      setSelectedBusId(buses[0].busId);
    }

    if (mode === 'LIVE') {
      startLiveTracking();
    } else {
      handlePlaySimulation();
    }
  };

  // Handle manual selection of a specific bus card
  const handleSelectBus = (bus) => {
    setSelectedBusId(bus.busId);
    const route = BRTS_ROUTES[bus.routeOption?.routeId || bus.routeId];
    if (route && engineRef.current) {
      engineRef.current.topRoute = route;
      const st = BRTS_STATIONS[bus.currentStopId] || BRTS_STATIONS[fromStop];
      const result = engineRef.current.ingestUserTelemetry({
        lat: st.lat,
        lng: st.lng,
        speed: (bus.speedKmh * 1000) / 3600,
        speedKmh: bus.speedKmh,
        heading: bus.heading,
        accuracy: 5,
        timestamp: Date.now()
      });
      setInferenceResult(result);
    }
  };

  // Live Geolocation Tracking
  const startLiveTracking = () => {
    simRunnerRef.current?.stop();
    setSimRunning(false);

    const success = geoServiceRef.current?.startTracking(
      (telemetry) => {
        if (!engineRef.current) return;
        const result = engineRef.current.ingestUserTelemetry(telemetry);
        setInferenceResult(result);
        setIsTracking(true);

        if (result?.shouldAutoStop) {
          geoServiceRef.current?.stopTracking();
          setIsTracking(false);
          setAutoStopNotice(result.autoStopReason || 'Left BRTS station premises. GPS auto-stopped for privacy.');
        }
      },
      (err) => {
        setTrackingError(err.message || 'Unable to retrieve location.');
        setIsTracking(false);
      }
    );

    if (success) {
      setIsTracking(true);
    }
  };

  // Simulation Handlers (Instant Start)
  const handleSelectScenario = (scenarioId) => {
    setActiveScenarioId(scenarioId);
    simRunnerRef.current?.stop();
    setSimRunning(false);
    setSimPaused(false);
    setSimProgress(0);

    const sc = SIMULATION_SCENARIOS.find((s) => s.id === scenarioId);
    if (sc) {
      setFromStop(sc.fromStop);
      setToStop(sc.toStop);
      engineRef.current?.setJourney(sc.fromStop, sc.toStop);
      if (BRTS_ROUTES[sc.routeId]) {
        engineRef.current.topRoute = BRTS_ROUTES[sc.routeId];
      }
    }
  };

  const handlePlaySimulation = () => {
    if (geoServiceRef.current?.isTracking) {
      geoServiceRef.current.stopTracking();
    }

    if (simRunnerRef.current) {
      simRunnerRef.current.stop();
    }

    engineRef.current?.setJourney(fromStop, toStop);

    const runner = new SimulationRunner(
      activeScenarioId,
      ({ userTelemetry, peerObservations, progress }) => {
        if (!engineRef.current) return;
        const result = engineRef.current.ingestUserTelemetry(userTelemetry, peerObservations);
        setInferenceResult(result);
        setSimProgress(progress);

        if (result?.shouldAutoStop) {
          runner.stop();
          setSimRunning(false);
          setAutoStopNotice(result.autoStopReason);
        }
      },
      () => {
        setSimRunning(false);
        setSimPaused(false);
      }
    );

    runner.setSpeed(simSpeedMultiplier);
    simRunnerRef.current = runner;
    runner.start(); // Starts instantly on tick 0
    setSimRunning(true);
    setSimPaused(false);
    setIsTracking(true);
  };

  const handlePauseSimulation = () => {
    simRunnerRef.current?.pause();
    setSimPaused(true);
  };

  const handleResumeSimulation = () => {
    simRunnerRef.current?.resume();
    setSimPaused(false);
  };

  const handleResetSimulation = () => {
    simRunnerRef.current?.stop();
    setSimRunning(false);
    setSimPaused(false);
    setSimProgress(0);
    setIsTracking(false);
  };

  const handleSpeedChange = (spd) => {
    setSimSpeedMultiplier(spd);
    simRunnerRef.current?.setSpeed(spd);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header Navigation */}
      <Navbar
        mode={mode}
        setMode={(newMode) => {
          setMode(newMode);
          if (newMode === 'LIVE') {
            simRunnerRef.current?.stop();
            setSimRunning(false);
          }
        }}
        onOpenPrivacy={() => setPrivacyModalOpen(true)}
        onOpenStations={() => setStationsModalOpen(true)}
      />

      {/* Main Content Body */}
      <main className="max-w-7xl w-full mx-auto px-4 py-6 flex-1 space-y-6">
        {/* Privacy Notice Banner if Auto-Stopped */}
        {autoStopNotice && (
          <div className="bg-emerald-950/70 border border-emerald-500/50 rounded-2xl p-4 flex items-start gap-3 shadow-lg">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-emerald-400 text-sm">🔒 Privacy Geofence Lock Activated</h4>
              <p className="text-xs text-slate-300 mt-0.5">{autoStopNotice}</p>
            </div>
          </div>
        )}

        {/* Tracking Error Alert */}
        {trackingError && (
          <div className="bg-red-950/70 border border-red-500/50 rounded-2xl p-4 flex items-start gap-3 shadow-lg">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <div className="text-xs text-red-200">{trackingError}</div>
          </div>
        )}

        {/* Top Section: Journey Search & Simulation Controller */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <JourneySearch
              fromStop={fromStop}
              toStop={toStop}
              setFromStop={setFromStop}
              setToStop={setToStop}
              onSearch={handleSearch}
              isTracking={isTracking}
            />
          </div>

          <div>
            {mode === 'SIM' ? (
              <SimulationControls
                activeScenarioId={activeScenarioId}
                onSelectScenario={handleSelectScenario}
                isRunning={simRunning}
                isPaused={simPaused}
                onPlay={handlePlaySimulation}
                onPause={handlePauseSimulation}
                onResume={handleResumeSimulation}
                onReset={handleResetSimulation}
                speedMultiplier={simSpeedMultiplier}
                setSpeedMultiplier={handleSpeedChange}
                progress={simProgress}
              />
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl h-full flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-white text-base flex items-center gap-2 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    Live Device Geolocation
                  </h3>
                  <p className="text-xs text-slate-400">
                    Reads high-accuracy GPS directly from your device browser. Automatic corridor snapping and boarding detection are active.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
                  <span>Status: {isTracking ? '🟢 Tracking Active' : '⚪ Standby'}</span>
                  <button
                    onClick={isTracking ? () => geoServiceRef.current?.stopTracking() : startLiveTracking}
                    className={`px-4 py-2 rounded-xl font-semibold transition cursor-pointer ${
                      isTracking ? 'bg-red-600/80 text-white' : 'bg-emerald-600 text-white hover:bg-emerald-500'
                    }`}
                  >
                    {isTracking ? 'Stop Tracking' : 'Start Live GPS'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Multi-Bus Options List (Shows all candidate buses for this journey) */}
        <BusOptionsList
          availableBuses={availableBuses}
          selectedBusId={selectedBusId}
          onSelectBus={handleSelectBus}
          fromStop={fromStop}
          toStop={toStop}
        />

        {/* Center Section: Where Is My Train Timeline + Interactive Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WhereIsMyTrainTimeline
            route={inferenceResult?.topRoute}
            boardingState={inferenceResult?.boardingState}
            activeBusCluster={inferenceResult?.activeBusCluster}
            upcomingEtas={inferenceResult?.upcomingEtas}
            telemetry={inferenceResult?.cleanGps}
            candidateScores={inferenceResult?.candidateScores}
          />

          <div className="space-y-6">
            <LiveMap
              route={inferenceResult?.topRoute}
              telemetry={inferenceResult?.cleanGps}
              activeBusCluster={inferenceResult?.activeBusCluster}
              allClusters={inferenceResult?.allClusters}
            />

            <ConfidenceCard
              candidateScores={inferenceResult?.candidateScores}
              activeBusCluster={inferenceResult?.activeBusCluster}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        <p>Where Is My BRTS • Built with Transit Data Fusion Logic for Surat Sitilink BRTS Network</p>
        <p className="mt-1 text-[11px] text-slate-600">Zero Authentication • 100% Privacy by Design • Ephemeral Sessions Only</p>
      </footer>

      {/* Modals */}
      <PrivacyModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
      />

      <StationListModal
        isOpen={stationsModalOpen}
        onClose={() => setStationsModalOpen(false)}
        onSelectStation={(stId) => {
          if (!fromStop) setFromStop(stId);
          else if (!toStop) setToStop(stId);
        }}
      />
    </div>
  );
}
