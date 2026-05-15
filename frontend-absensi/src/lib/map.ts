import L from "leaflet";

export const MAP_TILES = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
export const MAP_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
export const DEFAULT_CENTER: [number, number] = [-6.200000, 106.816666]; // Jakarta
export const DEFAULT_ZOOM = 13;

// Modern Custom Marker Icon
export const createCustomIcon = (color: string = "#3b82f6") => {
  return L.divIcon({
    className: "custom-div-icon",
    html: `
      <div style="background-color: ${color};" class="marker-pin"></div>
      <div class="marker-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 21v-8a3 3 0 0 0-6 0v8"/><rect width="18" height="12" x="3" y="5" rx="2"/><path d="M7 21h10"/></svg>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

// Global styles for custom marker
export const MAP_MARKER_STYLES = `
  .marker-pin {
    width: 40px;
    height: 40px;
    border-radius: 50% 50% 50% 0;
    position: absolute;
    transform: rotate(-45deg);
    left: 50%;
    top: 50%;
    margin: -20px 0 0 -20px;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    border: 3px solid white;
  }

  .marker-icon {
    position: absolute;
    width: 20px;
    height: 20px;
    left: 50%;
    top: 50%;
    margin: -13px 0 0 -10px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }

  .leaflet-container {
    width: 100%;
    height: 100%;
    background: #f8fafc;
  }

  .dark .leaflet-container {
    background: #020617;
  }

  .dark .leaflet-tile {
    filter: brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7);
  }

  .dark .leaflet-control-attribution,
  .dark .leaflet-control-zoom-in,
  .dark .leaflet-control-zoom-out {
    background-color: #1e293b !important;
    color: #f8fafc !important;
    border-color: #334155 !important;
  }

/**
 * Calculate distance between two coordinates in meters using Haversine formula
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const p1 = (lat1 * Math.PI) / 180;
  const p2 = (lat2 * Math.PI) / 180;
  const dp = ((lat2 - lat1) * Math.PI) / 180;
  const dl = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dp / 2) * Math.sin(dp / 2) +
    Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) * Math.sin(dl / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

`;
