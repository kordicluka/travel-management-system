import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AirlineCreateApiSchema } from "@travel-management-system/schemas";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAirports } from "@/features/airports/hooks";
import { useCountries } from "@/hooks/useCountries";
import { QUERY_LIMITS } from "@/constants";
import type { AirlineCreateInput } from "@/types";

// Extended Airline type for editing with relations
interface AirlineWithRelations {
  id: string;
  name: string;
  baseCountry: string;
  servicedAirports?: Array<{
    id: string;
    code: string;
    name: string;
  }>;
}

interface AirlineFormProps {
  defaultValues?: AirlineWithRelations;
  onSubmit: (data: AirlineCreateInput) => void;
  isSubmitting?: boolean;
}

export function AirlineForm({
  defaultValues,
  onSubmit,
  isSubmitting,
}: AirlineFormProps) {
  // Fetch all airports for the multi-select
  const { data: airportsData, isLoading: isLoadingAirports } = useAirports({
    page: 1,
    limit: QUERY_LIMITS.ALL_ITEMS,
  });

  // Fetch all countries for the select
  const { data: countries = [], isLoading: isLoadingCountries } =
    useCountries();

  const form = useForm<AirlineCreateInput>({
    resolver: zodResolver(AirlineCreateApiSchema),
    defaultValues: defaultValues
      ? {
          name: defaultValues.name,
          baseCountry: defaultValues.baseCountry,
          servicedAirportIds:
            defaultValues.servicedAirports?.map((a) => a.id) || [],
        }
      : {
          name: "",
          baseCountry: "",
          servicedAirportIds: [],
        },
  });

  // Transform airports data for MultiSelect component
  const airportOptions =
    airportsData?.data.map((airport) => ({
      label: `${airport.code} - ${airport.name}`,
      value: airport.id,
    })) || [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Airline Name</FormLabel>
                <FormControl>
                  <Input placeholder="Delta Air Lines" {...field} />
                </FormControl>
                <FormDescription>The full name of the airline</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="baseCountry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Base Country</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoadingCountries}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          isLoadingCountries
                            ? "Loading countries..."
                            : "Select country..."
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-[300px]">
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  The country where the airline is based
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="servicedAirportIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Serviced Airports</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={airportOptions}
                      selected={field.value}
                      onChange={field.onChange}
                      placeholder={
                        isLoadingAirports
                          ? "Loading airports..."
                          : "Select airports..."
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Select one or more airports serviced by this airline
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="submit"
            disabled={isSubmitting || isLoadingAirports || isLoadingCountries}
          >
            {isSubmitting ? "Saving..." : "Save Airline"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
