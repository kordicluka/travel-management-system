import { z } from "zod";
import { createQuerySchema } from "./shared.schema";

export const ROUTE_INCLUDE_RELATIONS = [
  "fromAirport",
  "toAirport",
  "airline",
] as const;

export const ROUTE_SORTABLE_FIELDS = [
  "id",
  "fromAirportId",
  "toAirportId",
  "airlineId",
  "distanceKm",
  "createdAt",
  "updatedAt",
] as const;

export const RouteModelSchema = z.object({
  id: z.string(),
  fromAirportId: z.string(),
  toAirportId: z.string(),
  airlineId: z.string(),
  distanceKm: z.number().int().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const RouteCreateApiSchema = z.object({
  fromAirportId: z.string().min(1, "From airport is required"),
  toAirportId: z.string().min(1, "To airport is required"),
  airlineId: z.string().min(1, "Airline is required"),
  // distanceKm is auto-calculated using Haversine formula - not user-editable
});

export const RouteUpdateApiSchema = z.object({
  fromAirportId: z.string().min(1, "From airport is required").optional(),
  toAirportId: z.string().min(1, "To airport is required").optional(),
  airlineId: z.string().min(1, "Airline is required").optional(),
  // distanceKm is auto-calculated using Haversine formula - not user-editable
});

const routeSpecificFilters = {
  fromAirportId: z.string().optional(),
  toAirportId: z.string().optional(),
  airlineId: z.string().optional(),
};

export const RouteQuerySchema = createQuerySchema(
  ROUTE_SORTABLE_FIELDS,
  "createdAt",
  ROUTE_INCLUDE_RELATIONS,
  routeSpecificFilters
);

export const RouteIncludeSchema = RouteQuerySchema.pick({
  include: true,
});

export type Route = z.infer<typeof RouteModelSchema>;
export type RouteCreateInput = z.infer<typeof RouteCreateApiSchema>;
export type RouteUpdateInput = z.infer<typeof RouteUpdateApiSchema>;
export type RouteQuery = z.infer<typeof RouteQuerySchema>;
export type RouteIncludeQuery = z.infer<typeof RouteQuerySchema>;
export type RouteIncludeRelation = (typeof ROUTE_INCLUDE_RELATIONS)[number];
export type RouteSortableField = (typeof ROUTE_SORTABLE_FIELDS)[number];
