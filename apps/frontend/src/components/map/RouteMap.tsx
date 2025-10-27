import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { Icon, LatLngBounds, type LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { RouteResponse } from '@/types';

// Fix for default marker icon in production builds
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface RouteMapProps {
  routes: RouteResponse[];
  selectedRouteId?: string | null;
  onRouteClick?: (route: RouteResponse) => void;
  className?: string;
}

// Component to fit bounds when routes change
function MapBoundsSetter({ routes }: { routes: RouteResponse[] }) {
  const map = useMap();

  useEffect(() => {
    if (!routes.length) return;

    // Collect all unique airport coordinates
    const coordinates: LatLngTuple[] = [];
    routes.forEach((route) => {
      if (route.fromAirport) {
        coordinates.push([route.fromAirport.latitude, route.fromAirport.longitude]);
      }
      if (route.toAirport) {
        coordinates.push([route.toAirport.latitude, route.toAirport.longitude]);
      }
    });

    if (coordinates.length === 0) return;

    // Create bounds and fit map
    const bounds = new LatLngBounds(coordinates);
    map.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 10,
    });
  }, [routes, map]);

  return null;
}

export function RouteMap({ routes, selectedRouteId, onRouteClick, className = '' }: RouteMapProps) {
  // Calculate center based on all routes
  const center: LatLngTuple = useMemo(() => {
    if (routes.length === 0) {
      return [20, 0]; // Default center (roughly center of world)
    }

    let totalLat = 0;
    let totalLng = 0;
    let count = 0;

    routes.forEach((route) => {
      if (route.fromAirport) {
        totalLat += route.fromAirport.latitude;
        totalLng += route.fromAirport.longitude;
        count++;
      }
      if (route.toAirport) {
        totalLat += route.toAirport.latitude;
        totalLng += route.toAirport.longitude;
        count++;
      }
    });

    if (count === 0) return [20, 0];

    return [totalLat / count, totalLng / count];
  }, [routes]);

  // Group routes by unique airports for markers
  const airports = useMemo(() => {
    const airportMap = new Map();

    routes.forEach((route) => {
      if (route.fromAirport) {
        airportMap.set(route.fromAirport.id, route.fromAirport);
      }
      if (route.toAirport) {
        airportMap.set(route.toAirport.id, route.toAirport);
      }
    });

    return Array.from(airportMap.values());
  }, [routes]);

  return (
    <div className={`relative h-full w-full rounded-lg overflow-hidden border ${className}`}>
      <MapContainer
        center={center}
        zoom={2}
        scrollWheelZoom={true}
        className="h-full w-full"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapBoundsSetter routes={routes} />

        {/* Draw polylines for each route */}
        {routes.map((route) => {
          if (!route.fromAirport || !route.toAirport) return null;

          const isSelected = selectedRouteId === route.id;
          const positions: LatLngTuple[] = [
            [route.fromAirport.latitude, route.fromAirport.longitude],
            [route.toAirport.latitude, route.toAirport.longitude],
          ];

          return (
            <Polyline
              key={route.id}
              positions={positions}
              pathOptions={{
                color: isSelected ? '#3b82f6' : '#6366f1',
                weight: isSelected ? 4 : 2,
                opacity: isSelected ? 1 : 0.6,
                dashArray: isSelected ? undefined : '5, 10',
              }}
              eventHandlers={{
                click: () => {
                  if (onRouteClick) {
                    onRouteClick(route);
                  }
                },
                mouseover: (e) => {
                  const polyline = e.target;
                  polyline.setStyle({
                    weight: 4,
                    opacity: 1,
                  });
                },
                mouseout: (e) => {
                  const polyline = e.target;
                  if (!isSelected) {
                    polyline.setStyle({
                      weight: 2,
                      opacity: 0.6,
                    });
                  }
                },
              }}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <div className="font-semibold text-base mb-2">
                    {route.fromAirport.code} → {route.toAirport.code}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="text-muted-foreground">From:</span>{' '}
                      <span className="font-medium">{route.fromAirport.name}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">To:</span>{' '}
                      <span className="font-medium">{route.toAirport.name}</span>
                    </div>
                    {route.airline && (
                      <div>
                        <span className="text-muted-foreground">Airline:</span>{' '}
                        <span className="font-medium">{route.airline.name}</span>
                      </div>
                    )}
                    {route.distanceKm && (
                      <div>
                        <span className="text-muted-foreground">Distance:</span>{' '}
                        <span className="font-medium">{route.distanceKm} km</span>
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Polyline>
          );
        })}

        {/* Draw markers for all airports */}
        {airports.map((airport) => (
          <Marker
            key={airport.id}
            position={[airport.latitude, airport.longitude]}
          >
            <Popup>
              <div className="min-w-[150px]">
                <div className="font-semibold text-base mb-1">
                  {airport.code}
                </div>
                <div className="text-sm">
                  <div className="font-medium">{airport.name}</div>
                  <div className="text-muted-foreground">{airport.country}</div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {routes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm pointer-events-none">
          <div className="text-center">
            <p className="text-muted-foreground">No routes to display</p>
          </div>
        </div>
      )}
    </div>
  );
}
