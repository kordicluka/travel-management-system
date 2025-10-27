import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api";
import { useAuthStore } from "@/store/auth.store";
import { ROUTE_PATHS } from "@/router/routePaths";

export function useLogout() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      // Clear auth state
      clearAuth();
      // Clear all cached queries
      queryClient.clear();
      // Redirect to login page
      navigate(ROUTE_PATHS.LOGIN);
    },
    onError: () => {
      // Even if logout fails on server, clear local state
      clearAuth();
      queryClient.clear();
      navigate(ROUTE_PATHS.LOGIN);
    },
  });
}
