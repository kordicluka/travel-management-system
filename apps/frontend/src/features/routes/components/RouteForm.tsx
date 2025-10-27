import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RouteCreateApiSchema } from "@travel-management-system/schemas";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { SearchableAirportSelect } from "@/components/ui/searchable-airport-select";
import { useAirlines } from "@/features/airlines/hooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QUERY_LIMITS } from "@/constants";
import type { RouteCreateInput } from "@/types";

// Extended Route type for editing with relations
interface RouteWithRelations {
  id: string;
  fromAirportId: string;
  toAirportId: string;
  airlineId: string;
  distanceKm: number | null;
  fromAirport?: {
    id: string;
    code: string;
    name: string;
  };
  toAirport?: {
    id: string;
    code: string;
    name: string;
  };
  airline?: {
    id: string;
    name: string;
  };
}

interface RouteFormProps {
  defaultValues?: RouteWithRelations;
  onSubmit: (data: RouteCreateInput) => void;
  isSubmitting?: boolean;
}

export function RouteForm({
  defaultValues,
  onSubmit,
  isSubmitting,
}: RouteFormProps) {
  // Fetch all airlines for the select
  const { data: airlinesData, isLoading: isLoadingAirlines } = useAirlines({
    page: 1,
    limit: QUERY_LIMITS.ALL_ITEMS,
    sortBy: "name",
    sortOrder: "asc",
  });

  const form = useForm<RouteCreateInput>({
    resolver: zodResolver(RouteCreateApiSchema),
    defaultValues: defaultValues
      ? {
          fromAirportId: defaultValues.fromAirportId,
          toAirportId: defaultValues.toAirportId,
          airlineId: defaultValues.airlineId,
        }
      : {
          fromAirportId: "",
          toAirportId: "",
          airlineId: "",
        },
  });

  const airlines = airlinesData?.data || [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="fromAirportId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From Airport</FormLabel>
                <FormControl>
                  <SearchableAirportSelect
                    value={field.value}
                    onChange={(value) => field.onChange(value || "")}
                    placeholder="Select departure airport..."
                    className="w-full"
                  />
                </FormControl>
                <FormDescription>
                  The departure airport for this route
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="toAirportId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>To Airport</FormLabel>
                <FormControl>
                  <SearchableAirportSelect
                    value={field.value}
                    onChange={(value) => field.onChange(value || "")}
                    placeholder="Select arrival airport..."
                    className="w-full"
                  />
                </FormControl>
                <FormDescription>
                  The arrival airport for this route
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="airlineId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Airline</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoadingAirlines}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          isLoadingAirlines
                            ? "Loading airlines..."
                            : "Select airline..."
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {airlines.map((airline) => (
                      <SelectItem key={airline.id} value={airline.id}>
                        {airline.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  The airline operating this route
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="rounded-lg border bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> The distance between airports will be
            automatically calculated using the Haversine formula based on GPS
            coordinates.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={isSubmitting || isLoadingAirlines}>
            {isSubmitting ? "Saving..." : "Save Route"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
