import { useMutation, useQueryClient } from '@tanstack/react-query';
import { airlinesApi } from '../api';
import type { AirlineCreateInput } from '@/types';

export function useCreateAirline() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AirlineCreateInput) => airlinesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['airlines'] });
    },
  });
}
