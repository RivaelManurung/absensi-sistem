"use client";

import { useEffect, useMemo, useRef } from "react";
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Circle, 
  useMap, 
  useMapEvents 
} from "react-leaflet";
import L from "leaflet";
import { 
  MAP_TILES, 
  MAP_ATTRIBUTION, 
  createCustomIcon, 
  MAP_MARKER_STYLES,
  DEFAULT_CENTER,
  DEFAULT_ZOOM
} from "@/lib/map";

interface GeofencePickerMapProps {
  latitude: number | null;
  longitude: number | null;
  radiusMeters: number;
  enabled: boolean;
  onLocationChange: (location: { latitude: number; longitude: number }) => void;
}

// Sub-component to handle map clicks
function MapClickHandler({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Sub-component to handle programatic flying/fitting
function MapController({ lat, lng, radius }: { lat: number | null, lng: number | null, radius: number }) {
  const map = useMap();
  
  useEffect(() => {
    if (lat !== null && lng !== null && map) {
      const center = L.latLng(lat, lng);
      
      const timeoutId = setTimeout(() => {
        try {
          map.invalidateSize();
          
          // Only auto-fit if we have a location
          const tempCircle = L.circle(center, { radius }).addTo(map);
          const bounds = tempCircle.getBounds();
          tempCircle.remove();

          map.fitBounds(bounds, { padding: [50, 50], animate: true });
        } catch (e) {
          // If fitting bounds fails, at least fly to the center
          map.flyTo(center, 16);
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [lat, lng, radius, map]);

  return null;
}

export default function GeofencePickerMap({
  latitude,
  longitude,
  radiusMeters,
  enabled,
  onLocationChange
}: GeofencePickerMapProps) {
  const markerRef = useRef<L.Marker>(null);
  const customIcon = useMemo(() => createCustomIcon(enabled ? "#3b82f6" : "#94a3b8"), [enabled]);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const { lat, lng } = marker.getLatLng();
          onLocationChange({ latitude: lat, longitude: lng });
        }
      },
    }),
    [onLocationChange]
  );

  const center: [number, number] = latitude !== null && longitude !== null 
    ? [latitude, longitude] 
    : DEFAULT_CENTER;

  return (
    <div className="relative w-full h-[400px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm group">
      <style dangerouslySetInnerHTML={{ __html: MAP_MARKER_STYLES }} />
      
      <MapContainer
        center={center}
        zoom={latitude !== null ? 16 : DEFAULT_ZOOM}
        className="w-full h-full z-0"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution={MAP_ATTRIBUTION}
          url={MAP_TILES}
        />
        
        <MapClickHandler 
          onLocationChange={(lat, lng) => onLocationChange({ latitude: lat, longitude: lng })} 
        />
        
        <MapController lat={latitude} lng={longitude} radius={radiusMeters} />

        {latitude !== null && longitude !== null && (
          <>
            <Marker
              draggable={true}
              eventHandlers={eventHandlers}
              position={[latitude, longitude]}
              icon={customIcon}
              ref={markerRef}
            />
            <Circle
              center={[latitude, longitude]}
              radius={radiusMeters}
              pathOptions={{
                fillColor: enabled ? "#3b82f6" : "#94a3b8",
                fillOpacity: 0.15,
                color: enabled ? "#3b82f6" : "#94a3b8",
                weight: 2,
                dashArray: enabled ? "" : "5, 10"
              }}
            />
          </>
        )}
      </MapContainer>
      
      {!enabled && (
        <div className="absolute inset-0 z-10 bg-slate-500/10 backdrop-blur-[1px] pointer-events-none flex items-center justify-center">
          <div className="bg-white/90 dark:bg-slate-950/90 px-4 py-2 rounded-full shadow-lg border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-500">
            Geofence Disabled
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-4 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-white/90 dark:bg-slate-950/90 px-3 py-1.5 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
          Click map or drag marker to set location
        </div>
      </div>
    </div>
  );
}
