import type { AirlineResponse } from "@/types";
import { AirlineCard } from "./AirlineCard";

interface AirlineCardAdapterProps {
  item: AirlineResponse;
  onDelete?: (id: string) => void;
}

/**
 * Adapter to make AirlineCard compatible with ListContent generic interface
 */
export function AirlineCardAdapter({
  item,
  onDelete,
}: AirlineCardAdapterProps) {
  return <AirlineCard airline={item} onDelete={onDelete || (() => {})} />;
}
