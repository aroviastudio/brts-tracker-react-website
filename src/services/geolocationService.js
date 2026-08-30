/**
 * Geolocation Browser API Service with Privacy Auto-Stop
 */
export class GeolocationService {
  constructor() {
    this.watchId = null;
    this.isTracking = false;
    this.sessionId = 'USR_' + Math.random().toString(36).substring(2, 9); // In-memory anonymous ID
  }

  startTracking(onTelemetry, onError) {
    if (!('geolocation' in navigator)) {
      onError?.(new Error('Geolocation is not supported by your browser.'));
      return false;
    }

    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
    }

    this.isTracking = true;
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const telemetry = {
          sessionId: this.sessionId,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          speed: position.coords.speed, // m/s
          heading: position.coords.heading,
          timestamp: position.timestamp || Date.now()
        };
        onTelemetry?.(telemetry);
      },
      (error) => {
        onError?.(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000
      }
    );

    return true;
  }

  stopTracking() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.isTracking = false;
  }
}
