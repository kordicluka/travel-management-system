import { z } from "zod";
import { createQuerySchema } from "./shared.schema"; // Import the factory

export const AIRPORT_INCLUDE_RELATIONS = [
  "servicedByAirlines",
  "routesFrom",
  "routesTo",
] as const;

export const AIRPORT_SORTABLE_FIELDS = [
  "id",
  "name",
  "code",
  "country",
  "latitude",
  "longitude",
  "createdAt",
  "updatedAt",
] as const;

export const AirportModelSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
  country: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const AirportCreateApiSchema = z.object({
  name: z.string().min(1, "Airport name is required"),
  code: z
    .string()
    .length(3, "Airport code must be exactly 3 characters")
    .toUpperCase(),
  country: z.string().min(1, "Country is required"),
  latitude: z.number().min(-90).max(90, "Latitude must be between -90 and 90"),
  longitude: z
    .number()
    .min(-180)
    .max(180, "Longitude must be between -180 and 180"),
});

export const AirportUpdateApiSchema = z.object({
  name: z.string().min(1, "Airport name is required").optional(),
  code: z
    .string()
    .length(3, "Airport code must be exactly 3 characters")
    .toUpperCase()
    .optional(),
  country: z.string().min(1, "Country is required").optional(),
  latitude: z
    .number()
    .min(-90)
    .max(90, "Latitude must be between -90 and 90")
    .optional(),
  longitude: z
    .number()
    .min(-180)
    .max(180, "Longitude must be between -180 and 180")
    .optional(),
});

/**
 * Entity-specific filters for Airport queries
 */
const airportSpecificFilters = {
  country: z
    .preprocess((val) => {
      if (typeof val === "string") {
        return val.split(",").filter(Boolean);
      }
      return val;
    }, z.array(z.string()))
    .optional(),
  code: z.string().optional(),
};

/**
 * Schema for querying airports with filters and pagination
 */
export const AirportQuerySchema = createQuerySchema(
  AIRPORT_SORTABLE_FIELDS,
  "name",
  AIRPORT_INCLUDE_RELATIONS,
  airportSpecificFilters
);

export const AirportIncludeSchema = AirportQuerySchema.pick({
  include: true,
});

export type Airport = z.infer<typeof AirportModelSchema>;
export type AirportCreateInput = z.infer<typeof AirportCreateApiSchema>;
export type AirportUpdateInput = z.infer<typeof AirportUpdateApiSchema>;
export type AirportQuery = z.infer<typeof AirportQuerySchema>;
export type AirportIncludeQuery = z.infer<typeof AirportIncludeSchema>;
export type AirportIncludeRelation = (typeof AIRPORT_INCLUDE_RELATIONS)[number];
export type AirportSortableField = (typeof AIRPORT_SORTABLE_FIELDS)[number];
