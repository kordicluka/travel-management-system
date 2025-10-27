import { Building2, MapPin, Edit, Trash2, Plane } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { routePaths } from "@/router/routePaths";
import type { AirlineResponse } from "@/types";

interface AirlineCardProps {
  airline: AirlineResponse;
  onDelete: (id: string) => void;
}

export function AirlineCard({ airline, onDelete }: AirlineCardProps) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Link to={routePaths.airlineDetail(airline.id)} className="group">
              <CardTitle className="text-lg group-hover:text-primary transition-colors truncate flex items-center gap-2">
                <Building2 className="h-5 w-5 shrink-0" />
                {airline.name}
              </CardTitle>
            </Link>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {airline.baseCountry}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Stats */}
          <div className="flex gap-3 flex-wrap">
            {airline.servicedAirports && (
              <Badge variant="secondary" className="text-xs">
                <Plane className="mr-1.5 h-3 w-3" />
                {airline.servicedAirports.length} Airports
              </Badge>
            )}
            {airline.operatedRoutes && (
              <Badge variant="secondary" className="text-xs">
                {airline.operatedRoutes.length} Routes
              </Badge>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link to={routePaths.airlineDetail(airline.id)}>
                <Building2 className="mr-2 h-4 w-4" />
                View
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to={routePaths.airlineEdit(airline.id)}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(airline.id)}
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
