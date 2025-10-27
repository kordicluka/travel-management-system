import { ArrowRight, Edit, Trash2, Plane } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { routePaths } from '@/router/routePaths';
import type { RouteResponse } from '@/types';

interface RouteCardProps {
  route: RouteResponse;
  onDelete: (id: string) => void;
}

export function RouteCard({ route, onDelete }: RouteCardProps) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Link
              to={routePaths.routeDetail(route.id)}
              className="group"
            >
              <CardTitle className="text-lg group-hover:text-primary transition-colors flex items-center gap-2">
                <Plane className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">
                  {route.fromAirport?.code || '???'} → {route.toAirport?.code || '???'}
                </span>
              </CardTitle>
            </Link>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Route Details */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{route.fromAirport?.code || '???'}</span>
              <span className="text-muted-foreground truncate flex-1">
                {route.fromAirport?.name || 'Unknown'}
              </span>
            </div>
            <div className="flex items-center justify-center">
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{route.toAirport?.code || '???'}</span>
              <span className="text-muted-foreground truncate flex-1">
                {route.toAirport?.name || 'Unknown'}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-3 flex-wrap">
            <Badge variant="secondary" className="text-xs">
              {route.airline?.name || 'Unknown'}
            </Badge>
            {route.distanceKm && (
              <Badge variant="outline" className="text-xs">
                {route.distanceKm} km
              </Badge>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              asChild
            >
              <Link to={routePaths.routeDetail(route.id)}>
                <Plane className="mr-2 h-4 w-4" />
                View
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <Link to={routePaths.routeEdit(route.id)}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(route.id)}
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
