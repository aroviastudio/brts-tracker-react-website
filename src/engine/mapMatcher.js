/**
 * BRTS Corridor Map-Matching Engine
 */
import { projectPointOnSegment, calculateBearing, bearingDifference, haversineDistance } from './geoUtils.js';
import { BRTS_STATIONS } from './data/sitilinkData.js';

export class MapMatcher {
  /**
   * Match a GPS coordinate against a specific route's corridor
   * @param {[number, number]} point - [lat, lng]
   * @param {Object} route - Route definition with stopSequence
   * @param {number} userHeading - GPS heading in degrees
   * @returns {Object} Matching results
   */
  static matchRoute(point, route, userHeading = null) {
    const seq = route?.stopSequence || BRTS_ROUTES[route?.routeId]?.stopSequence;
    if (!seq || seq.length < 2) {
      return null;
    }

    let minDistance = Infinity;
    let bestSegmentIndex = 0;
    let bestProjectedPoint = null;
    let segmentBearing = 0;

    for (let i = 0; i < seq.length - 1; i++) {
      const stopA = BRTS_STATIONS[seq[i]];
      const stopB = BRTS_STATIONS[seq[i + 1]];
      if (!stopA || !stopB) continue;

      const proj = projectPointOnSegment(point, [stopA.lat, stopA.lng], [stopB.lat, stopB.lng]);

      if (proj.distanceMeters < minDistance) {
        minDistance = proj.distanceMeters;
        bestSegmentIndex = i;
        bestProjectedPoint = proj.point;
        segmentBearing = calculateBearing([stopA.lat, stopA.lng], [stopB.lat, stopB.lng]);
      }
    }

    let headingMatch = true;
    let headingDiff = 0;
    if (userHeading !== null && !isNaN(userHeading)) {
      headingDiff = bearingDifference(userHeading, segmentBearing);
      // In bus corridor, heading diff > 85 deg means opposite direction
      headingMatch = headingDiff <= 85;
    }

    const isOnCorridor = minDistance <= 40; // BRTS dedicated lanes are within 40m
    const isNearby = minDistance <= 90;

    return {
      distanceMeters: minDistance,
      isOnCorridor,
      isNearby,
      segmentIndex: bestSegmentIndex,
      fromStopId: seq[bestSegmentIndex],
      toStopId: seq[bestSegmentIndex + 1],
      projectedPoint: bestProjectedPoint,
      corridorBearing: segmentBearing,
      headingDiff,
      headingMatch
    };
  }

  /**
   * Find nearest BRTS station to coordinate
   */
  static findNearestStation(point) {
    let nearest = null;
    let minDistance = Infinity;

    for (const stationId in BRTS_STATIONS) {
      const st = BRTS_STATIONS[stationId];
      const d = haversineDistance(point, [st.lat, st.lng]);
      if (d < minDistance) {
        minDistance = d;
        nearest = { ...st, distanceMeters: d };
      }
    }

    return nearest;
  }
}
