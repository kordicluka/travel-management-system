import { useQuery } from '@tanstack/react-query';
import { routesApi } from '../api';
import type { RouteIncludeQuery } from '@/types';

export function useRoute(id: string | undefined, query?: RouteIncludeQuery) {
  return useQuery({
    queryKey: ['routes', id, query],
    queryFn: () => routesApi.findOne(id!, query),
    enabled: !!id,
  });
}
