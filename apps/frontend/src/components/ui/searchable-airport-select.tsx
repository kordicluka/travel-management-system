import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useAirports } from "@/features/airports/hooks";

interface SearchableAirportSelectProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  className?: string;
}

export function SearchableAirportSelect({
  value,
  onChange,
  placeholder = "Select airport...",
  className,
}: SearchableAirportSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const { data, isLoading } = useAirports({
    page: 1,
    limit: 1000,
    sortBy: "name",
    sortOrder: "asc",
    search: search || undefined,
  });

  const airports = data?.data || [];
  const selectedAirport = airports.find((airport) => airport.id === value);

  const handleSelect = (airportId: string) => {
    onChange(airportId === value ? undefined : airportId);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", className)}
        >
          {selectedAirport ? (
            <div className="flex items-center justify-between flex-1">
              <span>
                {selectedAirport.code} - {selectedAirport.name}
              </span>
              <X
                className="ml-2 h-4 w-4 shrink-0 opacity-50 hover:opacity-100"
                onClick={handleClear}
              />
            </div>
          ) : (
            <>
              <span>{placeholder}</span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput
            placeholder="Search airports..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandEmpty>
            {isLoading ? "Loading..." : "No airport found."}
          </CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {airports.map((airport) => (
              <CommandItem
                key={airport.id}
                value={airport.id}
                onSelect={handleSelect}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === airport.id ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <div className="font-medium">
                    {airport.code} - {airport.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {airport.country}
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
