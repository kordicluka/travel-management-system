import { useMutation, useQueryClient } from '@tanstack/react-query';
import { routesApi } from '../api';
import type { RouteUpdateInput } from '@/types';

export function useUpdateRoute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RouteUpdateInput }) =>
      routesApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['routes', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      queryClient.invalidateQueries({ queryKey: ['airports'] });
      queryClient.invalidateQueries({ queryKey: ['airlines'] });
    },
  });
}
