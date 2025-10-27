import { FilterForm } from "@/components/list";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelectCountry } from "@/components/ui/multi-select-country";

interface AirportListFiltersProps {
  /** Search input value */
  searchInput: string;

  /** Callback when search input changes */
  onSearchChange: (value: string) => void;

  /** Code input value */
  codeInput: string;

  /** Callback when code input changes */
  onCodeChange: (value: string) => void;

  /** Selected countries */
  countries: string[];

  /** Callback when countries change */
  onCountriesChange: (countries: string[]) => void;

  /** Whether there are active filters */
  hasActiveFilters: boolean;

  /** Callback to clear all filters */
  onClearFilters: () => void;
}

/**
 * Filter section for AirportListPage
 * Contains search, code, and country filters
 */
export function AirportListFilters({
  searchInput,
  onSearchChange,
  codeInput,
  onCodeChange,
  countries,
  onCountriesChange,
  hasActiveFilters,
  onClearFilters,
}: AirportListFiltersProps) {
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

      {/* Code Filter */}
      <div className="flex-1 min-w-[150px]">
        <Label htmlFor="code" className="mb-2 block">
          Code
        </Label>
        <Input
          id="code"
          placeholder="e.g., JFK"
          value={codeInput}
          onChange={(e) => onCodeChange(e.target.value)}
          maxLength={3}
        />
      </div>

      {/* Countries Filter */}
      <div className="flex-1 min-w-[200px]">
        <Label className="mb-2 block">Countries</Label>
        <MultiSelectCountry
          selected={countries}
          onChange={onCountriesChange}
          placeholder="Select countries..."
        />
      </div>
    </FilterForm>
  );
}
