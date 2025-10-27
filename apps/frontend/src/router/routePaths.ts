export const ROUTE_PATHS = {
  HOME: "/",

  // Auth (NEW)
  LOGIN: "/login",
  REGISTER: "/register",
  PROFILE: "/profile",

  // Airports
  AIRPORTS: "/airports",
  AIRPORT_NEW: "/airports/new",
  AIRPORT_DETAIL: "/airports/:id",
  AIRPORT_EDIT: "/airports/:id/edit",

  // Airlines
  AIRLINES: "/airlines",
  AIRLINE_NEW: "/airlines/new",
  AIRLINE_DETAIL: "/airlines/:id",
  AIRLINE_EDIT: "/airlines/:id/edit",

  // Routes
  ROUTES: "/routes",
  ROUTE_NEW: "/routes/new",
  ROUTE_DETAIL: "/routes/:id",
  ROUTE_EDIT: "/routes/:id/edit",
} as const;

// Helper functions (no change needed, but you can add auth ones if you want)
export const routePaths = {
  airports: () => "/airports",
  airportNew: () => "/airports/new",
  airportDetail: (id: string) => `/airports/${id}`,
  airportEdit: (id: string) => `/airports/${id}/edit`,
  airlines: () => "/airlines",
  airlineNew: () => "/airlines/new",
  airlineDetail: (id: string) => `/airlines/${id}`,
  airlineEdit: (id: string) => `/airlines/${id}/edit`,
  routes: () => "/routes",
  routeNew: () => "/routes/new",
  routeDetail: (id: string) => `/routes/${id}`,
  routeEdit: (id: string) => `/routes/${id}/edit`,
};
