/**
 * Boarding and Alighting State Machine with Auto-Stop Privacy Geofence
 */
import { haversineDistance } from './geoUtils.js';
import { BRTS_STATIONS } from './data/sitilinkData.js';

export const BOARDING_STATES = {
  IDLE: 'IDLE',
  AT_ORIGIN_STATION: 'AT_ORIGIN_STATION',
  BOARDING_DETECTED: 'BOARDING_DETECTED',
  IN_TRANSIT: 'IN_TRANSIT',
  APPROACHING_DESTINATION: 'APPROACHING_DESTINATION',
  ALIGHTED: 'ALIGHTED',
  AUTO_STOPPED: 'AUTO_STOPPED' // Privacy trigger: GPS stream fully torn down
};

export class BoardingDetector {
  constructor(fromStopId, toStopId) {
    this.fromStopId = fromStopId;
    this.toStopId = toStopId;
    this.state = BOARDING_STATES.IDLE;
    this.stateLog = [];
    this.stationaryCount = 0;
    this.inTransitCount = 0;
  }

  setJourney(fromStopId, toStopId) {
    this.fromStopId = fromStopId;
    this.toStopId = toStopId;
    this.state = BOARDING_STATES.IDLE;
    this.stationaryCount = 0;
    this.inTransitCount = 0;
  }

  /**
   * Update state machine with new telemetry
   * @param {Object} telemetry - { lat, lng, speedKmh, heading, isClean }
   * @param {Object} mapMatchResult
   * @returns {Object} State update and whether tracking should auto-terminate
   */
  update(telemetry, mapMatchResult) {
    if (!telemetry || !telemetry.isClean) {
      return { state: this.state, shouldAutoStop: false };
    }

    const fromStation = BRTS_STATIONS[this.fromStopId];
    const toStation = BRTS_STATIONS[this.toStopId];

    const distToOrigin = fromStation
      ? haversineDistance([telemetry.lat, telemetry.lng], [fromStation.lat, fromStation.lng])
      : Infinity;

    const distToDest = toStation
      ? haversineDistance([telemetry.lat, telemetry.lng], [toStation.lat, toStation.lng])
      : Infinity;

    const speed = telemetry.speedKmh;
    const isStationary = speed < 6;
    const isMovingAtTransitSpeed = speed >= 15 && speed <= 70;

    switch (this.state) {
      case BOARDING_STATES.IDLE:
        if (distToOrigin <= 60 && isStationary) {
          this.transitionTo(BOARDING_STATES.AT_ORIGIN_STATION, 'Waiting at starting BRTS platform');
        } else if (distToOrigin <= 120 && isMovingAtTransitSpeed && mapMatchResult?.isOnCorridor) {
          this.transitionTo(BOARDING_STATES.BOARDING_DETECTED, 'Detected movement from origin station');
        }
        break;

      case BOARDING_STATES.AT_ORIGIN_STATION:
        if (isMovingAtTransitSpeed && mapMatchResult?.isOnCorridor && mapMatchResult?.headingMatch) {
          this.transitionTo(BOARDING_STATES.BOARDING_DETECTED, 'Boarding bus - accelerated along BRTS corridor');
        }
        break;

      case BOARDING_STATES.BOARDING_DETECTED:
        if (mapMatchResult?.isOnCorridor && speed >= 12) {
          this.inTransitCount++;
          if (this.inTransitCount >= 2) {
            this.transitionTo(BOARDING_STATES.IN_TRANSIT, 'Cruising in BRTS dedicated corridor');
          }
        }
        break;

      case BOARDING_STATES.IN_TRANSIT:
        if (distToDest <= 180) {
          this.transitionTo(BOARDING_STATES.APPROACHING_DESTINATION, 'Approaching destination station');
        }
        break;

      case BOARDING_STATES.APPROACHING_DESTINATION:
        if (distToDest <= 60 && isStationary) {
          this.transitionTo(BOARDING_STATES.ALIGHTED, 'Bus arrived at destination station');
        } else if (distToDest > 80 && isStationary) {
          this.transitionTo(BOARDING_STATES.ALIGHTED, 'Alighted from bus');
        }
        break;

      case BOARDING_STATES.ALIGHTED:
        // Privacy Geofence: When user moves away from the station (> 90m), completely stop GPS tracking
        if (distToDest > 90 || !mapMatchResult?.isOnCorridor) {
          this.transitionTo(BOARDING_STATES.AUTO_STOPPED, 'Left BRTS station boundary. Geolocation auto-stopped for privacy.');
          return {
            state: this.state,
            shouldAutoStop: true,
            reason: 'User exited BRTS station premises. Privacy lock activated.'
          };
        }
        break;

      case BOARDING_STATES.AUTO_STOPPED:
        return { state: this.state, shouldAutoStop: true };
    }

    return {
      state: this.state,
      shouldAutoStop: false,
      distToOriginMeters: distToOrigin,
      distToDestMeters: distToDest
    };
  }

  transitionTo(newState, reason) {
    this.state = newState;
    this.stateLog.push({
      state: newState,
      timestamp: Date.now(),
      reason
    });
  }
}
