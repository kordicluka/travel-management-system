import { useParams } from "react-router-dom";
import { PageHeader, LoadingSpinner, ErrorMessage } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { routePaths } from "@/router/routePaths";
import { useAirport, useCreateAirport, useUpdateAirport } from "../hooks";
import { AirportForm } from "../components";
import { useEntityForm } from "@/hooks";
import type {
  Airport,
  AirportCreateInput,
  AirportUpdateInput,
  AirportIncludeQuery,
} from "@/types";

export function AirportFormPage() {
  const { id } = useParams();

  const {
    entity: airport,
    isLoading,
    loadError,
    isEdit,
    handleSubmit,
    isSubmitting,
    handleCancel,
  } = useEntityForm<
    Airport,
    AirportCreateInput,
    AirportUpdateInput,
    AirportIncludeQuery
  >({
    id,
    useGetQuery: useAirport,
    useCreateMutation: useCreateAirport,
    useUpdateMutation: useUpdateAirport,
    successRoute: routePaths.airports(),
    entityName: "airport",
  });

  if (isEdit && isLoading) {
    return (
      <div>
        <PageHeader
          title="Edit Airport"
          action={
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          }
        />
        <LoadingSpinner text="Loading airport..." />
      </div>
    );
  }

  if (isEdit && (loadError || !airport)) {
    return (
      <div>
        <PageHeader
          title="Edit Airport"
          action={
            <Button variant="outline" onClick={handleCancel}>
              Back
            </Button>
          }
        />
        <ErrorMessage
          title="Failed to load airport"
          message={
            loadError instanceof Error ? loadError.message : "Airport not found"
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEdit ? "Edit Airport" : "Create New Airport"}
        action={
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        }
      />

      <Card className="max-w-3xl">
        <CardContent className="pt-6">
          <AirportForm
            defaultValues={airport}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
}
