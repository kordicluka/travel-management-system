import { useQuery } from '@tanstack/react-query';
import { routesApi } from '../api';
import type { RouteQuery } from '@/types';

export function useRoutes(query: RouteQuery) {
  return useQuery({
    queryKey: ['routes', query],
    queryFn: () => routesApi.findAll(query),
  });
}
