import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import { Icon, LatLngBounds } from "leaflet";
import type { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { RouteResponse } from "@/types";

// Fix for default marker icon in production builds
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (
  Icon.Default.prototype as {
    _getIconUrl?: () => string;
  }
)._getIconUrl;
Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface SingleRouteMapProps {
  route: RouteResponse;
  className?: string;
}

// Component to fit bounds when route changes
function MapBoundsSetter({ route }: { route: RouteResponse }) {
  const map = useMap();

  useEffect(() => {
    if (!route.fromAirport || !route.toAirport) return;

    const coordinates: LatLngTuple[] = [
      [route.fromAirport.latitude, route.fromAirport.longitude],
      [route.toAirport.latitude, route.toAirport.longitude],
    ];

    const bounds = new LatLngBounds(coordinates);
    map.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 8,
    });
  }, [route, map]);

  return null;
}

export function SingleRouteMap({ route, className = "" }: SingleRouteMapProps) {
  if (!route.fromAirport || !route.toAirport) {
    return (
      <div
        className={`h-full w-full flex items-center justify-center bg-muted rounded-lg ${className}`}
      >
        <p className="text-muted-foreground">Route information incomplete</p>
      </div>
    );
  }

  // Calculate center between the two airports
  const centerLat = (route.fromAirport.latitude + route.toAirport.latitude) / 2;
  const centerLng =
    (route.fromAirport.longitude + route.toAirport.longitude) / 2;
  const center: LatLngTuple = [centerLat, centerLng];

  const positions: LatLngTuple[] = [
    [route.fromAirport.latitude, route.fromAirport.longitude],
    [route.toAirport.latitude, route.toAirport.longitude],
  ];

  return (
    <div className={`h-full w-full ${className}`}>
      <MapContainer
        center={center}
        zoom={4}
        scrollWheelZoom={true}
        className="h-full w-full rounded-lg"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapBoundsSetter route={route} />

        {/* Draw the route line */}
        <Polyline
          positions={positions}
          pathOptions={{
            color: "#3b82f6",
            weight: 3,
            opacity: 0.8,
          }}
        />

        {/* From Airport Marker */}
        <Marker
          position={[route.fromAirport.latitude, route.fromAirport.longitude]}
        >
          <Popup>
            <div className="min-w-[200px]">
              <div className="text-xs font-semibold text-muted-foreground mb-1">
                DEPARTURE
              </div>
              <h3 className="font-semibold text-base mb-1">
                {route.fromAirport.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-1">
                <span className="font-medium">{route.fromAirport.code}</span> •{" "}
                {route.fromAirport.country}
              </p>
              <p className="text-xs text-muted-foreground">
                {route.fromAirport.latitude.toFixed(6)}°,{" "}
                {route.fromAirport.longitude.toFixed(6)}°
              </p>
            </div>
          </Popup>
        </Marker>

        {/* To Airport Marker */}
        <Marker
          position={[route.toAirport.latitude, route.toAirport.longitude]}
        >
          <Popup>
            <div className="min-w-[200px]">
              <div className="text-xs font-semibold text-muted-foreground mb-1">
                ARRIVAL
              </div>
              <h3 className="font-semibold text-base mb-1">
                {route.toAirport.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-1">
                <span className="font-medium">{route.toAirport.code}</span> •{" "}
                {route.toAirport.country}
              </p>
              <p className="text-xs text-muted-foreground">
                {route.toAirport.latitude.toFixed(6)}°,{" "}
                {route.toAirport.longitude.toFixed(6)}°
              </p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
