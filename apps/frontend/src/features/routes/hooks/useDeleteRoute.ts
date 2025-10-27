import { useMutation, useQueryClient } from '@tanstack/react-query';
import { routesApi } from '../api';

export function useDeleteRoute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => routesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      queryClient.invalidateQueries({ queryKey: ['airports'] });
      queryClient.invalidateQueries({ queryKey: ['airlines'] });
    },
  });
}
