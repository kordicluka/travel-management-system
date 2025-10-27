import { apiClient } from '@/lib/api';
import type {
  Route,
  RouteQuery,
  RouteCreateInput,
  RouteUpdateInput,
  RouteResponse,
  RouteIncludeQuery,
  PaginatedResponse,
} from '@/types';

export const routesApi = {
  /**
   * Get paginated list of routes
   */
  findAll: async (query: RouteQuery): Promise<PaginatedResponse<RouteResponse>> => {
    const response = await apiClient.get<PaginatedResponse<RouteResponse>>('/routes', {
      params: query,
    });
    return response.data;
  },

  /**
   * Get single route by ID
   */
  findOne: async (id: string, query?: RouteIncludeQuery): Promise<RouteResponse> => {
    const response = await apiClient.get<RouteResponse>(`/routes/${id}`, {
      params: query,
    });
    return response.data;
  },

  /**
   * Create new route
   */
  create: async (data: RouteCreateInput): Promise<Route> => {
    const response = await apiClient.post<Route>('/routes', data);
    return response.data;
  },

  /**
   * Update existing route
   */
  update: async (id: string, data: RouteUpdateInput): Promise<Route> => {
    const response = await apiClient.patch<Route>(`/routes/${id}`, data);
    return response.data;
  },

  /**
   * Delete route
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/routes/${id}`);
  },
};
