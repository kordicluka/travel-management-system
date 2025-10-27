import { QueryClient, type QueryClientConfig } from '@tanstack/react-query';
import axios from 'axios';
import { CACHE_TIMES } from '@/constants';

/**
 * Smart retry logic for React Query
 * - Network errors: retry up to 3 times with exponential backoff
 * - 5xx server errors: retry once (server might recover)
 * - 4xx client errors: don't retry (won't succeed on retry)
 * - 401/403: don't retry (need authentication/authorization)
 */
const shouldRetry = (failureCount: number, error: unknown): boolean => {
  // Don't retry after 3 attempts
  if (failureCount >= 3) {
    return false;
  }

  // Handle Axios errors
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;

    // Don't retry on client errors (4xx) except 408 (Request Timeout) and 429 (Too Many Requests)
    if (status && status >= 400 && status < 500) {
      return status === 408 || status === 429;
    }

    // Retry on 5xx server errors (once)
    if (status && status >= 500) {
      return failureCount < 1;
    }

    // Retry on network errors (no response from server)
    if (!error.response) {
      return true;
    }
  }

  // Retry on any other error type once
  return failureCount < 1;
};

/**
 * Query client configuration with optimized defaults
 */
const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      // Cache configuration
      staleTime: CACHE_TIMES.STALE_TIME, // 5 minutes
      gcTime: CACHE_TIMES.GC_TIME, // 10 minutes

      // Retry configuration with smart logic
      retry: shouldRetry,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff: 1s, 2s, 4s, max 30s

      // Refetch configuration
      refetchOnWindowFocus: false, // Don't refetch when user returns to tab (can be overwhelming)
      refetchOnMount: true, // Refetch on component mount if data is stale
      refetchOnReconnect: true, // Refetch when internet connection is restored

      // Network mode
      networkMode: 'online', // Only run queries when online
    },
    mutations: {
      // Don't retry mutations by default (side effects should be intentional)
      retry: false,

      // Network mode
      networkMode: 'online', // Only run mutations when online
    },
  },
};

export const queryClient = new QueryClient(queryClientConfig);
