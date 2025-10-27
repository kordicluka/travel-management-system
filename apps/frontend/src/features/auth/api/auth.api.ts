import { apiClient } from "@/lib/api";
import type {
  LoginInput,
  RegisterInput,
  Tokens,
  UserPublic,
} from "@travel-management-system/schemas";

export const authApi = {
  /**
   * Register a new user
   */
  register: async (data: RegisterInput): Promise<Tokens> => {
    const response = await apiClient.post<Tokens>("/auth/register", data);
    return response.data;
  },

  /**
   * Login with email and password
   */
  login: async (data: LoginInput): Promise<Tokens> => {
    const response = await apiClient.post<Tokens>("/auth/login", data);
    return response.data;
  },

  /**
   * Logout the current user
   */
  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },

  /**
   * Refresh access token using refresh token
   */
  refreshToken: async (refreshToken: string): Promise<Tokens> => {
    const response = await apiClient.post<Tokens>("/auth/refresh", {
      refreshToken,
    });
    return response.data;
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<UserPublic> => {
    const response = await apiClient.get<UserPublic>("/auth/profile");
    return response.data;
  },
};
