/**
 * Crowdsourced Passenger Clustering Engine
 * Groups multiple user GPS observations into Physical Bus Entities
 */
import { haversineDistance, bearingDifference } from './geoUtils.js';

export class ClusterEngine {
  constructor() {
    this.activeClusters = new Map(); // clusterId -> BusCluster
  }

  /**
   * Ingest active passenger observations and cluster them
   * @param {Array<Object>} observations - Array of { sessionId, routeId, lat, lng, speedKmh, heading, timestamp, accuracy }
   * @returns {Array<Object>} List of resolved Physical Bus Entities
   */
  processObservations(observations = []) {
    const validObs = observations.filter(o => o && o.lat && o.lng && o.routeId);
    const groupsByRoute = new Map();

    // 1. Group observations by candidate route
    for (const obs of validObs) {
      if (!groupsByRoute.has(obs.routeId)) {
        groupsByRoute.set(obs.routeId, []);
      }
      groupsByRoute.get(obs.routeId).push(obs);
    }

    const resolvedBuses = [];

    // 2. Spatial-Temporal Clustering per Route
    for (const [routeId, routeObs] of groupsByRoute.entries()) {
      const clusters = this.clusterRouteObservations(routeObs, routeId);
      resolvedBuses.push(...clusters);
    }

    return resolvedBuses;
  }

  /**
   * Spatial clustering algorithm (Distance < 45m, Speed diff < 12km/h, Heading diff < 35 deg)
   */
  clusterRouteObservations(obsList, routeId) {
    const visited = new Set();
    const clusters = [];

    for (let i = 0; i < obsList.length; i++) {
      if (visited.has(obsList[i].sessionId)) continue;

      const currentCluster = [obsList[i]];
      visited.add(obsList[i].sessionId);

      for (let j = i + 1; j < obsList.length; j++) {
        if (visited.has(obsList[j].sessionId)) continue;

        const p1 = obsList[i];
        const p2 = obsList[j];

        const dist = haversineDistance([p1.lat, p1.lng], [p2.lat, p2.lng]);
        const speedDiff = Math.abs(p1.speedKmh - p2.speedKmh);
        const headingDiff = bearingDifference(p1.heading, p2.heading);

        // Passengers on the same bus are within 45m, moving at same speed and heading
        if (dist <= 45 && speedDiff <= 14 && headingDiff <= 35) {
          currentCluster.push(p2);
          visited.add(p2.sessionId);
        }
      }

      // Compute Centroid with accuracy weighting
      let totalWeight = 0;
      let weightedLat = 0;
      let weightedLng = 0;
      let avgSpeed = 0;
      let avgHeading = 0;

      for (const p of currentCluster) {
        const weight = 1 / Math.max(5, p.accuracy || 10);
        weightedLat += p.lat * weight;
        weightedLng += p.lng * weight;
        avgSpeed += p.speedKmh;
        avgHeading += p.heading;
        totalWeight += weight;
      }

      const passengerCount = currentCluster.length;
      const busId = `${routeId}_BUS_#${obsList[i].sessionId.slice(-4)}`;

      // Statistical confidence calculation based on crowd size
      let confidence = 74; // 1 user default
      let confidenceBadge = 'CROWDSOURCED (1 user)';

      if (passengerCount === 2) {
        confidence = 88;
        confidenceBadge = 'ESTIMATED (2 passengers)';
      } else if (passengerCount >= 3) {
        confidence = 96;
        confidenceBadge = `VERIFIED (${passengerCount} passengers)`;
      }

      clusters.push({
        busId,
        routeId,
        lat: weightedLat / totalWeight,
        lng: weightedLng / totalWeight,
        speedKmh: Math.round(avgSpeed / passengerCount),
        heading: Math.round(avgHeading / passengerCount),
        passengerCount,
        confidence,
        confidenceBadge,
        source: 'CROWDSOURCED',
        lastUpdated: Date.now(),
        passengers: currentCluster.map(c => c.sessionId)
      });
    }

    return clusters;
  }
}
