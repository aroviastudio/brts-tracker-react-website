import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { BRTS_STATIONS, BRTS_ROUTES } from '../engine/data/sitilinkData.js';

export function LiveMap({ route, telemetry, activeBusCluster, _allClusters = [] }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({ bus: null, user: null, stations: [], polylines: [] });

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    try {
      if (mapContainerRef.current._leaflet_id) {
        mapContainerRef.current._leaflet_id = null;
      }

      const map = L.map(mapContainerRef.current, {
        center: [21.1702, 72.8311],
        zoom: 13,
        zoomControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
    } catch (err) {
      console.warn('Leaflet map initialization notice:', err);
    }

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch {}
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Route Polylines and Stations
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    try {
      markersRef.current.stations.forEach((m) => {
        try { m.remove(); } catch {}
      });
      markersRef.current.polylines.forEach((l) => {
        try { l.remove(); } catch {}
      });
      markersRef.current.stations = [];
      markersRef.current.polylines = [];

      for (const rId in BRTS_ROUTES) {
        const r = BRTS_ROUTES[rId];
        if (!r || !r.stopSequence) continue;

        const coords = r.stopSequence
          .map((sId) => BRTS_STATIONS[sId])
          .filter(Boolean)
          .map((s) => [s.lat, s.lng]);

        if (coords.length < 2) continue;

        const isCurrentRoute = route && route.routeId === r.routeId;
        const polyline = L.polyline(coords, {
          color: isCurrentRoute ? (r.color || '#059669') : '#64748B',
          weight: isCurrentRoute ? 6 : 3,
          opacity: isCurrentRoute ? 0.9 : 0.4,
          dashArray: isCurrentRoute ? null : '6, 6'
        }).addTo(map);

        markersRef.current.polylines.push(polyline);
      }

      const activeStops = route && route.stopSequence
        ? route.stopSequence.map((sId) => BRTS_STATIONS[sId]).filter(Boolean)
        : Object.values(BRTS_STATIONS);

      activeStops.forEach((st) => {
        if (!st || !st.lat || !st.lng) return;

        const stationIcon = L.divIcon({
          className: 'custom-station-icon',
          html: `<div style="background-color: #059669; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 6px rgba(0,0,0,0.4);"></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6]
        });

        const marker = L.marker([st.lat, st.lng], { icon: stationIcon })
          .bindPopup(`<b>${st.name}</b><br/>Code: ${st.code}`)
          .addTo(map);

        markersRef.current.stations.push(marker);
      });

      if (route && activeStops.length > 0) {
        const bounds = L.latLngBounds(activeStops.map((s) => [s.lat, s.lng]));
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    } catch (err) {
      console.warn('Error rendering map layers:', err);
    }
  }, [route]);

  // Update Live Bus Cluster and User Position
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    try {
      // 1. User Position marker
      if (telemetry?.lat && telemetry?.lng) {
        if (!markersRef.current.user) {
          const userIcon = L.divIcon({
            className: 'user-pulse-icon',
            html: `<div style="background-color: #3B82F6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px #3B82F6;"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          });
          markersRef.current.user = L.marker([telemetry.lat, telemetry.lng], { icon: userIcon }).addTo(map);
        } else {
          markersRef.current.user.setLatLng([telemetry.lat, telemetry.lng]);
        }
      }

      // 2. Bus Cluster marker
      const busPos = activeBusCluster || (telemetry?.lat ? { lat: telemetry.lat, lng: telemetry.lng, speedKmh: telemetry.speedKmh } : null);
      if (busPos && busPos.lat && busPos.lng) {
        const busHtml = `
          <div style="
            background: #10B981;
            color: white;
            padding: 4px 8px;
            border-radius: 20px;
            border: 2px solid white;
            font-weight: 800;
            font-size: 11px;
            display: flex;
            align-items: center;
            gap: 4px;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.5);
            white-space: nowrap;
          ">
            🚌 ${route ? route.routeNumber : 'BRTS'} • ${busPos.speedKmh || 0} km/h
          </div>
        `;

        const busIcon = L.divIcon({
          className: 'bus-bubble-icon',
          html: busHtml,
          iconSize: [80, 24],
          iconAnchor: [40, 12]
        });

        if (!markersRef.current.bus) {
          markersRef.current.bus = L.marker([busPos.lat, busPos.lng], { icon: busIcon }).addTo(map);
        } else {
          markersRef.current.bus.setLatLng([busPos.lat, busPos.lng]);
          markersRef.current.bus.setIcon(busIcon);
        }
      }
    } catch (err) {
      console.warn('Error updating map markers:', err);
    }
  }, [telemetry, activeBusCluster, route]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-[360px]">
      <div className="bg-slate-800/80 px-4 py-2.5 border-b border-slate-700 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-300">🗺️ Live BRTS Corridor & Bus Geometry</span>
        <span className="text-[11px] text-emerald-400 font-mono">Surat Sitilink Network</span>
      </div>
      <div ref={mapContainerRef} className="flex-1 w-full h-full" />
    </div>
  );
}
