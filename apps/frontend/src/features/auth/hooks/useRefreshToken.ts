import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api";
import { useAuthStore } from "@/store/auth.store";

export function useRefreshToken() {
  const { refreshToken, setTokens, clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }
      return authApi.refreshToken(refreshToken);
    },
    onSuccess: (tokens) => {
      // Update tokens in store
      setTokens(tokens);
    },
    onError: () => {
      // If refresh fails, clear auth
      clearAuth();
    },
  });
}
