import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Edit, Trash2, ArrowRight, MapPin, Plane, Ruler, Map as MapIcon } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader, LoadingSpinner, ErrorMessage, DeleteConfirmDialog } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SingleRouteMap } from '@/components/map';
import { routePaths } from '@/router/routePaths';
import { useRoute, useDeleteRoute } from '../hooks';

export function RouteDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: route, isLoading, error } = useRoute(id || '', {
    include: ['fromAirport', 'toAirport', 'airline'],
  });
  const deleteRoute = useDeleteRoute();

  const handleDelete = async () => {
    if (!id) return;

    try {
      await deleteRoute.mutateAsync(id);
      toast.success('Route deleted successfully');
      navigate(routePaths.routes());
    } catch (error) {
      toast.error('Failed to delete route', {
        description: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setShowDeleteDialog(false);
    }
  };

  if (isLoading) {
    return (
      <div>
        <PageHeader
          title="Route Details"
          action={
            <Button variant="outline" onClick={() => navigate(routePaths.routes())}>
              Back
            </Button>
          }
        />
        <LoadingSpinner text="Loading route details..." />
      </div>
    );
  }

  if (error || !route) {
    return (
      <div>
        <PageHeader
          title="Route Details"
          action={
            <Button variant="outline" onClick={() => navigate(routePaths.routes())}>
              Back
            </Button>
          }
        />
        <ErrorMessage
          title="Failed to load route"
          message={error instanceof Error ? error.message : 'Route not found'}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${route.fromAirport?.code || '???'} → ${route.toAirport?.code || '???'}`}
        action={
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={() => navigate(routePaths.routes())} size="sm">
              Back
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(routePaths.routeEdit(route.id))}
              size="sm"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              size="sm"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        }
      />

      {/* Hero Section with Route Overview */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-8">
            <div className="text-center flex-1">
              <div className="text-5xl font-bold mb-2">{route.fromAirport?.code || '???'}</div>
              <div className="text-sm text-muted-foreground mb-1">{route.fromAirport?.country || 'Unknown'}</div>
              <div className="text-xs text-muted-foreground">{route.fromAirport?.name || 'Unknown Airport'}</div>
            </div>

            <div className="flex flex-col items-center">
              <ArrowRight className="h-12 w-12 text-primary" />
              {route.distanceKm && (
                <Badge variant="secondary" className="mt-2">
                  <Ruler className="mr-1.5 h-3.5 w-3.5" />
                  {route.distanceKm} km
                </Badge>
              )}
            </div>

            <div className="text-center flex-1">
              <div className="text-5xl font-bold mb-2">{route.toAirport?.code || '???'}</div>
              <div className="text-sm text-muted-foreground mb-1">{route.toAirport?.country || 'Unknown'}</div>
              <div className="text-xs text-muted-foreground">{route.toAirport?.name || 'Unknown Airport'}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Route Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapIcon className="h-5 w-5" />
            Route Visualization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <SingleRouteMap route={route} />
          </div>
        </CardContent>
      </Card>

      <div className="max-w-4xl space-y-6">
        {/* Departure Airport */}
        {route.fromAirport && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Departure Airport
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                to={routePaths.airportDetail(route.fromAirport.id)}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors group"
              >
                <div className="flex-1">
                  <p className="font-medium text-lg group-hover:text-primary transition-colors">
                    {route.fromAirport.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {route.fromAirport.code} · {route.fromAirport.country}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {route.fromAirport.latitude.toFixed(4)}°, {route.fromAirport.longitude.toFixed(4)}°
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Arrival Airport */}
        {route.toAirport && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Arrival Airport
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                to={routePaths.airportDetail(route.toAirport.id)}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors group"
              >
                <div className="flex-1">
                  <p className="font-medium text-lg group-hover:text-primary transition-colors">
                    {route.toAirport.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {route.toAirport.code} · {route.toAirport.country}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {route.toAirport.latitude.toFixed(4)}°, {route.toAirport.longitude.toFixed(4)}°
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Operating Airline */}
        {route.airline && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="h-5 w-5" />
                Operating Airline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                to={routePaths.airlineDetail(route.airline.id)}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors group"
              >
                <div className="flex-1">
                  <p className="font-medium text-lg group-hover:text-primary transition-colors">
                    {route.airline.name}
                  </p>
                  <p className="text-sm text-muted-foreground">Base: {route.airline.baseCountry}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Metadata Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">System Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">Created</span>
                <span className="font-medium text-right">
                  {new Date(route.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">Last Updated</span>
                <span className="font-medium text-right">
                  {new Date(route.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex justify-between items-start pt-2 border-t">
                <span className="text-muted-foreground">Route ID</span>
                <span className="font-mono text-xs text-muted-foreground max-w-[200px] truncate">
                  {route.id}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Route"
        description="Are you sure you want to delete this route? This action cannot be undone."
        isLoading={deleteRoute.isPending}
      />
    </div>
  );
}
