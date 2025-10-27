import { useMutation, useQueryClient } from '@tanstack/react-query';
import { airlinesApi } from '../api';
import type { AirlineUpdateInput } from '@/types';

export function useUpdateAirline() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AirlineUpdateInput }) =>
      airlinesApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['airlines', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['airlines'] });
      queryClient.invalidateQueries({ queryKey: ['airports'] });
      queryClient.invalidateQueries({ queryKey: ['routes'] });
    },
  });
}
