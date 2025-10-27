import { FilterForm } from '@/components/list';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableAirportSelect } from '@/components/ui/searchable-airport-select';
import { MultiSelectAirline } from '@/components/ui/multi-select-airline';

interface RouteListFiltersProps {
  /** Search input value */
  searchInput: string;

  /** Callback when search input changes */
  onSearchChange: (value: string) => void;

  /** Selected from airport ID */
  fromAirportId: string | undefined;

  /** Callback when from airport changes */
  onFromAirportChange: (value: string | undefined) => void;

  /** Selected to airport ID */
  toAirportId: string | undefined;

  /** Callback when to airport changes */
  onToAirportChange: (value: string | undefined) => void;

  /** Selected airline IDs */
  airlineIds: string[];

  /** Callback when airlines change */
  onAirlinesChange: (value: string[]) => void;

  /** Whether there are active filters */
  hasActiveFilters: boolean;

  /** Callback to clear all filters */
  onClearFilters: () => void;
}

/**
 * Filter section for RouteListPage
 * Contains search, from/to airport, and airline filters
 */
export function RouteListFilters({
  searchInput,
  onSearchChange,
  fromAirportId,
  onFromAirportChange,
  toAirportId,
  onToAirportChange,
  airlineIds,
  onAirlinesChange,
  hasActiveFilters,
  onClearFilters,
}: RouteListFiltersProps) {
  return (
    <FilterForm
      hasActiveFilters={hasActiveFilters}
      onClearFilters={onClearFilters}
    >
      {/* Search Filter */}
      <div className="flex-1 min-w-[200px]">
        <Label htmlFor="search" className="mb-2 block">
          Search
        </Label>
        <Input
          id="search"
          placeholder="Search by route name..."
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* From Airport Filter */}
      <div className="flex-1 min-w-[200px]">
        <Label className="mb-2 block">From Airport</Label>
        <SearchableAirportSelect
          value={fromAirportId}
          onChange={onFromAirportChange}
          placeholder="Select departure..."
        />
      </div>

      {/* To Airport Filter */}
      <div className="flex-1 min-w-[200px]">
        <Label className="mb-2 block">To Airport</Label>
        <SearchableAirportSelect
          value={toAirportId}
          onChange={onToAirportChange}
          placeholder="Select arrival..."
        />
      </div>

      {/* Airlines Filter */}
      <div className="flex-1 min-w-[200px]">
        <Label className="mb-2 block">Airlines</Label>
        <MultiSelectAirline
          selected={airlineIds}
          onChange={onAirlinesChange}
          placeholder="Select airlines..."
        />
      </div>
    </FilterForm>
  );
}
