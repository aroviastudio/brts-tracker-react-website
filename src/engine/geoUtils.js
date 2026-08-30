/**
 * Geodesic and vector geometry utilities for BRTS Corridor Map-Matching
 */

const EARTH_RADIUS_M = 6371000;

export function toRad(deg) {
  return (deg * Math.PI) / 180;
}

export function toDeg(rad) {
  return (rad * 180) / Math.PI;
}

export function haversineDistance([lat1, lon1], [lat2, lon2]) {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const rLat1 = toRad(lat1);
  const rLat2 = toRad(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(rLat1) * Math.cos(rLat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_M * c;
}

export function calculateBearing([lat1, lon1], [lat2, lon2]) {
  const rLat1 = toRad(lat1);
  const rLat2 = toRad(lat2);
  const dLon = toRad(lon2 - lon1);

  const y = Math.sin(dLon) * Math.cos(rLat2);
  const x =
    Math.cos(rLat1) * Math.sin(rLat2) -
    Math.sin(rLat1) * Math.cos(rLat2) * Math.cos(dLon);

  const brng = toDeg(Math.atan2(y, x));
  return (brng + 360) % 360;
}

export function bearingDifference(b1, b2) {
  const diff = Math.abs((b1 - b2) % 360);
  return diff > 180 ? 360 - diff : diff;
}

export function projectPointOnSegment(p, a, b) {
  const [pLat, pLon] = p;
  const [aLat, aLon] = a;
  const [bLat, bLon] = b;

  const abLat = bLat - aLat;
  const abLon = bLon - aLon;
  const apLat = pLat - aLat;
  const apLon = pLon - aLon;

  const abSquared = abLat * abLat + abLon * abLon;

  if (abSquared === 0) {
    return {
      point: a,
      distanceMeters: haversineDistance(p, a),
      fraction: 0,
    };
  }

  let t = (apLat * abLat + apLon * abLon) / abSquared;
  t = Math.max(0, Math.min(1, t));

  const projLat = aLat + t * abLat;
  const projLon = aLon + t * abLon;
  const projPoint = [projLat, projLon];

  return {
    point: projPoint,
    distanceMeters: haversineDistance(p, projPoint),
    fraction: t,
  };
}

export function interpolateCoord([lat1, lon1], [lat2, lon2], fraction) {
  return [
    lat1 + (lat2 - lat1) * fraction,
    lon1 + (lon2 - lon1) * fraction,
  ];
}
