import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api";
import { useAuthStore } from "@/store/auth.store";

export function useProfile() {
  const { accessToken, setUser } = useAuthStore();

  return useQuery({
    queryKey: ["auth", "profile"],
    queryFn: async () => {
      const user = await authApi.getProfile();
      // Update user in store
      setUser(user);
      return user;
    },
    // Only fetch if we have an access token
    enabled: !!accessToken,
    // Cache for 5 minutes
    staleTime: 5 * 60 * 1000,
  });
}
