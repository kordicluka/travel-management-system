/**
 * Pagination constants
 */

export const PAGINATION = {
  /** Default page size for lists */
  DEFAULT_PAGE_SIZE: 20,
  /** Increment for "load more" functionality */
  LOAD_MORE_INCREMENT: 50,
  /** Initial display limit for infinite scroll */
  INITIAL_DISPLAY_LIMIT: 50,
  /** Scroll threshold for loading more (percentage) */
  SCROLL_THRESHOLD: 0.8,
} as const;
