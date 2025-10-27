import { useQuery } from "@tanstack/react-query";
import { airlinesApi } from "../api";
import type { AirlineQuery } from "@/types";

export function useAirlines(query: AirlineQuery) {
  return useQuery({
    queryKey: ["airlines", query],
    queryFn: () => airlinesApi.findAll(query),
  });
}
