import { useParams } from "react-router-dom";
import { PageHeader, LoadingSpinner, ErrorMessage } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { routePaths } from "@/router/routePaths";
import { AirlineForm } from "../components";
import { useAirline, useCreateAirline, useUpdateAirline } from "../hooks";
import { useEntityForm } from "@/hooks";
import type {
  AirlineCreateInput,
  Airline,
  AirlineUpdateInput,
  AirlineQuery,
} from "@/types";

export function AirlineFormPage() {
  const { id } = useParams();

  const {
    entity: airline,
    isLoading,
    loadError,
    isEdit,
    handleSubmit,
    isSubmitting,
    handleCancel,
  } = useEntityForm<
    Airline,
    AirlineCreateInput,
    AirlineUpdateInput,
    AirlineQuery
  >({
    id,
    useGetQuery: useAirline,
    queryOptions: { include: ["servicedAirports"] },
    useCreateMutation: useCreateAirline,
    useUpdateMutation: useUpdateAirline,
    successRoute: routePaths.airlines(),
    entityName: "airline",
  });
  if (isEdit && isLoading) {
    return (
      <div>
        <PageHeader
          title="Edit Airline"
          action={
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          }
        />
        <LoadingSpinner text="Loading airline..." />
      </div>
    );
  }

  if (isEdit && (loadError || !airline)) {
    return (
      <div>
        <PageHeader
          title="Edit Airline"
          action={
            <Button variant="outline" onClick={handleCancel}>
              Back
            </Button>
          }
        />
        <ErrorMessage
          title="Failed to load airline"
          message={
            loadError instanceof Error ? loadError.message : "Airline not found"
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEdit ? "Edit Airline" : "Create New Airline"}
        action={
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        }
      />

      <Card className="max-w-3xl">
        <CardContent className="pt-6">
          <AirlineForm
            defaultValues={airline}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
}
