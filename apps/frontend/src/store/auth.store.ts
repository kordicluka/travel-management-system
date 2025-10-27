import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { type UserPublic } from '@travel-management-system/schemas'; // <-- Your shared schema!

type AuthState = {
  user: UserPublic | null;
  accessToken: string | null;
  refreshToken: string | null;
  setUser: (user: UserPublic | null) => void;
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setUser: (user) => set({ user }),
      setTokens: (tokens) => set({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      }),
      clearAuth: () => set({
        user: null,
        accessToken: null,
        refreshToken: null,
      }),
    }),
    {
      name: 'auth-storage', // name of the item in localStorage
      storage: createJSONStorage(() => localStorage), // use localStorage
    },
  ),
);