import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api";
import { useAuthStore } from "@/store/auth.store";
import { ROUTE_PATHS } from "@/router/routePaths";
import type { LoginInput } from "@travel-management-system/schemas";

export function useLogin() {
  const navigate = useNavigate();
  const { setTokens, setUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginInput) => authApi.login(data),
    onSuccess: async (tokens) => {
      // Store tokens in Zustand
      setTokens(tokens);

      // Fetch and store user profile
      try {
        const user = await authApi.getProfile();
        setUser(user);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }

      // Redirect to home page
      navigate(ROUTE_PATHS.HOME);
    },
  });
}
