import React, { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { BRTS_STATIONS } from '../engine/data/sitilinkData.js';

export function LiveMap({ route, activeBusCluster }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);
  const busMarkerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let L;
    try {
      L = window.L || require('leaflet');
    } catch {
      return;
    }

    // Default center: Surat BRTS Ring area
    const map = L.map(containerRef.current, {
      center: [21.175, 72.845],
      zoom: 13,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Draw route stops & polyline when route changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !route?.stopSequence) return;

    let L;
    try { L = window.L || require('leaflet'); } catch { return; }

    // Clear old markers/polyline
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    if (polylineRef.current) { polylineRef.current.remove(); polylineRef.current = null; }

    const coords = [];

    route.stopSequence.forEach((stopId, idx) => {
      const st = BRTS_STATIONS[stopId];
      if (!st) return;
      coords.push([st.lat, st.lng]);

      const isFirst = idx === 0;
      const isLast  = idx === route.stopSequence.length - 1;

      const icon = L.divIcon({
        html: `<div style="
          width:${isFirst || isLast ? 14 : 10}px;
          height:${isFirst || isLast ? 14 : 10}px;
          border-radius:50%;
          background:${isFirst ? '#16A34A' : isLast ? '#2563EB' : '#fff'};
          border:2.5px solid ${isFirst ? '#16A34A' : isLast ? '#2563EB' : '#64748B'};
          box-shadow:0 1px 4px rgba(0,0,0,0.2);">
        </div>`,
        className: '',
        iconAnchor: [isFirst || isLast ? 7 : 5, isFirst || isLast ? 7 : 5],
      });

      const marker = L.marker([st.lat, st.lng], { icon })
        .bindTooltip(st.shortName, { permanent: false, direction: 'top', className: 'text-xs' })
        .addTo(map);
      markersRef.current.push(marker);
    });

    if (coords.length > 1) {
      polylineRef.current = L.polyline(coords, {
        color: route.color || '#2563EB',
        weight: 4,
        opacity: 0.75,
      }).addTo(map);

      map.fitBounds(polylineRef.current.getBounds(), { padding: [24, 24] });
    }
  }, [route]);

  // Move bus marker when cluster changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    let L;
    try { L = window.L || require('leaflet'); } catch { return; }

    if (busMarkerRef.current) { busMarkerRef.current.remove(); busMarkerRef.current = null; }

    if (activeBusCluster?.centroidLat) {
      const busIcon = L.divIcon({
        html: `<div style="
          width:28px;height:28px;border-radius:50%;
          background:#2563EB;border:3px solid #fff;
          box-shadow:0 2px 10px rgba(37,99,235,0.5);
          display:flex;align-items:center;justify-content:center;
          font-size:13px;">🚌</div>`,
        className: 'bus-pulse',
        iconAnchor: [14, 14],
      });
      busMarkerRef.current = L.marker(
        [activeBusCluster.centroidLat, activeBusCluster.centroidLng],
        { icon: busIcon }
      ).addTo(map);
    }
  }, [activeBusCluster]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-semibold text-gray-800">Live Map</span>
        </div>
        <span className="text-xs text-gray-400">Tap stops for name</span>
      </div>
      <div ref={containerRef} style={{ height: '280px', width: '100%' }} />
    </div>
  );
}
