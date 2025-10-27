// Airport schemas and types
export {
  AirportModelSchema,
  AirportCreateApiSchema,
  AirportUpdateApiSchema,
  AirportQuerySchema,
  AIRPORT_INCLUDE_RELATIONS,
  AIRPORT_SORTABLE_FIELDS,
  AirportIncludeSchema,
} from "./airport.schema";
export type {
  Airport,
  AirportCreateInput,
  AirportUpdateInput,
  AirportQuery,
  AirportIncludeRelation,
  AirportSortableField,
  AirportIncludeQuery,
} from "./airport.schema";

// Airline schemas and types
export {
  AirlineModelSchema,
  AirlineCreateApiSchema,
  AirlineUpdateApiSchema,
  AirlineQuerySchema,
  AIRLINE_INCLUDE_RELATIONS,
  AIRLINE_SORTABLE_FIELDS,
  AirlineIncludeSchema,
} from "./airline.schema";
export type {
  Airline,
  AirlineCreateInput,
  AirlineUpdateInput,
  AirlineQuery,
  AirlineIncludeRelation,
  AirlineSortableField,
  AirlineIncludeQuery,
} from "./airline.schema";

// Route schemas and types
export {
  RouteModelSchema,
  RouteCreateApiSchema,
  RouteUpdateApiSchema,
  RouteQuerySchema,
  ROUTE_INCLUDE_RELATIONS,
  ROUTE_SORTABLE_FIELDS,
  RouteIncludeSchema,
} from "./route.schema";
export type {
  Route,
  RouteCreateInput,
  RouteUpdateInput,
  RouteQuery,
  RouteIncludeRelation,
  RouteSortableField,
  RouteIncludeQuery,
} from "./route.schema";

export {
  PaginationMetaSchema,
  createPaginatedResponseSchema,
} from "./shared.schema";
export type { PaginationMeta, PaginatedResponse } from "./shared.schema";

export { UserSchema, UserPublicSchema, UpdateUserSchema } from "./user.schema";
export type { User, UserPublic, UpdateUser } from "./user.schema";

export { RegisterSchema, LoginSchema, TokenSchema } from "./auth.schema";
export type { RegisterInput, LoginInput, Tokens } from "./auth.schema";

// Response schemas (in separate file to avoid circular dependencies)
export {
  AirportResponseSchema,
  AirlineResponseSchema,
  RouteResponseSchema,
} from "./responses.schema";
export type {
  AirportResponse,
  AirlineResponse,
  RouteResponse,
} from "./responses.schema";
