/**
 * Central Transit Fusion Engine
 * Coordinates Ingestion, Filtering, Matching, Boarding Detection, Clustering, and ETA
 */
import { GpsValidator } from './gpsValidator.js';
import { MapMatcher } from './mapMatcher.js';
import { BoardingDetector, BOARDING_STATES } from './boardingDetector.js';
import { ClusterEngine } from './clusterEngine.js';
import { RouteEngine } from './routeEngine.js';
import { EtaEngine } from './etaEngine.js';
import { BRTS_ROUTES } from './data/sitilinkData.js';

export class TransitFusionEngine {
  constructor() {
    this.gpsValidator = new GpsValidator();
    this.clusterEngine = new ClusterEngine();
    this.boardingDetector = null;
    this.fromStopId = null;
    this.toStopId = null;
    this.candidateRoutes = [];
    this.currentCandidateScores = [];
    this.topRoute = null;
    this.activeBusCluster = null;
    this.upcomingEtas = [];
    this.crowdObservations = [];
  }

  /**
   * Set user journey intent
   */
  setJourney(fromStopId, toStopId) {
    this.fromStopId = fromStopId;
    this.toStopId = toStopId;
    this.boardingDetector = new BoardingDetector(fromStopId, toStopId);
    this.candidateRoutes = RouteEngine.findRoutes(fromStopId, toStopId);
    this.topRoute = this.candidateRoutes[0] || null;
    this.gpsValidator.reset();
  }

  /**
   * Ingest user's own live or simulated telemetry packet
   * @param {Object} rawPoint - { lat, lng, speed, heading, accuracy, timestamp }
   * @param {Array<Object>} peerObservations - Optional other crowd observations in area
   * @returns {Object} Complete inference state
   */
  ingestUserTelemetry(rawPoint, peerObservations = []) {
    const cleanGps = this.gpsValidator.process(rawPoint);
    if (!cleanGps) {
      return {
        isValid: false,
        reason: 'GPS telemetry discarded by noise filter'
      };
    }

    // 1. Map Match against candidate routes
    let primaryMatch = null;
    if (this.topRoute) {
      primaryMatch = MapMatcher.matchRoute([cleanGps.lat, cleanGps.lng], this.topRoute, cleanGps.heading);
    }

    // 2. Update Boarding Detector
    let boardingResult = { state: BOARDING_STATES.IDLE, shouldAutoStop: false };
    if (this.boardingDetector) {
      boardingResult = this.boardingDetector.update(cleanGps, primaryMatch);
    }

    // 3. Spatio-Temporal Clustering with other passengers
    const allObs = [
      {
        sessionId: 'CURRENT_USER',
        routeId: this.topRoute?.routeId || 'UNKNOWN',
        lat: cleanGps.lat,
        lng: cleanGps.lng,
        speedKmh: cleanGps.speedKmh,
        heading: cleanGps.heading,
        accuracy: cleanGps.accuracy,
        timestamp: cleanGps.timestamp
      },
      ...peerObservations
    ];

    const clusters = this.clusterEngine.processObservations(allObs);
    const userCluster = clusters.find(c => c.passengers.includes('CURRENT_USER')) || null;
    this.activeBusCluster = userCluster;

    // 4. Score all candidate routes
    const scores = this.candidateRoutes.map(route => {
      return RouteEngine.evaluateRouteConfidence({
        route,
        telemetry: cleanGps,
        boardingState: boardingResult.state,
        clusterBus: userCluster,
        fromStopId: this.fromStopId,
        toStopId: this.toStopId
      });
    });

    scores.sort((a, b) => b.totalScore - a.totalScore);
    this.currentCandidateScores = scores;

    if (scores.length > 0 && scores[0].isViable) {
      this.topRoute = BRTS_ROUTES[scores[0].routeId];
    }

    // 5. Calculate ETAs for upcoming stops
    let etas = [];
    if (this.topRoute) {
      const match = primaryMatch || MapMatcher.matchRoute([cleanGps.lat, cleanGps.lng], this.topRoute, cleanGps.heading);
      const segIndex = match ? match.segmentIndex : 0;
      etas = EtaEngine.calculateUpcomingStopEtas(
        this.topRoute,
        {
          lat: userCluster?.lat || cleanGps.lat,
          lng: userCluster?.lng || cleanGps.lng,
          speedKmh: userCluster?.speedKmh || cleanGps.speedKmh
        },
        segIndex
      );
    }
    this.upcomingEtas = etas;

    return {
      isValid: true,
      cleanGps,
      primaryMatch,
      boardingState: boardingResult.state,
      shouldAutoStop: boardingResult.shouldAutoStop,
      autoStopReason: boardingResult.reason,
      activeBusCluster: userCluster,
      allClusters: clusters,
      candidateScores: scores,
      topRoute: this.topRoute,
      upcomingEtas: etas
    };
  }
}
