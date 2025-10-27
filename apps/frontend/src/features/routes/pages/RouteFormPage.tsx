import { useParams } from "react-router-dom";
import { PageHeader, LoadingSpinner, ErrorMessage } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { routePaths } from "@/router/routePaths";
import { RouteForm } from "../components";
import { useRoute, useCreateRoute, useUpdateRoute } from "../hooks";
import { useEntityForm } from "@/hooks";
import type {
  Route,
  RouteCreateInput,
  RouteUpdateInput,
  RouteIncludeQuery,
} from "@/types";
export function RouteFormPage() {
  const { id } = useParams();

  const {
    entity: route,
    isLoading,
    loadError,
    isEdit,
    handleSubmit,
    isSubmitting,
    handleCancel,
  } = useEntityForm<
    Route,
    RouteCreateInput,
    RouteUpdateInput,
    RouteIncludeQuery
  >({
    id,
    useGetQuery: useRoute,
    queryOptions: { include: ["fromAirport", "toAirport", "airline"] },
    useCreateMutation: useCreateRoute,
    useUpdateMutation: useUpdateRoute,
    successRoute: routePaths.routes(),
    entityName: "route",
  });

  if (isEdit && isLoading) {
    return (
      <div>
        <PageHeader
          title="Edit Route"
          action={
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          }
        />
        <LoadingSpinner text="Loading route..." />
      </div>
    );
  }

  if (isEdit && (loadError || !route)) {
    return (
      <div>
        <PageHeader
          title="Edit Route"
          action={
            <Button variant="outline" onClick={handleCancel}>
              Back
            </Button>
          }
        />
        <ErrorMessage
          title="Failed to load route"
          message={
            loadError instanceof Error ? loadError.message : "Route not found"
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEdit ? "Edit Route" : "Create New Route"}
        action={
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        }
      />

      <Card className="max-w-3xl">
        <CardContent className="pt-6">
          <RouteForm
            defaultValues={route}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
}
