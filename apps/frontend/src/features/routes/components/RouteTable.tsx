import { useNavigate } from 'react-router-dom';
import { Edit, Eye, Trash2, ArrowRight } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { routePaths } from '@/router/routePaths';

// Extended Route type to include relations
interface RouteWithRelations {
  id: string;
  fromAirportId: string;
  toAirportId: string;
  airlineId: string;
  distanceKm: number | null;
  createdAt: Date;
  updatedAt: Date;
  fromAirport?: {
    id: string;
    code: string;
    name: string;
    country: string;
  };
  toAirport?: {
    id: string;
    code: string;
    name: string;
    country: string;
  };
  airline?: {
    id: string;
    name: string;
    baseCountry: string;
  };
}

interface RouteTableProps {
  routes: RouteWithRelations[];
  onDelete?: (id: string) => void;
}

export function RouteTable({ routes, onDelete }: RouteTableProps) {
  const navigate = useNavigate();

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>From</TableHead>
            <TableHead></TableHead>
            <TableHead>To</TableHead>
            <TableHead>Airline</TableHead>
            <TableHead>Distance</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {routes.map((route) => (
            <TableRow
              key={route.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => navigate(routePaths.routeDetail(route.id))}
            >
              <TableCell>
                <div>
                  <p className="font-medium">{route.fromAirport?.code || '???'}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                    {route.fromAirport?.name || 'Unknown'}
                  </p>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{route.toAirport?.code || '???'}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                    {route.toAirport?.name || 'Unknown'}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-[200px]">
                  <p className="truncate">{route.airline?.name || 'Unknown'}</p>
                </div>
              </TableCell>
              <TableCell>
                {route.distanceKm ? (
                  <Badge variant="secondary">{route.distanceKm} km</Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(routePaths.routeDetail(route.id))}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(routePaths.routeEdit(route.id))}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete?.(route.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
