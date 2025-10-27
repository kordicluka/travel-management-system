import { useNavigate } from 'react-router-dom';
import { Edit, Eye, Trash2 } from 'lucide-react';
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

// Extended Airline type to include relations
interface AirlineWithRelations {
  id: string;
  name: string;
  baseCountry: string;
  createdAt: Date;
  updatedAt: Date;
  servicedAirports?: Array<{
    id: string;
    code: string;
    name: string;
  }>;
}

interface AirlineTableProps {
  airlines: AirlineWithRelations[];
  onDelete?: (id: string) => void;
}

export function AirlineTable({ airlines, onDelete }: AirlineTableProps) {
  const navigate = useNavigate();

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Base Country</TableHead>
            <TableHead># Airports</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {airlines.map((airline) => (
            <TableRow
              key={airline.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => navigate(routePaths.airlineDetail(airline.id))}
            >
              <TableCell className="font-medium">{airline.name}</TableCell>
              <TableCell>{airline.baseCountry}</TableCell>
              <TableCell>
                {airline.servicedAirports && airline.servicedAirports.length > 0 ? (
                  <Badge variant="secondary">
                    {airline.servicedAirports.length}
                  </Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">0</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(routePaths.airlineDetail(airline.id))}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(routePaths.airlineEdit(airline.id))}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete?.(airline.id)}
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
