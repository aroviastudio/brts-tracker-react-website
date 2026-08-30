/**
 * GPS Sanity Filter and Noise Cleaner
 */
import { haversineDistance, calculateBearing } from './geoUtils.js';

const MAX_ACCURACY_THRESHOLD_M = 50; // Reject GPS with accuracy > 50m
const MAX_REALISTIC_SPEED_KMH = 80;  // Reject speed teleport > 80 km/h in BRTS

export class GpsValidator {
  constructor() {
    this.lastValidPoint = null;
  }

  /**
   * Validates and cleans a raw GPS observation.
   * @param {Object} rawPoint - { lat, lng, timestamp, accuracy, speed, heading }
   * @returns {Object|null} Cleaned observation or null if rejected
   */
  process(rawPoint) {
    if (!rawPoint || typeof rawPoint.lat !== 'number' || typeof rawPoint.lng !== 'number') {
      return null;
    }

    const timestamp = rawPoint.timestamp || Date.now();
    const accuracy = rawPoint.accuracy ?? 10;

    // 1. Accuracy Check
    if (accuracy > MAX_ACCURACY_THRESHOLD_M) {
      return null; // Reject noisy GPS
    }

    // 2. Velocity and Jump Check against previous point
    let computedSpeed = rawPoint.speed; // in m/s
    let computedHeading = rawPoint.heading;

    if (this.lastValidPoint) {
      const timeDeltaSec = (timestamp - this.lastValidPoint.timestamp) / 1000;
      if (timeDeltaSec > 0.3) {
        const distMeters = haversineDistance(
          [this.lastValidPoint.lat, this.lastValidPoint.lng],
          [rawPoint.lat, rawPoint.lng]
        );
        const speedKmh = (distMeters / timeDeltaSec) * 3.6;

        if (speedKmh > MAX_REALISTIC_SPEED_KMH) {
          // Unrealistic jump
          return null;
        }

        if (computedSpeed === null || computedSpeed === undefined || isNaN(computedSpeed)) {
          computedSpeed = distMeters / timeDeltaSec; // m/s
        }

        if (distMeters > 3 && (computedHeading === null || computedHeading === undefined || isNaN(computedHeading))) {
          computedHeading = calculateBearing(
            [this.lastValidPoint.lat, this.lastValidPoint.lng],
            [rawPoint.lat, rawPoint.lng]
          );
        }
      }
    }

    const cleaned = {
      lat: rawPoint.lat,
      lng: rawPoint.lng,
      timestamp,
      accuracy,
      speedKmh: Math.max(0, (computedSpeed || 0) * 3.6),
      heading: computedHeading ?? 0,
      isClean: true
    };

    this.lastValidPoint = cleaned;
    return cleaned;
  }

  reset() {
    this.lastValidPoint = null;
  }
}
