// apps/frontend/src/lib/api/client.ts
import axios, { type InternalAxiosRequestConfig, type AxiosError } from "axios";
import { useAuthStore } from "@/store/auth.store";
import { config } from "@/config";
import { logger } from "@/lib/logger";

export const apiClient = axios.create({
  baseURL: config.apiUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: {
    serialize: (params) => {
      const searchParams = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null) {
          return;
        }

        if (Array.isArray(value)) {
          // Convert arrays to comma-separated strings
          if (value.length > 0) {
            searchParams.append(key, value.join(','));
          }
        } else {
          searchParams.append(key, String(value));
        }
      });

      return searchParams.toString();
    },
  },
});

// Variable to hold the refresh promise to prevent multiple simultaneous refresh attempts
let refreshTokenPromise: Promise<string> | null = null;

// Request interceptor: Add access token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Log API request in development
    logger.debug('API Request', {
      method: config.method?.toUpperCase(),
      url: config.url,
      params: config.params,
    });

    return config;
  },
  (error: unknown) => {
    logger.error('API Request Error', error instanceof Error ? error : new Error(String(error)));
    if (error instanceof Error) {
      return Promise.reject(error);
    }
    return Promise.reject(new Error(String(error)));
  }
);

// Response interceptor: Handle 401 and refresh token
apiClient.interceptors.response.use(
  (response) => {
    // Log successful API response in development
    logger.debug('API Response', {
      method: response.config.method?.toUpperCase(),
      url: response.config.url,
      status: response.status,
    });
    return response;
  },
  async (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const originalRequest = axiosError.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // Log API error
      logger.error('API Response Error', undefined, {
        method: originalRequest?.method?.toUpperCase(),
        url: originalRequest?.url,
        status: axiosError.response?.status,
        message: axiosError.message,
      });

      // If 401 and we haven't retried yet
      if (axiosError.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // If already refreshing, wait for that promise
          if (!refreshTokenPromise) {
            const { refreshToken } = useAuthStore.getState();

            if (!refreshToken) {
              // No refresh token, clear auth and redirect
              logger.info('No refresh token available, redirecting to login');
              useAuthStore.getState().clearAuth();
              window.location.href = "/login";
              return Promise.reject(error);
            }

            // Start refresh process
            logger.debug('Refreshing access token');
            refreshTokenPromise = (async () => {
              const response = await axios.post(
                `${config.apiUrl}/auth/refresh`,
                { refreshToken },
                { headers: { "Content-Type": "application/json" } }
              );
              return response.data.accessToken;
            })();
          }

          const newAccessToken = await refreshTokenPromise;
          refreshTokenPromise = null; // Reset for next time

          logger.debug('Access token refreshed successfully');

          // Update tokens in store
          const { refreshToken } = useAuthStore.getState();
          useAuthStore.getState().setTokens({
            accessToken: newAccessToken,
            refreshToken: refreshToken!,
          });

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed, clear auth and redirect to login
          logger.error('Token refresh failed, redirecting to login', refreshError as Error);
          refreshTokenPromise = null;
          useAuthStore.getState().clearAuth();
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }
    }

    if (error instanceof Error) {
      return Promise.reject(error);
    }
    return Promise.reject(new Error(String(error)));
  }
);
