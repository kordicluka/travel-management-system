import { useMutation, useQueryClient } from "@tanstack/react-query";
import { airportsApi } from "../api";
import type { AirportUpdateInput } from "@/types";

export function useUpdateAirport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AirportUpdateInput }) =>
      airportsApi.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate the specific airport and the list
      queryClient.invalidateQueries({ queryKey: ["airports", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["airports"] });
    },
  });
}
