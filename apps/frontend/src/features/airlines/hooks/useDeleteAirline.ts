import { useMutation, useQueryClient } from '@tanstack/react-query';
import { airlinesApi } from '../api';

export function useDeleteAirline() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => airlinesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['airlines'] });
      queryClient.invalidateQueries({ queryKey: ['routes'] });
    },
  });
}
