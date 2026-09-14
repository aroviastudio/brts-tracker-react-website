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
import { liveBackend } from './services/liveBackendService.js';

const VIEW = {
  SEARCH: 'SEARCH',
  ROUTES: 'ROUTES',
  TIMELINE: 'TIMELINE',
};

export default function App() {
  const [view, setView] = useState(VIEW.SEARCH);
  const [fromStop, setFromStop] = useState('ST_AASPASS');
  const [toStop, setToStop] = useState('ST_SOMESHWAR');
  const [availableBuses, setAvailableBuses] = useState([]);
  const [selectedBusId, setSelectedBusId] = useState(null);
  const [inferenceResult, setInferenceResult] = useState(null);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [livePeers, setLivePeers] = useState([]);

  const engineRef = useRef(new TransitFusionEngine());
  const geoRef = useRef(new GeolocationService());
  const peersRef = useRef({}); // Store recent peer telemetry

  const selectedBus = availableBuses.find(b => b.busId === selectedBusId) || null;

  const handleSearch = () => {
    if (!fromStop || !toStop) return;
    const buses = RouteEngine.getAvailableBusesForJourney(fromStop, toStop, INITIAL_BUS_FLEET);
    setAvailableBuses(buses);
    setSelectedBusId(buses[0]?.busId || null);

    if (engineRef.current) {
      engineRef.current.setJourney(fromStop, toStop);
    }
    setView(VIEW.ROUTES);
  };

  const handleSelectBus = (busId) => {
    setSelectedBusId(busId);
    const bus = availableBuses.find(b => b.busId === busId);
    if (bus) listenToLiveCloud(bus);
    setView(VIEW.TIMELINE);
  };

  // Listen for real cloud updates from other commuters
  const listenToLiveCloud = (bus) => {
    if (!bus?.routeId) return;
    liveBackend.subscribeToRoute(bus.routeId, (peerTelemetry) => {
      // Update peer buffer
      peersRef.current[peerTelemetry.sessionId] = peerTelemetry;
      const peersArray = Object.values(peersRef.current);
      setLivePeers(peersArray);

      if (!isBroadcasting && engineRef.current) {
        // If we are just watching, use the most recent peer as the "anchor"
        const result = engineRef.current.ingestUserTelemetry(peerTelemetry, peersArray);
        setInferenceResult(result);
      }
    });
  };

  // Share own live location
  const toggleBroadcast = () => {
    if (isBroadcasting) {
      geoRef.current?.stopTracking();
      setIsBroadcasting(false);
    } else {
      setIsBroadcasting(true);
      geoRef.current?.startTracking((telemetry) => {
        if (!engineRef.current || !selectedBus?.routeId) return;
        
        const peersArray = Object.values(peersRef.current);
        const result = engineRef.current.ingestUserTelemetry(telemetry, peersArray);
        setInferenceResult(result);
        
        // Push our live location to Supabase for others to see!
        liveBackend.broadcastTelemetry(selectedBus.routeId, telemetry);
      });
    }
  };

  useEffect(() => {
    return () => {
      geoRef.current?.stopTracking();
      liveBackend.stopListening();
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
          {view === VIEW.SEARCH && (
            <JourneySearch
              fromStop={fromStop}
              toStop={toStop}
              setFromStop={setFromStop}
              setToStop={setToStop}
              onSearch={handleSearch}
            />
          )}

          {view === VIEW.ROUTES && (
            <>
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

          {view === VIEW.TIMELINE && selectedBus && (
            <>
              <StopTimeline
                bus={selectedBusForTimeline}
                fromStop={fromStop}
                toStop={toStop}
                onBack={() => setView(VIEW.ROUTES)}
              />
              
              {/* Broadcast Action Bar */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                <div>
                  <h4 className="text-sm font-bold text-blue-900">Are you on this bus?</h4>
                  <p className="text-xs text-blue-700 mt-0.5">Share live location to help others</p>
                  <p className="text-[10px] text-blue-500 mt-1 font-medium">{livePeers.length} commuters sharing right now</p>
                </div>
                <button
                  onClick={toggleBroadcast}
                  className={`px-4 py-2 text-sm font-bold rounded-xl transition shadow-sm ${
                    isBroadcasting 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isBroadcasting ? 'Stop Sharing' : 'Share Live GPS'}
                </button>
              </div>

              <LiveMap
                route={selectedBus?.routeOption}
                activeBusCluster={inferenceResult?.activeBusCluster}
              />

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

        <footer className="py-4 text-center text-xs text-gray-400 border-t border-gray-200 bg-white">
          Where Is My BRTS · Surat Sitilink · Zero Login · 100% Privacy
        </footer>

        <PrivacyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      </div>
    </ErrorBoundary>
  );
}
