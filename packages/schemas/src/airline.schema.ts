import { z } from "zod";
import { createQuerySchema } from "./shared.schema";

export const AIRLINE_INCLUDE_RELATIONS = [
  "servicedAirports",
  "operatedRoutes",
] as const;

export const AIRLINE_SORTABLE_FIELDS = [
  "id",
  "name",
  "baseCountry",
  "createdAt",
  "updatedAt",
] as const;

export const AirlineModelSchema = z.object({
  id: z.string(),
  name: z.string(),
  baseCountry: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const AirlineCreateApiSchema = z.object({
  name: z.string().min(1, "Airline name is required"),
  baseCountry: z.string().min(1, "Base country is required"),
  servicedAirportIds: z
    .array(z.string())
    .min(1, "At least one serviced airport is required"),
});

export const AirlineUpdateApiSchema = z.object({
  name: z.string().min(1, "Airline name is required").optional(),
  baseCountry: z.string().min(1, "Base country is required").optional(),
  servicedAirportIds: z
    .array(z.string())
    .min(1, "At least one serviced airport is required")
    .optional(),
});

const airlineSpecificFilters = {
  baseCountry: z.string().optional(),
};

export const AirlineQuerySchema = createQuerySchema(
  AIRLINE_SORTABLE_FIELDS,
  "name",
  AIRLINE_INCLUDE_RELATIONS,
  airlineSpecificFilters
);

export const AirlineIncludeSchema = AirlineQuerySchema.pick({
  include: true,
});

export type Airline = z.infer<typeof AirlineModelSchema>;
export type AirlineCreateInput = z.infer<typeof AirlineCreateApiSchema>;
export type AirlineUpdateInput = z.infer<typeof AirlineUpdateApiSchema>;
export type AirlineQuery = z.infer<typeof AirlineQuerySchema>;
export type AirlineIncludeQuery = z.infer<typeof AirlineIncludeSchema>;
export type AirlineIncludeRelation = (typeof AIRLINE_INCLUDE_RELATIONS)[number];
export type AirlineSortableField = (typeof AIRLINE_SORTABLE_FIELDS)[number];
