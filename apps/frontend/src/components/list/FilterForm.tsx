import { type ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FilterFormProps {
  /** Filter input elements */
  children: ReactNode;

  /** Whether there are active filters */
  hasActiveFilters: boolean;

  /** Callback to clear all filters */
  onClearFilters: () => void;
}

/**
 * Generic filter form wrapper for list pages
 * Provides consistent layout and clear filters button
 *
 * @example
 * ```tsx
 * <FilterForm
 *   hasActiveFilters={search || code || countries.length > 0}
 *   onClearFilters={handleClearFilters}
 * >
 *   <div className="flex-1 min-w-[200px]">
 *     <Label>Search</Label>
 *     <Input value={search} onChange={handleSearchChange} />
 *   </div>
 *   <div className="flex-1 min-w-[150px]">
 *     <Label>Code</Label>
 *     <Input value={code} onChange={handleCodeChange} />
 *   </div>
 * </FilterForm>
 * ```
 */
export function FilterForm({
  children,
  hasActiveFilters,
  onClearFilters,
}: FilterFormProps) {
  return (
    <div className="border-b bg-background mb-4">
      <div className="p-4">
        <div className="flex flex-wrap gap-4 items-end">
          {children}

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div>
              <Button variant="outline" size="default" onClick={onClearFilters}>
                <X className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
