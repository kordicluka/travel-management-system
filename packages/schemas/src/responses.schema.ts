import { z } from "zod";
import { AirportModelSchema } from "./airport.schema";
import { AirlineModelSchema } from "./airline.schema";
import { RouteModelSchema } from "./route.schema";

export const RouteResponseSchema = RouteModelSchema.extend({
  fromAirport: AirportModelSchema.optional(),
  toAirport: AirportModelSchema.optional(),
  airline: AirlineModelSchema.optional(),
});

export const AirportResponseSchema = AirportModelSchema.extend({
  servicedByAirlines: z.array(AirlineModelSchema).optional(),
  routesFrom: z.array(RouteResponseSchema).optional(),
  routesTo: z.array(RouteResponseSchema).optional(),
});

export const AirlineResponseSchema = AirlineModelSchema.extend({
  servicedAirports: z.array(AirportModelSchema).optional(),
  operatedRoutes: z.array(RouteResponseSchema).optional(),
});

export type AirportResponse = z.infer<typeof AirportResponseSchema>;
export type AirlineResponse = z.infer<typeof AirlineResponseSchema>;
export type RouteResponse = z.infer<typeof RouteResponseSchema>;
