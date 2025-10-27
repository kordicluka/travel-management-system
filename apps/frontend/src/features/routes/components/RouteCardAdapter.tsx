import type { RouteResponse } from "@/types";
import { RouteCard } from "./RouteCard";

interface RouteCardAdapterProps {
  item: RouteResponse;
  onDelete?: (id: string) => void;
}

/**
 * Adapter to make RouteCard compatible with ListContent generic interface
 */
export function RouteCardAdapter({ item, onDelete }: RouteCardAdapterProps) {
  return <RouteCard route={item} onDelete={onDelete || (() => {})} />;
}
