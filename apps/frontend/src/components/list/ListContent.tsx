import { type ReactNode, type ComponentType } from 'react';
import { ErrorMessage, EmptyState } from '@/components/common';
import { type LucideIcon } from 'lucide-react';

interface ListContentProps<T> {
  /** Array of items to display */
  items: T[];

  /** Whether data is loading */
  isLoading: boolean;

  /** Whether filters are being applied (show skeletons) */
  isFiltering: boolean;

  /** Error object if fetch failed */
  error: Error | null;

  /** Whether there are active filters */
  hasActiveFilters: boolean;

  /** Card component to render each item */
  CardComponent: ComponentType<{ item: T; onDelete?: (id: string) => void; isSelected?: boolean }>;

  /** Skeleton component to show during loading */
  SkeletonComponent: ComponentType;

  /** Icon for empty state */
  emptyIcon: LucideIcon;

  /** Title for empty state */
  emptyTitle: string;

  /** Description for empty state (when no filters) */
  emptyDescription: string;

  /** Description for empty state (when filters applied) */
  emptyWithFiltersDescription: string;

  /** Entity name for error messages (e.g., "airports", "airlines") */
  entityName: string;

  /** Action button for empty state (when no filters) */
  emptyAction?: ReactNode;

  /** Action button for empty state (with filters) */
  emptyWithFiltersAction?: ReactNode;

  /** Callback when delete is triggered */
  onDelete?: (id: string) => void;

  /** ID of selected item (for highlighting) */
  selectedItemId?: string | null;

  /** Ref for scroll container */
  scrollRef?: React.RefObject<HTMLDivElement>;

  /** Scroll handler for infinite scroll */
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;

  /** Number of skeleton items to show */
  skeletonCount?: number;

  /** Grid column configuration */
  gridCols?: string;
}

/**
 * Reusable content component for list pages
 * Handles loading states, errors, empty states, and item rendering
 *
 * @example
 * ```tsx
 * <ListContent
 *   items={airports}
 *   isLoading={isLoading}
 *   isFiltering={isFiltering}
 *   error={error}
 *   hasActiveFilters={hasActiveFilters}
 *   CardComponent={AirportCard}
 *   SkeletonComponent={AirportCardSkeleton}
 *   emptyIcon={Plane}
 *   emptyTitle="No airports found"
 *   emptyDescription="Get started by creating your first airport"
 *   emptyWithFiltersDescription="No airports match your filters"
 *   entityName="airports"
 *   onDelete={setDeleteId}
 *   selectedItemId={selectedAirportId}
 *   onScroll={handleScroll}
 * />
 * ```
 */
export function ListContent<T extends { id: string }>({
  items,
  isLoading,
  isFiltering,
  error,
  hasActiveFilters,
  CardComponent,
  SkeletonComponent,
  emptyIcon: EmptyIcon,
  emptyTitle,
  emptyDescription,
  emptyWithFiltersDescription,
  entityName,
  emptyAction,
  emptyWithFiltersAction,
  onDelete,
  selectedItemId,
  scrollRef,
  onScroll,
  skeletonCount = 6,
  gridCols = 'grid-cols-1 md:grid-cols-2',
}: ListContentProps<T>) {
  return (
    <div
      ref={scrollRef}
      className="flex flex-col h-full overflow-auto p-4 mb-2 relative"
      onScroll={onScroll}
    >
      {error && (
        <div className="mb-4">
          <ErrorMessage
            title={`Failed to load ${entityName}`}
            message={error instanceof Error ? error.message : 'An error occurred'}
          />
        </div>
      )}

      {items.length === 0 && !isLoading && !error ? (
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            icon={EmptyIcon}
            title={emptyTitle}
            description={
              hasActiveFilters ? emptyWithFiltersDescription : emptyDescription
            }
            action={hasActiveFilters ? emptyWithFiltersAction : emptyAction}
          />
        </div>
      ) : (
        <div className={`grid ${gridCols} gap-4`}>
          {isLoading || isFiltering ? (
            // Show skeletons when loading or filtering
            <>
              {Array.from({ length: skeletonCount }).map((_, index) => (
                <SkeletonComponent key={index} />
              ))}
            </>
          ) : (
            // Show actual cards when loaded
            items.map((item) => (
              <CardComponent
                key={item.id}
                item={item}
                onDelete={onDelete}
                isSelected={selectedItemId === item.id}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
