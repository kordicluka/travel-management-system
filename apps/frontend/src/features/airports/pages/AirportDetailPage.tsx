import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Edit,
  Trash2,
  MapPin,
  Globe,
  Navigation,
  Plane,
  ArrowRight,
  ArrowLeft,
  Map as MapIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  PageHeader,
  LoadingSpinner,
  ErrorMessage,
  DeleteConfirmDialog,
} from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SingleAirportMap } from "@/components/map/SingleAirportMap";
import { routePaths } from "@/router/routePaths";
import { useAirport, useDeleteAirport } from "../hooks";

export function AirportDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const {
    data: airport,
    isLoading,
    error,
  } = useAirport(id || "", {
    include: ["servicedByAirlines", "routesFrom", "routesTo"],
  });
  const deleteAirport = useDeleteAirport();

  const handleDelete = async () => {
    if (!id) return;

    try {
      await deleteAirport.mutateAsync(id);
      toast.success("Airport deleted successfully");
      navigate(routePaths.airports());
    } catch (error) {
      toast.error("Failed to delete airport", {
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setShowDeleteDialog(false);
    }
  };

  if (isLoading) {
    return (
      <div>
        <PageHeader
          title="Airport Details"
          action={
            <Button
              variant="outline"
              onClick={() => navigate(routePaths.airports())}
            >
              Back
            </Button>
          }
        />
        <LoadingSpinner text="Loading airport details..." />
      </div>
    );
  }

  if (error || !airport) {
    return (
      <div>
        <PageHeader
          title="Airport Details"
          action={
            <Button
              variant="outline"
              onClick={() => navigate(routePaths.airports())}
            >
              Back
            </Button>
          }
        />
        <ErrorMessage
          title="Failed to load airport"
          message={error instanceof Error ? error.message : "Airport not found"}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={airport.name}
        action={
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              onClick={() => navigate(routePaths.airports())}
              size="sm"
            >
              Back
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(routePaths.airportEdit(airport.id))}
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

      {/* Hero Section with Code and Country */}
      <div className="flex items-center gap-4 flex-wrap">
        <Badge variant="outline" className="text-2xl font-bold px-4 py-2">
          {airport.code}
        </Badge>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Globe className="h-5 w-5" />
          <span className="text-lg">{airport.country}</span>
        </div>
      </div>

      {/* Main Content Grid: Map + Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map Section */}
        <Card className="lg:sticky lg:top-6 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapIcon className="h-5 w-5" />
              Location Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <SingleAirportMap airport={airport} zoom={8} />
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3">
                <Navigation className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Coordinates
                  </p>
                  <p className="text-sm font-mono">
                    {airport.latitude.toFixed(6)}°,{" "}
                    {airport.longitude.toFixed(6)}°
                  </p>
                </div>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${airport.latitude},${airport.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
              >
                <MapPin className="h-4 w-4" />
                Open in Google Maps
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Information Sections */}
        <div className="space-y-6">
          {/* Airlines Servicing This Airport */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="h-5 w-5" />
                Airlines ({airport.servicedByAirlines?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {airport.servicedByAirlines &&
              airport.servicedByAirlines.length > 0 ? (
                <div className="space-y-2">
                  {airport.servicedByAirlines.map((airline) => (
                    <Link
                      key={airline.id}
                      to={routePaths.airlineDetail(airline.id)}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors group"
                    >
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">
                          {airline.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {airline.baseCountry}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No airlines currently service this airport
                </p>
              )}
            </CardContent>
          </Card>

          {/* Outbound Routes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="h-5 w-5" />
                Departing Flights ({airport.routesFrom?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {airport.routesFrom && airport.routesFrom.length > 0 ? (
                <div className="space-y-2">
                  {airport.routesFrom.map((route) => (
                    <Link
                      key={route.id}
                      to={routePaths.routeDetail(route.id)}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium group-hover:text-primary transition-colors truncate">
                          To {route.toAirport?.name || "Unknown"}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span className="truncate">
                            {route.airline?.name || "Unknown Airline"}
                          </span>
                          {route.distanceKm && (
                            <Badge variant="secondary" className="text-xs">
                              {route.distanceKm} km
                            </Badge>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 ml-2" />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No departing flights from this airport
                </p>
              )}
            </CardContent>
          </Card>

          {/* Inbound Routes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowLeft className="h-5 w-5" />
                Arriving Flights ({airport.routesTo?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {airport.routesTo && airport.routesTo.length > 0 ? (
                <div className="space-y-2">
                  {airport.routesTo.map((route) => (
                    <Link
                      key={route.id}
                      to={routePaths.routeDetail(route.id)}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium group-hover:text-primary transition-colors truncate">
                          From {route.fromAirport?.name || "Unknown"}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span className="truncate">
                            {route.airline?.name || "Unknown Airline"}
                          </span>
                          {route.distanceKm && (
                            <Badge variant="secondary" className="text-xs">
                              {route.distanceKm} km
                            </Badge>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 ml-2" />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No arriving flights to this airport
                </p>
              )}
            </CardContent>
          </Card>

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
                    {new Date(airport.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="font-medium text-right">
                    {new Date(airport.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-start pt-2 border-t">
                  <span className="text-muted-foreground">Airport ID</span>
                  <span className="font-mono text-xs text-muted-foreground max-w-[200px] truncate">
                    {airport.id}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Airport"
        description={
          <>
            Are you sure you want to delete <strong>{airport.name}</strong>?
            {(airport.routesFrom && airport.routesFrom.length > 0) ||
            (airport.routesTo && airport.routesTo.length > 0) ? (
              <>
                <br />
                <br />
                <span className="text-destructive font-semibold">
                  Warning: This will also permanently delete{" "}
                  {(airport.routesFrom?.length || 0) +
                    (airport.routesTo?.length || 0)}{" "}
                  route(s) associated with this airport.
                </span>
              </>
            ) : null}
            <br />
            <br />
            This action cannot be undone.
          </>
        }
        isLoading={deleteAirport.isPending}
      />
    </div>
  );
}
