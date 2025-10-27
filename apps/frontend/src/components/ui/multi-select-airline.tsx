import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "@/lib/utils";
import { useAirlines } from "@/features/airlines/hooks";

interface MultiSelectAirlineProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelectAirline({
  selected,
  onChange,
  placeholder = "Select airlines...",
  className,
}: MultiSelectAirlineProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const { data, isLoading } = useAirlines({
    page: 1,
    limit: 1000,
    sortBy: "name",
    sortOrder: "asc",
  });

  const airlines = data?.data || [];

  const handleUnselect = (airlineId: string) => {
    onChange(selected.filter((s) => s !== airlineId));
  };

  const handleSelect = (airlineId: string) => {
    if (selected.includes(airlineId)) {
      handleUnselect(airlineId);
    } else {
      onChange([...selected, airlineId]);
    }
    setInputValue("");
  };

  const selectables = airlines.filter((airline) => !selected.includes(airline.id));
  const filteredOptions = selectables.filter((airline) =>
    airline.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  const selectedAirlines = airlines.filter((airline) => selected.includes(airline.id));

  return (
    <Command className={cn("overflow-visible bg-transparent", className)}>
      <div className="group border border-input rounded-md px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex gap-1 flex-wrap">
          {selectedAirlines.map((airline) => {
            return (
              <Badge key={airline.id} variant="secondary">
                {airline.name}
                <button
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(airline.id);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(airline.id)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={selected.length === 0 ? placeholder : undefined}
            className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1 min-w-[120px]"
            disabled={isLoading}
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && filteredOptions.length > 0 ? (
          <div className="absolute w-full z-[9999] top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto max-h-64">
              {filteredOptions.map((airline) => (
                <CommandItem
                  key={airline.id}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onSelect={() => {
                    handleSelect(airline.id);
                    inputRef?.current?.focus();
                  }}
                  className="cursor-pointer"
                >
                  <div>
                    <div className="font-medium">{airline.name}</div>
                    <div className="text-xs text-muted-foreground">{airline.baseCountry}</div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        ) : null}
      </div>
    </Command>
  );
}
