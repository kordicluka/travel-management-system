import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Edit, Trash2, Globe, Plane, ArrowRight, MapPin } from "lucide-react";
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
import { routePaths } from "@/router/routePaths";
import { useAirline, useDeleteAirline } from "../hooks";

export function AirlineDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const {
    data: airline,
    isLoading,
    error,
  } = useAirline(id || "", {
    include: ["servicedAirports", "operatedRoutes"],
  });
  const deleteAirline = useDeleteAirline();

  const handleDelete = async () => {
    if (!id) return;

    try {
      await deleteAirline.mutateAsync(id);
      toast.success("Airline deleted successfully");
      navigate(routePaths.airlines());
    } catch (error) {
      toast.error("Failed to delete airline", {
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
          title="Airline Details"
          action={
            <Button
              variant="outline"
              onClick={() => navigate(routePaths.airlines())}
            >
              Back
            </Button>
          }
        />
        <LoadingSpinner text="Loading airline details..." />
      </div>
    );
  }

  if (error || !airline) {
    return (
      <div>
        <PageHeader
          title="Airline Details"
          action={
            <Button
              variant="outline"
              onClick={() => navigate(routePaths.airlines())}
            >
              Back
            </Button>
          }
        />
        <ErrorMessage
          title="Failed to load airline"
          message={error instanceof Error ? error.message : "Airline not found"}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={airline.name}
        action={
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              onClick={() => navigate(routePaths.airlines())}
              size="sm"
            >
              Back
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(routePaths.airlineEdit(airline.id))}
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

      {/* Hero Section */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Globe className="h-6 w-6 text-muted-foreground" />
          <span className="text-xl font-semibold">{airline.baseCountry}</span>
        </div>
        <div className="flex gap-3">
          <Badge variant="outline" className="text-sm">
            <Plane className="mr-1.5 h-3.5 w-3.5" />
            {airline.servicedAirports?.length || 0} Airports
          </Badge>
          <Badge variant="outline" className="text-sm">
            <MapPin className="mr-1.5 h-3.5 w-3.5" />
            {airline.operatedRoutes?.length || 0} Routes
          </Badge>
        </div>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* Serviced Airports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plane className="h-5 w-5" />
              Serviced Airports ({airline.servicedAirports?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {airline.servicedAirports && airline.servicedAirports.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {airline.servicedAirports.map((airport) => (
                  <Link
                    key={airport.id}
                    to={routePaths.airportDetail(airport.id)}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors group"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium group-hover:text-primary transition-colors truncate">
                        {airport.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {airport.code} · {airport.country}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 ml-2" />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No airports currently serviced
              </p>
            )}
          </CardContent>
        </Card>

        {/* Operated Routes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5" />
              Operated Routes ({airline.operatedRoutes?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {airline.operatedRoutes && airline.operatedRoutes.length > 0 ? (
              <div className="space-y-2">
                {airline.operatedRoutes.map((route) => (
                  <Link
                    key={route.id}
                    to={routePaths.routeDetail(route.id)}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium group-hover:text-primary transition-colors truncate">
                        {route.fromAirport?.name || "Unknown"} →{" "}
                        {route.toAirport?.name || "Unknown"}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <span>
                          {route.fromAirport?.code || "???"} →{" "}
                          {route.toAirport?.code || "???"}
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
                No routes currently operated
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
                  {new Date(airline.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">Last Updated</span>
                <span className="font-medium text-right">
                  {new Date(airline.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between items-start pt-2 border-t">
                <span className="text-muted-foreground">Airline ID</span>
                <span className="font-mono text-xs text-muted-foreground max-w-[200px] truncate">
                  {airline.id}
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
        title="Delete Airline"
        description={
          <>
            Are you sure you want to delete <strong>{airline.name}</strong>?
            {airline.operatedRoutes && airline.operatedRoutes.length > 0 ? (
              <>
                <br />
                <br />
                <span className="text-destructive font-semibold">
                  Warning: This will also permanently delete{" "}
                  {airline.operatedRoutes.length} route(s) operated by this
                  airline.
                </span>
              </>
            ) : null}
            <br />
            <br />
            This action cannot be undone.
          </>
        }
        isLoading={deleteAirline.isPending}
      />
    </div>
  );
}
