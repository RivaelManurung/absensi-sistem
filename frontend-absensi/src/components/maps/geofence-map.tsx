"use client";

import { useEffect, useRef } from "react";
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Circle, 
  Popup, 
  useMap 
} from "react-leaflet";
import L from "leaflet";
import { 
  MAP_TILES, 
  MAP_ATTRIBUTION, 
  createCustomIcon, 
  MAP_MARKER_STYLES 
} from "@/lib/map";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Navigation, 
  Layers, 
  AlertTriangle,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Fix for default leaflet icons in Next.js
const fixLeafletIcons = () => {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
};

interface GeofenceMapProps {
  lat: number | null;
  lng: number | null;
  radius: number;
  officeName: string;
  officeAddress?: string;
  status?: "Active" | "Inactive";
  enabled?: boolean;
}

// Component to handle map auto-bounds
function RecenterMap({ lat, lng, radius }: { lat: number | null, lng: number | null, radius: number }) {
  const map = useMap();
  
  useEffect(() => {
    if (lat !== null && lng !== null && map) {
      const center = L.latLng(lat, lng);
      // Ensure map is ready and has dimensions before fitting bounds
      const timeoutId = setTimeout(() => {
        try {
          map.invalidateSize();
          
          // Create temporary circle to get bounds (requires map for projection)
          const tempCircle = L.circle(center, { radius }).addTo(map);
          const bounds = tempCircle.getBounds();
          tempCircle.remove();

          map.fitBounds(bounds, { padding: [50, 50], animate: true });
        } catch (e) {
          console.error("Error fitting bounds:", e);
        }
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [lat, lng, radius, map]);

  return null;
}

export default function GeofenceMap({ 
  lat, 
  lng, 
  radius, 
  officeName, 
  officeAddress,
  status,
  enabled = true
}: GeofenceMapProps) {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    fixLeafletIcons();
  }, []);

  if (lat === null || lng === null) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-muted/30 p-8 text-center transition-all hover:bg-muted/40">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-background shadow-md ring-8 ring-primary/5">
          <AlertTriangle className="h-8 w-8 text-warning" />
        </div>
        <h3 className="text-lg font-bold">Coordinates Missing</h3>
        <p className="mb-6 max-w-sm text-sm text-muted-foreground">
          Office location has not been configured yet. Please set the coordinates to enable geofencing.
        </p>
        <Button className="rounded-xl px-8 shadow-sm" asChild>
          <a href="edit">Edit Office Location</a>
        </Button>
      </div>
    );
  }

  const customIcon = createCustomIcon(enabled ? "#3b82f6" : "#94a3b8");

  return (
    <div className="relative group overflow-hidden rounded-2xl border bg-card shadow-lg transition-all duration-500 animate-in fade-in zoom-in-95">
      <style dangerouslySetInnerHTML={{ __html: MAP_MARKER_STYLES }} />
      
      <div className="h-[400px] w-full md:h-[450px]">
        <MapContainer
          center={[lat, lng]}
          zoom={15}
          scrollWheelZoom={false}
          className="h-full w-full z-0"
          ref={mapRef}
        >
          <TileLayer
            attribution={MAP_ATTRIBUTION}
            url={MAP_TILES}
          />
          
          <Circle
            center={[lat, lng]}
            radius={radius}
            pathOptions={{
              fillColor: enabled ? "#3b82f6" : "#94a3b8",
              fillOpacity: 0.15,
              color: enabled ? "#3b82f6" : "#94a3b8",
              weight: 2,
              dashArray: enabled ? "" : "5, 10"
            }}
          />
          
          <Marker position={[lat, lng]} icon={customIcon}>
            <Popup className="custom-popup">
              <div className="p-1">
                <p className="font-bold text-primary mb-1">{officeName}</p>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{officeAddress}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] py-0">{radius}m Radius</Badge>
                  <a 
                    href={`https://www.google.com/maps?q=${lat},${lng}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] flex items-center text-blue-500 hover:underline"
                  >
                    Open in Google <ExternalLink className="ml-1 h-2 w-2" />
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>

          <RecenterMap lat={lat} lng={lng} radius={radius} />
        </MapContainer>
      </div>

      {!enabled && (
        <div className="absolute inset-0 z-[5] bg-slate-500/10 backdrop-blur-[1px] pointer-events-none flex items-center justify-center">
          <div className="bg-white/90 dark:bg-slate-950/90 px-4 py-2 rounded-full shadow-lg border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-500">
            Geofence Restricted
          </div>
        </div>
      )}

      {/* Floating Info Overlay */}
      <div className="absolute bottom-4 left-4 right-4 z-[10] flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-2 rounded-2xl bg-background/90 p-3 shadow-xl backdrop-blur-md ring-1 ring-border pointer-events-auto">
          <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Layers className="h-4 w-4 text-primary" />
          </div>
          <div className="space-y-0.5 px-1">
            <div className="flex items-center gap-2">
               <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Geofence Status</p>
               {!enabled && (
                 <Badge variant="outline" className="h-4 text-[9px] px-1.5 bg-slate-500/10 text-slate-500">
                   Disabled
                 </Badge>
               )}
               {status && (
                 <Badge variant="secondary" className={`h-4 text-[9px] px-1.5 ${status === 'Active' ? 'bg-green-500/10 text-green-600' : 'bg-destructive/10 text-destructive'}`}>
                   {status}
                 </Badge>
               )}
            </div>
            <div className="flex items-center gap-3 text-xs font-mono font-medium">
              <span className="flex items-center gap-1">
                <span className="text-muted-foreground">LAT:</span> {lat.toFixed(6)}
              </span>
              <span className="flex items-center gap-1">
                <span className="text-muted-foreground">LNG:</span> {lng.toFixed(6)}
              </span>
              <span className="flex items-center gap-1 text-primary">
                <Navigation className="h-3 w-3" /> {radius}m
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
           <Button 
            variant="secondary" 
            size="sm" 
            className="h-10 rounded-xl bg-background/90 shadow-xl backdrop-blur-md ring-1 ring-border"
            onClick={() => {
              if (mapRef.current) {
                mapRef.current.setView([lat, lng], 18, { animate: true });
              }
            }}
           >
             <MapPin className="mr-2 h-4 w-4 text-primary" />
             Center Office
           </Button>
        </div>
      </div>
    </div>
  );
}
