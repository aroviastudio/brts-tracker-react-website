/**
 * Multi-Signal Route Inference, Divergence Scorer, and Multi-Bus Options Engine
 */
import { BRTS_ROUTES, BRTS_STATIONS, INITIAL_BUS_FLEET } from './data/sitilinkData.js';
import { MapMatcher } from './mapMatcher.js';
import { BOARDING_STATES } from './boardingDetector.js';

export class RouteEngine {
  /**
   * Find all candidate route journeys (both direct and circular loop options)
   * @param {string} fromStopId
   * @param {string} toStopId
   * @returns {Array<Object>} All valid travel options
   */
  static findRoutes(fromStopId, toStopId) {
    if (!fromStopId || !toStopId || fromStopId === toStopId) {
      return [];
    }

    const options = [];

    for (const routeId in BRTS_ROUTES) {
      const route = BRTS_ROUTES[routeId];
      if (!route || !route.stopSequence) continue;

      const seq = route.stopSequence;
      const fromIndices = [];
      const toIndices = [];

      seq.forEach((sId, idx) => {
        if (sId === fromStopId) fromIndices.push(idx);
        if (sId === toStopId) toIndices.push(idx);
      });

      // 1. Check Direct Options (fromIndex < toIndex)
      for (const fIdx of fromIndices) {
        for (const tIdx of toIndices) {
          if (fIdx < tIdx) {
            const stopsInJourney = seq.slice(fIdx, tIdx + 1);
            options.push({
              ...route,
              type: 'DIRECT',
              typeLabel: 'Direct Route (Fastest)',
              fromIndex: fIdx,
              toIndex: tIdx,
              stopCount: stopsInJourney.length,
              intermediateStops: stopsInJourney,
              estimatedTravelMinutes: Math.round(
                ((stopsInJourney.length - 1) * 2.2) + ((stopsInJourney.length - 1) * ((route.stationDwellSec || 25) / 60))
              ),
              description: `Direct ride from ${BRTS_STATIONS[fromStopId]?.shortName || fromStopId} to ${BRTS_STATIONS[toStopId]?.shortName || toStopId}`
            });
          }
        }
      }

      // 2. Check Circular Loop Options (if circular route and fromIndex > toIndex)
      if (route.type && route.type.startsWith('CIRCULAR')) {
        for (const fIdx of fromIndices) {
          for (const tIdx of toIndices) {
            if (fIdx > tIdx) {
              const leg1 = seq.slice(fIdx);
              const leg2 = seq.slice(1, tIdx + 1);
              const fullLoopStops = [...leg1, ...leg2];

              options.push({
                ...route,
                type: 'CIRCULAR_LOOP',
                typeLabel: 'Circular Loop (Via Althan Depot)',
                fromIndex: fIdx,
                toIndex: tIdx,
                stopCount: fullLoopStops.length,
                intermediateStops: fullLoopStops,
                estimatedTravelMinutes: Math.round(
                  ((fullLoopStops.length - 1) * 2.5) + ((fullLoopStops.length - 1) * ((route.stationDwellSec || 25) / 60))
                ),
                description: `Circular ride via Althan Depot to ${BRTS_STATIONS[toStopId]?.shortName || toStopId}`
              });
            }
          }
        }
      }
    }

    options.sort((a, b) => {
      if (a.type === 'DIRECT' && b.type !== 'DIRECT') return -1;
      if (b.type === 'DIRECT' && a.type !== 'DIRECT') return 1;
      return a.estimatedTravelMinutes - b.estimatedTravelMinutes;
    });

    return options;
  }

  /**
   * Get all live physical buses currently running on routes serving this journey
   */
  static getAvailableBusesForJourney(fromStopId, toStopId, liveFleet = INITIAL_BUS_FLEET) {
    const candidateRoutes = this.findRoutes(fromStopId, toStopId);
    if (candidateRoutes.length === 0) return [];

    const availableBuses = [];

    for (const journeyOption of candidateRoutes) {
      const route = BRTS_ROUTES[journeyOption.routeId] || journeyOption;
      if (!route || !route.stopSequence) continue;

      const matchingBuses = liveFleet.filter((b) => b.routeId === journeyOption.routeId);

      for (const bus of matchingBuses) {
        const currentStation = BRTS_STATIONS[bus.currentStopId];
        const nextStation = BRTS_STATIONS[bus.nextStopId];

        const currentStopIdx = route.stopSequence.indexOf(bus.currentStopId);
        const originStopIdx = route.stopSequence.indexOf(fromStopId);

        let stopsAway = 0;
        let arrivalMinutes = 0;
        let busStatusText = '';

        if (currentStopIdx !== -1 && originStopIdx !== -1) {
          if (currentStopIdx <= originStopIdx) {
            stopsAway = originStopIdx - currentStopIdx;
            arrivalMinutes = Math.max(1, stopsAway * 3);
            busStatusText = stopsAway === 0 ? 'Arriving now at your stop' : `${stopsAway} stop(s) away • ETA ${arrivalMinutes} mins`;
          } else {
            stopsAway = route.stopSequence.length - currentStopIdx + originStopIdx;
            arrivalMinutes = Math.max(8, stopsAway * 3);
            busStatusText = `On loop via Depot • Arrives in ~${arrivalMinutes} mins`;
          }
        } else {
          arrivalMinutes = 5;
          busStatusText = 'En route';
        }

        availableBuses.push({
          ...bus,
          routeOption: journeyOption,
          currentStationName: currentStation ? currentStation.name : 'En Route',
          nextStationName: nextStation ? nextStation.name : 'Approaching Station',
          stopsAway,
          arrivalMinutes,
          busStatusText,
          isRecommended: journeyOption.type === 'DIRECT' && stopsAway >= 0 && stopsAway <= 3
        });
      }
    }

    availableBuses.sort((a, b) => a.arrivalMinutes - b.arrivalMinutes);
    return availableBuses;
  }

  /**
   * Calculate Multi-Signal Confidence Score (0 - 100%)
   */
  static evaluateRouteConfidence({ route, telemetry, boardingState, clusterBus, fromStopId, toStopId }) {
    const breakdown = {
      journeyMatch: 0,
      boardingMatch: 0,
      corridorMatch: 0,
      directionMatch: 0,
      stopSequenceMatch: 0,
      speedMatch: 0,
      clusterMatch: 0
    };

    if (!route || !telemetry) {
      return { totalScore: 0, breakdown, isViable: false };
    }

    const stopSeq = route.stopSequence || BRTS_ROUTES[route.routeId]?.stopSequence || [];
    const fromIdx = stopSeq.indexOf(fromStopId);
    const toIdx = stopSeq.indexOf(toStopId);

    // 1. Journey Match (30 pts)
    if (fromIdx !== -1 && toIdx !== -1) {
      breakdown.journeyMatch = 30;
    }

    // 2. Boarding State Match (15 pts)
    if (boardingState === BOARDING_STATES.IN_TRANSIT || boardingState === BOARDING_STATES.BOARDING_DETECTED) {
      breakdown.boardingMatch = 15;
    } else if (boardingState === BOARDING_STATES.AT_ORIGIN_STATION) {
      breakdown.boardingMatch = 10;
    }

    // 3. Corridor Proximity Match (20 pts)
    const match = MapMatcher.matchRoute([telemetry.lat, telemetry.lng], route, telemetry.heading);
    if (match) {
      if (match.distanceMeters <= 25) {
        breakdown.corridorMatch = 20;
      } else if (match.distanceMeters <= 50) {
        breakdown.corridorMatch = 12;
      } else if (match.distanceMeters <= 80) {
        breakdown.corridorMatch = 5;
      }

      // 4. Direction & Heading Match (10 pts)
      if (match.headingMatch && telemetry.speedKmh >= 10) {
        breakdown.directionMatch = 10;
      }

      // 5. Stop Sequence Match (10 pts)
      if (fromIdx !== -1 && toIdx !== -1) {
        if (match.segmentIndex >= Math.min(fromIdx, toIdx) && match.segmentIndex <= Math.max(fromIdx, toIdx)) {
          breakdown.stopSequenceMatch = 10;
        }
      }
    }

    // 6. Speed Profile Match (5 pts)
    if (telemetry.speedKmh >= 18 && telemetry.speedKmh <= 65) {
      breakdown.speedMatch = 5;
    } else if (telemetry.speedKmh > 5) {
      breakdown.speedMatch = 3;
    }

    // 7. Cluster Verification Match (10 pts)
    if (clusterBus && clusterBus.passengerCount >= 2) {
      breakdown.clusterMatch = Math.min(10, clusterBus.passengerCount * 3 + 4);
    }

    const totalScore = Math.min(
      100,
      breakdown.journeyMatch +
      breakdown.boardingMatch +
      breakdown.corridorMatch +
      breakdown.directionMatch +
      breakdown.stopSequenceMatch +
      breakdown.speedMatch +
      breakdown.clusterMatch
    );

    return {
      routeId: route.routeId,
      totalScore,
      breakdown,
      isViable: totalScore >= 45,
      mapMatch: match
    };
  }
}
