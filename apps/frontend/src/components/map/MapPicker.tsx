import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapPickerProps {
  latitude?: number;
  longitude?: number;
  onLocationChange: (lat: number, lng: number, country?: string) => void;
  centerLat?: number;
  centerLng?: number;
  className?: string;
}

// Component to programmatically update map view
function MapUpdater({ lat, lng }: { lat?: number; lng?: number }) {
  const map = useMap();

  useEffect(() => {
    if (lat !== undefined && lng !== undefined) {
      map.flyTo([lat, lng], 6, { duration: 1.5 });
    }
  }, [lat, lng, map]);

  return null;
}

// Component to handle map clicks and marker dragging
function LocationMarker({
  position,
  onPositionChange,
}: {
  position: [number, number] | null;
  onPositionChange: (lat: number, lng: number) => void;
}) {
  const [markerPosition, setMarkerPosition] = useState(position);
  const markerRef = useRef<L.Marker>(null);

  // Handle map clicks
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setMarkerPosition([lat, lng]);
      onPositionChange(lat, lng);
    },
  });

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker) {
          const { lat, lng } = marker.getLatLng();
          setMarkerPosition([lat, lng]);
          onPositionChange(lat, lng);
        }
      },
    }),
    [onPositionChange]
  );

  if (!markerPosition) return null;

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={markerPosition}
      ref={markerRef}
    />
  );
}

export function MapPicker({
  latitude,
  longitude,
  onLocationChange,
  centerLat,
  centerLng,
  className = "",
}: MapPickerProps) {
  const initialPosition: [number, number] | null =
    latitude !== undefined && longitude !== undefined
      ? [latitude, longitude]
      : null;

  // Default center - World view if no initial position
  const center: [number, number] = initialPosition || [20, 0];

  const handlePositionChange = useCallback(
    async (lat: number, lng: number) => {
      // Try reverse geocoding to get country name
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`
        );
        const data = await response.json();
        const country = data.address?.country;

        console.log("Country from Nominatim (EN):", country);

        onLocationChange(lat, lng, country);
      } catch (error) {
        // If reverse geocoding fails, just send coordinates
        console.warn("Reverse geocoding failed:", error);
        onLocationChange(lat, lng);
      }
    },
    [onLocationChange]
  );

  return (
    <div className={`relative h-full w-full ${className}`}>
      <div className="absolute top-2 left-2 z-[400] bg-background/90 backdrop-blur-sm px-3 py-2 rounded-md shadow-md text-sm">
        <p className="font-medium mb-1">Click map to select location</p>
        <p className="text-xs text-muted-foreground">
          {initialPosition
            ? `${initialPosition[0].toFixed(4)}°, ${initialPosition[1].toFixed(4)}°`
            : "No location selected"}
        </p>
      </div>

      <MapContainer
        center={center}
        zoom={2}
        scrollWheelZoom={true}
        className="h-full w-full rounded-lg"
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker
          position={initialPosition}
          onPositionChange={handlePositionChange}
        />
        <MapUpdater lat={centerLat} lng={centerLng} />
      </MapContainer>
    </div>
  );
}
