import { useMutation, useQueryClient } from "@tanstack/react-query";
import { airportsApi } from "../api";
import type { AirportCreateInput } from "@/types";

export function useCreateAirport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AirportCreateInput) => airportsApi.create(data),
    onSuccess: () => {
      // Invalidate all airport queries to refetch data
      void queryClient.invalidateQueries({ queryKey: ["airports"] });
    },
  });
}
