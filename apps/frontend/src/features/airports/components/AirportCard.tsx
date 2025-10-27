import { MapPin, Plane, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { routePaths } from '@/router/routePaths';
import type { Airport } from '@/types';

interface AirportCardProps {
  airport: Airport;
  onDelete: (id: string) => void;
  isSelected?: boolean;
}

export function AirportCard({ airport, onDelete, isSelected }: AirportCardProps) {
  return (
    <Card
      className={`transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Link
              to={routePaths.airportDetail(airport.id)}
              className="group"
            >
              <CardTitle className="text-lg group-hover:text-primary transition-colors truncate">
                {airport.name}
              </CardTitle>
            </Link>
            <CardDescription className="mt-1 flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="font-mono">
                {airport.code}
              </Badge>
              <span className="flex items-center gap-1 text-xs">
                <MapPin className="h-3 w-3" />
                {airport.country}
              </span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Coordinates */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Latitude:</span>
              <p className="font-mono text-xs mt-0.5">
                {airport.latitude.toFixed(6)}°
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Longitude:</span>
              <p className="font-mono text-xs mt-0.5">
                {airport.longitude.toFixed(6)}°
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              asChild
            >
              <Link to={routePaths.airportDetail(airport.id)}>
                <Plane className="mr-2 h-4 w-4" />
                View
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <Link to={routePaths.airportEdit(airport.id)}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(airport.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
