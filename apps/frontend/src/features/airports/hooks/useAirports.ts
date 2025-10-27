import { useQuery } from "@tanstack/react-query";
import { airportsApi } from "../api";
import type { AirportQuery } from "@/types";

export function useAirports(query: AirportQuery) {
  return useQuery({
    queryKey: ["airports", query],
    queryFn: () => airportsApi.findAll(query),
  });
}
