/**
 * Real-time ETA and Stop Arrival Prediction Engine
 */
import { BRTS_STATIONS } from './data/sitilinkData.js';
import { haversineDistance } from './geoUtils.js';

export class EtaEngine {
  /**
   * Calculate ETAs for upcoming stops along the route
   * @param {Object} route
   * @param {Object} busPosition - { lat, lng, speedKmh }
   * @param {number} currentSegmentIndex
   * @returns {Array<Object>} ETA list for upcoming stops
   */
  static calculateUpcomingStopEtas(route, busPosition, currentSegmentIndex = 0) {
    if (!route || !busPosition) return [];

    const results = [];
    const avgSpeedKmh = Math.max(18, Math.min(45, busPosition.speedKmh || route.averageSpeedKmh || 28));
    const speedMps = (avgSpeedKmh * 1000) / 3600;
    const dwellSec = route.stationDwellSec || 25;

    let cumulativeSec = 0;
    let previousCoord = [busPosition.lat, busPosition.lng];

    const seq = route.stopSequence || BRTS_ROUTES[route.routeId]?.stopSequence || [];
    for (let i = currentSegmentIndex; i < seq.length; i++) {
      const stopId = seq[i];
      const station = BRTS_STATIONS[stopId];
      if (!station) continue;

      const distM = haversineDistance(previousCoord, [station.lat, station.lng]);
      const transitSec = distM / speedMps;
      
      cumulativeSec += transitSec + (i > currentSegmentIndex ? dwellSec : 0);
      previousCoord = [station.lat, station.lng];

      const etaDate = new Date(Date.now() + cumulativeSec * 1000);
      const minutesRemaining = Math.max(1, Math.round(cumulativeSec / 60));

      results.push({
        stopId,
        name: station.name,
        shortName: station.shortName,
        distanceMeters: Math.round(distM),
        etaMinutes: minutesRemaining,
        etaTimestamp: etaDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isPassed: false
      });
    }

    return results;
  }
}
