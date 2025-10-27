import { useQuery } from "@tanstack/react-query";
import { airlinesApi } from "../api";
import type { AirlineIncludeQuery } from "@/types";

export function useAirline(
  id: string | undefined,
  query?: AirlineIncludeQuery
) {
  return useQuery({
    queryKey: ["airlines", id, query],
    queryFn: () => airlinesApi.findOne(id!, query),
    enabled: !!id,
  });
}
