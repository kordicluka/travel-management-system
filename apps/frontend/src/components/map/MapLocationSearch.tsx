import { useState, useCallback, useEffect } from "react";
import { Search, MapPin, Globe, Loader2 } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useCountries } from "@/hooks/useCountries";
import { useDebounce } from "@/hooks/useDebounce";

interface LocationResult {
  name: string;
  type: "country" | "city";
  lat: number;
  lng: number;
}

interface MapLocationSearchProps {
  onLocationSelect: (
    lat: number,
    lng: number,
    name: string,
    type: "country" | "city"
  ) => void;
  placeholder?: string;
}

/**
 * Reusable location search component for maps
 * Searches both countries and cities, then zooms map to selected location
 */
export function MapLocationSearch({
  onLocationSelect,
  placeholder = "Search location...",
}: MapLocationSearchProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityResults, setCityResults] = useState<LocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { data: countries = [] } = useCountries();

  // Debounce search query - only search after user stops typing for 500ms
  const debouncedQuery = useDebounce(searchQuery, 500);

  // Search cities using Nominatim
  const searchCities = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setCityResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(query)}&format=json&limit=5&accept-language=en&addressdetails=1`
      );
      const data = await response.json();

      const results: LocationResult[] = data.map(
        (item: {
          lat: string;
          lon: string;
          display_name: string;
          address?: { city?: string; town?: string; village?: string };
        }) => ({
          name:
            item.address?.city ||
            item.address?.town ||
            item.address?.village ||
            item.display_name,
          type: "city" as const,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
        })
      );

      setCityResults(results);
    } catch (error) {
      console.error("City search failed:", error);
      setCityResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Trigger search only when debounced query changes
  useEffect(() => {
    searchCities(debouncedQuery);
  }, [debouncedQuery, searchCities]);

  // Filter countries by query
  const filteredCountries = searchQuery
    ? countries
        .filter((country) =>
          country.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleSelect = async (
    location: LocationResult | { name: string; type: "country" }
  ) => {
    if (location.type === "country") {
      // Geocode country
      setIsSearching(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?country=${encodeURIComponent(location.name)}&format=json&limit=1&accept-language=en`
        );
        const data = await response.json();
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
          onLocationSelect(lat, lng, location.name, "country");
        }
      } catch (error) {
        console.error("Country geocoding failed:", error);
      } finally {
        setIsSearching(false);
      }
    } else {
      // City already has coordinates
      onLocationSelect(location.lat, location.lng, location.name, "city");
    }

    setOpen(false);
    setSearchQuery("");
    setCityResults([]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-start text-muted-foreground"
        >
          <Search className="mr-2 h-4 w-4" />
          {placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 z-[1001]" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Type country or city name..."
            value={searchQuery}
            onValueChange={(value) => {
              setSearchQuery(value);
              // Show loading state immediately while waiting for debounce
              if (value.length >= 2) {
                setIsSearching(true);
              }
            }}
          />
          <CommandList>
            {isSearching ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm text-muted-foreground">
                  Searching...
                </span>
              </div>
            ) : (
              <>
                {!searchQuery && (
                  <CommandEmpty>
                    Type to search countries or cities
                  </CommandEmpty>
                )}
                {searchQuery &&
                  filteredCountries.length === 0 &&
                  cityResults.length === 0 && (
                    <CommandEmpty>No locations found</CommandEmpty>
                  )}

                {filteredCountries.length > 0 && (
                  <CommandGroup heading="Countries">
                    {filteredCountries.map((country) => (
                      <CommandItem
                        key={`country-${country}`}
                        value={country}
                        onSelect={() =>
                          handleSelect({ name: country, type: "country" })
                        }
                      >
                        <Globe className="mr-2 h-4 w-4" />
                        {country}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {cityResults.length > 0 && (
                  <CommandGroup heading="Cities">
                    {cityResults.map((city, idx) => (
                      <CommandItem
                        key={`city-${idx}`}
                        value={city.name}
                        onSelect={() => handleSelect(city)}
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        {city.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
