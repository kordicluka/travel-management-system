import * as React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { useCountries, geocodeCountry } from "@/hooks/useCountries";

interface CountrySearchProps {
  value?: string;
  onValueChange: (value: string) => void;
  onCountrySelect?: (lat: number, lng: number, country: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function CountrySearch({
  value,
  onValueChange,
  onCountrySelect,
  placeholder = "Select country...",
  disabled = false,
}: CountrySearchProps) {
  const [open, setOpen] = React.useState(false);
  const [geocoding, setGeocoding] = React.useState(false);
  const { data: countries = [], isLoading } = useCountries();

  const handleSelect = async (selectedCountry: string) => {
    onValueChange(selectedCountry);
    setOpen(false);

    // Geocode the country to zoom the map
    if (onCountrySelect) {
      setGeocoding(true);
      const coords = await geocodeCountry(selectedCountry);
      setGeocoding(false);

      if (coords) {
        onCountrySelect(coords.lat, coords.lng, selectedCountry);
      }
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled || isLoading || geocoding}
        >
          {geocoding ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Finding location...
            </>
          ) : (
            <>
              {value || placeholder}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandList>
            {isLoading ? (
              <CommandEmpty>Loading countries...</CommandEmpty>
            ) : (
              <>
                <CommandEmpty>No country found.</CommandEmpty>
                <CommandGroup>
                  {countries.map((country) => (
                    <CommandItem
                      key={country}
                      value={country}
                      onSelect={handleSelect}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === country ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {country}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
