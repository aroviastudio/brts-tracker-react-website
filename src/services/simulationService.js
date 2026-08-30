/**
 * Crowdsourced Simulation Service
 * High-speed, instant-start multi-passenger telemetry tracks
 */
import { BRTS_STATIONS, BRTS_ROUTES } from '../engine/data/sitilinkData.js';
import { interpolateCoord, haversineDistance, calculateBearing } from '../engine/geoUtils.js';

export const SIMULATION_SCENARIOS = [
  {
    id: 'SCENARIO_15AC_DIRECT',
    title: '⚡ 15AC Direct Bus (Coming from Dindoli)',
    subtitle: 'Aaspass Dada Temple ➔ Someshwar Junction',
    fromStop: 'ST_AASPASS',
    toStop: 'ST_SOMESHWAR',
    routeId: '15AC',
    passengerCount: 4,
    description: 'Bus 15AC is approaching Aaspass Temple from Dindoli and heads directly to Someshwar. (Fastest direct option).'
  },
  {
    id: 'SCENARIO_15C_LOOP',
    title: '🔄 15C Loop Bus (Via Althan Depot)',
    subtitle: 'Parvat Patiya ➔ Someshwar (via Althan Depot Loop)',
    fromStop: 'ST_PARVAT',
    toStop: 'ST_SOMESHWAR',
    routeId: '15C',
    passengerCount: 2,
    description: 'Bus 15C is currently at Parvat Patiya heading toward Althan Depot, completes the circular loop, then arrives at Someshwar.'
  },
  {
    id: 'SCENARIO_15C_CLUSTER',
    title: '👥 3-Passenger Cluster (Route 15C)',
    subtitle: 'Kharwar Nagar ➔ Someshwar Junction',
    fromStop: 'ST_KHARWAR',
    toStop: 'ST_SOMESHWAR',
    routeId: '15C',
    passengerCount: 3,
    description: 'Simulates 3 distinct passengers travelling inside the same 15C bus. Demonstrates cluster merging and 96% confidence.'
  },
  {
    id: 'SCENARIO_DIVERGENCE_12_VS_15C',
    title: '🔀 Route Divergence (12 vs 15C at Kharwar)',
    subtitle: 'Althan Depot ➔ Surat Station (Route 12)',
    fromStop: 'ST_ALTHAN',
    toStop: 'ST_SURAT_STATION',
    routeId: '12',
    passengerCount: 3,
    description: 'Buses share the corridor until Kharwar Nagar, then Route 12 branches toward Udhna Darwaja.'
  }
];

export class SimulationRunner {
  constructor(scenarioId, onTick, onComplete) {
    this.scenario = SIMULATION_SCENARIOS.find((s) => s.id === scenarioId) || SIMULATION_SCENARIOS[0];
    this.onTick = onTick;
    this.onComplete = onComplete;
    this.isRunning = false;
    this.isPaused = false;
    this.intervalId = null;
    this.speedMultiplier = 2; // Default 2x for quick responsive animation
    this.stepIndex = 0;
    this.totalSteps = 0;
    this.trackPoints = [];
    
    this.buildTrack();
  }

  buildTrack() {
    const route = BRTS_ROUTES[this.scenario.routeId];
    if (!route) return;

    const seq = route.stopSequence;
    const fromIdx = seq.indexOf(this.scenario.fromStop);
    const toIdx = seq.indexOf(this.scenario.toStop);

    let stops = [];
    if (fromIdx !== -1 && toIdx !== -1) {
      if (fromIdx < toIdx) {
        stops = seq.slice(fromIdx, toIdx + 1);
      } else {
        // Wrap around circular route
        stops = [...seq.slice(fromIdx), ...seq.slice(1, toIdx + 1)];
      }
    } else {
      stops = seq;
    }

    const points = [];
    for (let i = 0; i < stops.length - 1; i++) {
      const s1 = BRTS_STATIONS[stops[i]];
      const s2 = BRTS_STATIONS[stops[i + 1]];
      if (!s1 || !s2) continue;

      const dist = haversineDistance([s1.lat, s1.lng], [s2.lat, s2.lng]);
      const stepsBetween = Math.max(8, Math.round(dist / 50)); // ~50m per step

      for (let step = 0; step < stepsBetween; step++) {
        const frac = step / stepsBetween;
        const coord = interpolateCoord([s1.lat, s1.lng], [s2.lat, s2.lng], frac);
        const heading = calculateBearing([s1.lat, s1.lng], [s2.lat, s2.lng]);
        
        const isNearStation = frac < 0.15 || frac > 0.85;
        const speedKmh = isNearStation ? 18 : 34;

        points.push({
          lat: coord[0],
          lng: coord[1],
          heading,
          speedKmh,
          currentStopId: stops[i],
          nextStopId: stops[i + 1]
        });
      }
    }

    const lastStation = BRTS_STATIONS[stops[stops.length - 1]];
    if (lastStation) {
      points.push({
        lat: lastStation.lat,
        lng: lastStation.lng,
        heading: 0,
        speedKmh: 0,
        currentStopId: stops[stops.length - 1],
        nextStopId: null
      });
    }

    this.trackPoints = points;
    this.totalSteps = points.length;
  }

  start() {
    this.isRunning = true;
    this.isPaused = false;
    this.stepIndex = 0;
    
    // Emit immediate first tick instantly (0ms delay)
    this.emitCurrentTick();
    this.runLoop();
  }

  emitCurrentTick() {
    if (this.stepIndex >= this.totalSteps) {
      this.stop();
      this.onComplete?.();
      return;
    }

    const p = this.trackPoints[this.stepIndex];
    if (!p) return;

    const now = Date.now();

    const userTelemetry = {
      sessionId: 'SIM_USER_MAIN',
      lat: p.lat,
      lng: p.lng,
      speed: (p.speedKmh * 1000) / 3600,
      speedKmh: p.speedKmh,
      heading: p.heading,
      accuracy: 5,
      timestamp: now
    };

    const peerObservations = [];
    for (let i = 1; i < this.scenario.passengerCount; i++) {
      const jitterLat = (Math.random() - 0.5) * 0.00006;
      const jitterLng = (Math.random() - 0.5) * 0.00006;
      peerObservations.push({
        sessionId: `SIM_PEER_0${i}`,
        routeId: this.scenario.routeId,
        lat: p.lat + jitterLat,
        lng: p.lng + jitterLng,
        speedKmh: p.speedKmh + (Math.random() - 0.5) * 2,
        heading: p.heading,
        accuracy: 5,
        timestamp: now
      });
    }

    this.onTick?.({
      userTelemetry,
      peerObservations,
      progress: (this.stepIndex / Math.max(1, this.totalSteps)) * 100,
      currentStep: this.stepIndex,
      totalSteps: this.totalSteps,
      scenario: this.scenario
    });
  }

  setSpeed(multiplier) {
    this.speedMultiplier = multiplier;
    if (this.isRunning && !this.isPaused) {
      clearInterval(this.intervalId);
      this.runLoop();
    }
  }

  pause() {
    this.isPaused = true;
    clearInterval(this.intervalId);
  }

  resume() {
    this.isPaused = false;
    this.runLoop();
  }

  stop() {
    this.isRunning = false;
    this.isPaused = false;
    clearInterval(this.intervalId);
    this.stepIndex = 0;
  }

  runLoop() {
    // 150ms tick rate adjusted by speed multiplier for buttery smooth 60fps-like updates
    const tickIntervalMs = Math.max(50, Math.round(300 / this.speedMultiplier));
    
    this.intervalId = setInterval(() => {
      this.stepIndex++;
      this.emitCurrentTick();
    }, tickIntervalMs);
  }
}
