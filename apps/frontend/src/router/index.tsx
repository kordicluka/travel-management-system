import { createBrowserRouter, Navigate } from "react-router-dom";
import { ROUTE_PATHS } from "./routePaths";
import { MainLayout } from "@/components/layout";
import { ProtectedRoute } from "./ProtectedRoute";
import {
  AirportListPage,
  AirportFormPage,
  AirportDetailPage,
} from "@/features/airports/pages";
import {
  AirlineListPage,
  AirlineFormPage,
  AirlineDetailPage,
} from "@/features/airlines/pages";
import {
  RouteListPage,
  RouteFormPage,
  RouteDetailPage,
} from "@/features/routes/pages";

import { LoginPage, RegisterPage, ProfilePage } from "@/features/auth/pages";

export const router = createBrowserRouter([
  {
    path: ROUTE_PATHS.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTE_PATHS.REGISTER,
    element: <RegisterPage />,
  },

  {
    element: <ProtectedRoute />, // This component checks for auth
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          {
            // Redirect root path to airports list
            index: true,
            element: <Navigate to={ROUTE_PATHS.AIRPORTS} replace />,
          },
          {
            path: ROUTE_PATHS.HOME, // Keeping this in case you want a dashboard
            element: <div></div>,
          },
          // Profile route
          {
            path: ROUTE_PATHS.PROFILE,
            element: <ProfilePage />,
          },
          // Airports routes
          {
            path: ROUTE_PATHS.AIRPORTS,
            element: <AirportListPage />,
          },
          {
            path: ROUTE_PATHS.AIRPORT_NEW,
            element: <AirportFormPage />,
          },
          {
            path: ROUTE_PATHS.AIRPORT_DETAIL,
            element: <AirportDetailPage />,
          },
          {
            path: ROUTE_PATHS.AIRPORT_EDIT,
            element: <AirportFormPage />,
          },
          // Airlines routes
          {
            path: ROUTE_PATHS.AIRLINES,
            element: <AirlineListPage />,
          },
          {
            path: ROUTE_PATHS.AIRLINE_NEW,
            element: <AirlineFormPage />,
          },
          {
            path: ROUTE_PATHS.AIRLINE_DETAIL,
            element: <AirlineDetailPage />,
          },
          {
            path: ROUTE_PATHS.AIRLINE_EDIT,
            element: <AirlineFormPage />,
          },
          // Routes routes
          {
            path: ROUTE_PATHS.ROUTES,
            element: <RouteListPage />,
          },
          {
            path: ROUTE_PATHS.ROUTE_NEW,
            element: <RouteFormPage />,
          },
          {
            path: ROUTE_PATHS.ROUTE_DETAIL,
            element: <RouteDetailPage />,
          },
          {
            path: ROUTE_PATHS.ROUTE_EDIT,
            element: <RouteFormPage />,
          },
        ],
      },
    ],
  },
]);
