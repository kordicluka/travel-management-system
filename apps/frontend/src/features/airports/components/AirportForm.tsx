import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AirportCreateApiSchema } from "@travel-management-system/schemas";
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
import { MapPicker, MapLocationSearch } from "@/components/map";
import type { AirportCreateInput, Airport } from "@/types";

interface AirportFormProps {
  defaultValues?: Airport;
  onSubmit: (data: AirportCreateInput) => void;
  isSubmitting?: boolean;
}

export function AirportForm({
  defaultValues,
  onSubmit,
  isSubmitting,
}: AirportFormProps) {
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);

  const form = useForm<AirportCreateInput>({
    resolver: zodResolver(AirportCreateApiSchema),
    defaultValues: defaultValues
      ? {
          name: defaultValues.name,
          code: defaultValues.code,
          country: defaultValues.country,
          latitude: defaultValues.latitude,
          longitude: defaultValues.longitude,
        }
      : {
          name: "",
          code: "",
          country: "",
          latitude: 0,
          longitude: 0,
        },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Airport Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John F. Kennedy International Airport"
                    {...field}
                  />
                </FormControl>
                <FormDescription>The full name of the airport</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Airport Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="JFK"
                    maxLength={3}
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                  />
                </FormControl>
                <FormDescription>3-letter IATA code</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    readOnly
                    placeholder="Auto-filled from map click"
                    className="bg-muted cursor-not-allowed"
                  />
                </FormControl>
                <FormDescription>
                  Automatically filled when you click on the map
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="md:col-span-2">
            <FormItem>
              <FormLabel>GPS Location</FormLabel>
              <FormDescription className="mb-2">
                Search for a location to zoom the map, then click to select precise coordinates
              </FormDescription>

              {/* Location search to zoom map */}
              <div className="mb-3">
                <MapLocationSearch
                  onLocationSelect={(lat, lng, name, type) => {
                    console.log(`Selected ${type}: ${name} at ${lat}, ${lng}`);
                    setMapCenter({ lat, lng });
                  }}
                  placeholder="Search country or city to zoom map..."
                />
              </div>

              <div className="h-[400px] w-full border rounded-lg overflow-hidden">
                <MapPicker
                  latitude={form.watch("latitude")}
                  longitude={form.watch("longitude")}
                  centerLat={mapCenter?.lat}
                  centerLng={mapCenter?.lng}
                  onLocationChange={(lat, lng, country) => {
                    form.setValue("latitude", lat);
                    form.setValue("longitude", lng);
                    // Auto-fill country if reverse geocoding succeeded
                    if (country) {
                      console.log("Auto-setting country to", country);
                      form.setValue("country", country);
                    }
                  }}
                />
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                {form.watch("latitude") && form.watch("longitude") ? (
                  <p>
                    Selected: {form.watch("latitude").toFixed(6)}°,{" "}
                    {form.watch("longitude").toFixed(6)}°
                  </p>
                ) : (
                  <p>No location selected yet</p>
                )}
              </div>
            </FormItem>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Airport"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
