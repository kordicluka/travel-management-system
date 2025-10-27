import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { ROUTE_PATHS } from "./routePaths";

/**
 * ProtectedRoute component that wraps protected routes
 * Redirects to login if user is not authenticated
 */
export const ProtectedRoute = () => {
  const { accessToken } = useAuthStore();

  // If no access token, redirect to login
  if (!accessToken) {
    return <Navigate to={ROUTE_PATHS.LOGIN} replace />;
  }

  // If authenticated, render the nested routes
  return <Outlet />;
};
