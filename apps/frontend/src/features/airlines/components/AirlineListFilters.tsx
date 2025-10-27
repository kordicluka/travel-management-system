import { FilterForm } from '@/components/list';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelectCountry } from '@/components/ui/multi-select-country';

interface AirlineListFiltersProps {
  /** Search input value */
  searchInput: string;

  /** Callback when search input changes */
  onSearchChange: (value: string) => void;

  /** Selected base countries */
  baseCountries: string[];

  /** Callback when base countries change */
  onBaseCountriesChange: (countries: string[]) => void;

  /** Whether there are active filters */
  hasActiveFilters: boolean;

  /** Callback to clear all filters */
  onClearFilters: () => void;
}

/**
 * Filter section for AirlineListPage
 * Contains search and base country filters
 */
export function AirlineListFilters({
  searchInput,
  onSearchChange,
  baseCountries,
  onBaseCountriesChange,
  hasActiveFilters,
  onClearFilters,
}: AirlineListFiltersProps) {
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
          placeholder="Search by name..."
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Base Countries Filter */}
      <div className="flex-1 min-w-[200px]">
        <Label className="mb-2 block">Base Countries</Label>
        <MultiSelectCountry
          selected={baseCountries}
          onChange={onBaseCountriesChange}
          placeholder="Select countries..."
        />
      </div>
    </FilterForm>
  );
}
