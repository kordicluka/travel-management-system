/**
 * React Query configuration constants
 */

export const QUERY_LIMITS = {
  /** Limit for fetching all items (e.g., for dropdowns, selections) */
  ALL_ITEMS: 1000,
  /** Standard pagination limit for list views */
  PAGINATED: 20,
  /** Limit for search results */
  SEARCH_RESULTS: 50,
} as const;

export const CACHE_TIMES = {
  /** How long data is considered fresh (5 minutes) */
  STALE_TIME: 5 * 60 * 1000,
  /** How long unused data stays in cache (10 minutes) */
  GC_TIME: 10 * 60 * 1000,
  /** Cache time for user profile (5 minutes) */
  PROFILE_STALE_TIME: 5 * 60 * 1000,
} as const;
