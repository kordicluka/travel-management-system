import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useRefreshToken } from "@/features/auth/hooks";

/**
 * AuthInitializer component that attempts to refresh the access token
 * when the app loads if a refresh token exists.
 */
export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { refreshToken, accessToken } = useAuthStore();
  const { mutate: refreshTokenMutation } = useRefreshToken();

  useEffect(() => {
    // Only attempt refresh if we have a refresh token but no access token
    // This handles the case where the user refreshes the page and the access token expired
    if (refreshToken && !accessToken) {
      refreshTokenMutation();
    }
  }, [refreshToken, accessToken, refreshTokenMutation]);

  return <>{children}</>;
}
