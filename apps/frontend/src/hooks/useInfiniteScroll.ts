import { useState, useCallback, useEffect } from 'react';

/**
 * Configuration for the useInfiniteScroll hook
 */
interface UseInfiniteScrollConfig {
  /** Total number of items available */
  totalItems: number;

  /** Initial number of items to display */
  initialLimit?: number;

  /** Number of items to load on each scroll increment */
  itemsPerLoad?: number;

  /** Scroll percentage threshold (0-1) to trigger loading more items */
  threshold?: number;

  /** Whether data is currently loading */
  isLoading?: boolean;
}

/**
 * Return type for the useInfiniteScroll hook
 */
interface UseInfiniteScrollReturn {
  /** Current number of items to display */
  displayLimit: number;

  /** Whether there are more items to load */
  hasMore: boolean;

  /** Reset display limit (e.g., when filters change) */
  resetLimit: () => void;

  /** Scroll event handler to attach to scrollable container */
  handleScroll: (e: React.UIEvent<HTMLDivElement>) => void;
}

/**
 * Reusable hook for infinite scroll functionality
 * Manages display limit and provides scroll handler
 *
 * @example
 * ```tsx
 * function ListPage() {
 *   const { displayLimit, hasMore, resetLimit, handleScroll } = useInfiniteScroll({
 *     totalItems: filteredItems.length,
 *     initialLimit: 50,
 *     itemsPerLoad: 50,
 *     threshold: 0.8,
 *     isLoading,
 *   });
 *
 *   // Reset when filters change
 *   useEffect(() => {
 *     resetLimit();
 *   }, [search, filters, resetLimit]);
 *
 *   const displayedItems = filteredItems.slice(0, displayLimit);
 *
 *   return (
 *     <div onScroll={handleScroll}>
 *       {displayedItems.map(item => <ItemCard key={item.id} item={item} />)}
 *     </div>
 *   );
 * }
 * ```
 */
export function useInfiniteScroll({
  totalItems,
  initialLimit = 50,
  itemsPerLoad = 50,
  threshold = 0.8,
  isLoading = false,
}: UseInfiniteScrollConfig): UseInfiniteScrollReturn {
  const [displayLimit, setDisplayLimit] = useState(initialLimit);

  // Reset display limit when total items becomes 0 (e.g., new filter with no results)
  useEffect(() => {
    if (totalItems === 0) {
      setDisplayLimit(initialLimit);
    }
  }, [totalItems, initialLimit]);

  const resetLimit = useCallback(() => {
    setDisplayLimit(initialLimit);
  }, [initialLimit]);

  const hasMore = displayLimit < totalItems;

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      const scrollPercentage =
        (target.scrollTop + target.clientHeight) / target.scrollHeight;

      // Load more when user scrolls past threshold and there are more items
      if (scrollPercentage > threshold && hasMore && !isLoading) {
        setDisplayLimit((prev) => Math.min(prev + itemsPerLoad, totalItems));
      }
    },
    [threshold, hasMore, isLoading, itemsPerLoad, totalItems]
  );

  return {
    displayLimit,
    hasMore,
    resetLimit,
    handleScroll,
  };
}
