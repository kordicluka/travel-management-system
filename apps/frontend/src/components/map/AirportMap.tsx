import React, { useEffect, useRef, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Marker as LeafletMarker } from "leaflet"; // Import LeafletMarker type
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";
import type { Airport } from "@/types";

export interface MapBounds {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
}

interface AirportMapProps {
  airports: Airport[];
  selectedAirportId?: string | null;
  initialBounds?: MapBounds | null;
  onAirportClick?: (airport: Airport) => void;
  onBoundsChange?: (bounds: MapBounds, isUserInteraction?: boolean) => void;
  className?: string;
}

function MapController({ airport }: { airport: Airport | null }) {
  const map = useMap();
  const prevAirportIdRef = React.useRef<string | null>(null);

  useEffect(() => {
    if (!airport) {
      return;
    }

    if (prevAirportIdRef.current === airport.id) {
      return;
    }
    prevAirportIdRef.current = airport.id;

    const lat = airport.latitude;
    const lng = airport.longitude;

    const isValidLat =
      typeof lat === "number" && !isNaN(lat) && lat >= -90 && lat <= 90;
    const isValidLng =
      typeof lng === "number" && !isNaN(lng) && lng >= -180 && lng <= 180;

    if (isValidLat && isValidLng) {
      try {
        map.setView([lat, lng], 6);
      } catch (error) {
        console.error("setView failed:", error);
      }
    } else {
      console.error("Invalid coordinates! Cannot set view to:", lat, lng);
    }
  }, [airport, map]);

  return null;
}

function MapInitializer({
  initialBounds,
}: {
  initialBounds: MapBounds | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (initialBounds) {
      const leafletBounds: [[number, number], [number, number]] = [
        [initialBounds.minLat, initialBounds.minLon],
        [initialBounds.maxLat, initialBounds.maxLon],
      ];
      map.fitBounds(leafletBounds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  return null;
}

function BoundsTracker({
  onBoundsChange,
  initialBounds,
}: {
  onBoundsChange?: (bounds: MapBounds, isUserInteraction?: boolean) => void;
  initialBounds: MapBounds | null;
}) {
  const map = useMapEvents({
    moveend: () => {
      if (onBoundsChange) {
        const bounds = map.getBounds();
        onBoundsChange(
          {
            minLat: bounds.getSouth(),
            maxLat: bounds.getNorth(),
            minLon: bounds.getWest(),
            maxLon: bounds.getEast(),
          },
          true
        );
      }
    },
  });

  useEffect(() => {
    // Do not fire on initial load if initialBounds are provided,
    // as the view is already being set.
    if (onBoundsChange && !initialBounds) {
      const bounds = map.getBounds();
      onBoundsChange(
        {
          minLat: bounds.getSouth(),
          maxLat: bounds.getNorth(),
          minLon: bounds.getWest(),
          maxLon: bounds.getEast(),
        },
        false
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  return null;
}

export function AirportMap({
  airports,
  selectedAirportId,
  initialBounds = null,
  onAirportClick,
  onBoundsChange,
  className = "",
}: AirportMapProps) {
  const markerRefs = useRef<Record<string, LeafletMarker | null>>({});

  const selectedAirport = useMemo(
    () => airports.find((a) => a.id === selectedAirportId) || null,
    [airports, selectedAirportId]
  );

  useEffect(() => {
    if (selectedAirportId && markerRefs.current[selectedAirportId]) {
      // Small timeout ensures map view settles before opening popup after setView
      const timer = setTimeout(() => {
        const marker = markerRefs.current[selectedAirportId];
        if (marker && !marker.isPopupOpen()) {
          marker.openPopup();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [selectedAirportId]);

  const center: [number, number] = [20, 0];

  return (
    <div className={`h-full w-full ${className}`}>
      <MapContainer
        center={center}
        zoom={2}
        scrollWheelZoom={true}
        className="h-full w-full rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={50}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
        >
          {airports.map((airport) => (
            <Marker
              key={airport.id}
              position={[airport.latitude, airport.longitude]}
              ref={(el: LeafletMarker | null) => {
                markerRefs.current[airport.id] = el;
              }}
              eventHandlers={{
                click: (e) => {
                  onAirportClick?.(airport);
                  e.target.openPopup();
                },
              }}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <h3 className="font-semibold text-base mb-1">
                    {airport.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-1">
                    <span className="font-medium">{airport.code}</span> •{" "}
                    {airport.country}
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {airport.latitude.toFixed(4)}°,{" "}
                    {airport.longitude.toFixed(4)}°
                  </p>
                  <Link
                    to={`/airports/${airport.id}`}
                    className="text-sm text-primary hover:underline font-medium"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Details →
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>

        <MapInitializer initialBounds={initialBounds} />
        <MapController airport={selectedAirport} />
        <BoundsTracker
          onBoundsChange={onBoundsChange}
          initialBounds={initialBounds}
        />
      </MapContainer>
    </div>
  );
}
