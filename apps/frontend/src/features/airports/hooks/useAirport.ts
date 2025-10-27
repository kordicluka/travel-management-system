import { useQuery } from "@tanstack/react-query";
import { airportsApi } from "../api";
import type { AirportIncludeQuery } from "@/types";

export function useAirport(
  id: string | undefined,
  query?: AirportIncludeQuery
) {
  return useQuery({
    queryKey: ["airports", id, query],
    queryFn: () => airportsApi.findOne(id!, query),
    enabled: !!id,
  });
}
