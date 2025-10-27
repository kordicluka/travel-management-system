import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Airport } from "@/types";

interface SingleAirportMapProps {
  airport: Airport;
  className?: string;
  zoom?: number;
}

export function SingleAirportMap({
  airport,
  className = "",
  zoom = 8,
}: SingleAirportMapProps) {
  const center: [number, number] = [airport.latitude, airport.longitude];

  return (
    <div className={`h-full w-full ${className}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="h-full w-full rounded-lg"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={center}>
          <Popup>
            <div className="min-w-[200px]">
              <h3 className="font-semibold text-base mb-1">{airport.name}</h3>
              <p className="text-sm text-muted-foreground mb-1">
                <span className="font-medium">{airport.code}</span> •{" "}
                {airport.country}
              </p>
              <p className="text-xs text-muted-foreground">
                {airport.latitude.toFixed(6)}°, {airport.longitude.toFixed(6)}°
              </p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
