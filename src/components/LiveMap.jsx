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

    // 1. Google Maps Standard Roads
    const googleStreets = L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      attribution: '© Google Maps',
      maxZoom: 20,
    });

    // 2. Google Maps Satellite
    const googleSatellite = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      attribution: '© Google Maps',
      maxZoom: 20,
    });

    // Add default layer
    googleStreets.addTo(map);

    // Add Layer Control Toggle (Top Right)
    const baseMaps = {
      "Road Map (Google)": googleStreets,
      "Satellite (Google)": googleSatellite
    };
    L.control.layers(baseMaps, null, { position: 'topright' }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Draw route stops & outline when route changes
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

      // Permanent visible label for every station
      const marker = L.marker([st.lat, st.lng], { icon, zIndexOffset: 500 })
        .bindTooltip(st.shortName, { 
          permanent: true, 
          direction: 'right', 
          className: 'station-label',
          offset: [isFirst || isLast ? 8 : 6, 0]
        })
        .addTo(map);
      markersRef.current.push(marker);
    });

    if (coords.length > 1) {
      // Async fetch exact road geometries via OSRM public API
      const fetchRealRoads = async () => {
        try {
          // OSRM requires "lng,lat;lng,lat"
          const coordsStr = coords.map(c => `${c[1]},${c[0]}`).join(';');
          // Limit to max 50 coordinates for public API safely (most BRTS routes are < 40 stops)
          if (coords.length > 80) throw new Error("Too many coords for OSRM");

          const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${coordsStr}?overview=full&geometries=geojson`);
          const data = await res.json();

          if (data.code === 'Ok' && data.routes && data.routes[0]) {
            const geojsonCoords = data.routes[0].geometry.coordinates;
            // OSRM returns [lon, lat], Leaflet needs [lat, lon]
            const realRoadLatLngs = geojsonCoords.map(c => [c[1], c[0]]);

            polylineRef.current = L.polyline(realRoadLatLngs, {
              color: route.color || '#2563EB',
              weight: 5,
              opacity: 0.8,
              lineCap: 'round',
              lineJoin: 'round'
            }).addTo(map);

            map.fitBounds(polylineRef.current.getBounds(), { padding: [24, 24] });
            return; // Success!
          }
        } catch (e) {
          console.warn("Real road outline fetch failed, falling back to straight lines:", e);
        }

        // Fallback: straight lines between stops
        polylineRef.current = L.polyline(coords, {
          color: route.color || '#2563EB',
          weight: 5,
          opacity: 0.8,
          lineCap: 'round',
          lineJoin: 'round',
          dashArray: '10, 10' // dashed to indicate it's a fallback straight line
        }).addTo(map);
        map.fitBounds(polylineRef.current.getBounds(), { padding: [24, 24] });
      };

      fetchRealRoads();
    }
  }, [route]);

  // Move live bus marker when someone broadcasts location
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
          box-shadow:0 2px 10px rgba(37,99,235,0.8);
          display:flex;align-items:center;justify-content:center;
          font-size:13px; z-index: 2000;">🚌</div>`,
        className: 'bus-pulse',
        iconAnchor: [14, 14],
      });
      busMarkerRef.current = L.marker(
        [activeBusCluster.centroidLat, activeBusCluster.centroidLng],
        { icon: busIcon, zIndexOffset: 2000 }
      ).addTo(map);
    }
  }, [activeBusCluster]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative z-0">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-white relative z-10">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-semibold text-gray-800">Live Map Tracker</span>
        </div>
        <span className="text-xs text-gray-400">Layer button at top right →</span>
      </div>
      <div ref={containerRef} style={{ height: '360px', width: '100%' }} className="z-0" />
    </div>
  );
}
