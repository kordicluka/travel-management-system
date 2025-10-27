import { useMutation, useQueryClient } from '@tanstack/react-query';
import { routesApi } from '../api';
import type { RouteCreateInput } from '@/types';

export function useCreateRoute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RouteCreateInput) => routesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      queryClient.invalidateQueries({ queryKey: ['airports'] });
      queryClient.invalidateQueries({ queryKey: ['airlines'] });
    },
  });
}
