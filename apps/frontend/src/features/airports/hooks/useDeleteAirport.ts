import { useMutation, useQueryClient } from '@tanstack/react-query';
import { airportsApi } from '../api';

export function useDeleteAirport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => airportsApi.delete(id),
    onSuccess: () => {
      // Invalidate all airport and route queries
      queryClient.invalidateQueries({ queryKey: ['airports'] });
      queryClient.invalidateQueries({ queryKey: ['routes'] });
    },
  });
}
