import { apiClient } from '@/lib/api';
import type {
  Airline,
  AirlineQuery,
  AirlineCreateInput,
  AirlineUpdateInput,
  AirlineResponse,
  AirlineIncludeQuery,
  PaginatedResponse,
} from '@/types';

export const airlinesApi = {
  /**
   * Get paginated list of airlines
   */
  findAll: async (query: AirlineQuery): Promise<PaginatedResponse<AirlineResponse>> => {
    const response = await apiClient.get<PaginatedResponse<AirlineResponse>>('/airlines', {
      params: query,
    });
    return response.data;
  },

  /**
   * Get single airline by ID
   */
  findOne: async (id: string, query?: AirlineIncludeQuery): Promise<AirlineResponse> => {
    const response = await apiClient.get<AirlineResponse>(`/airlines/${id}`, {
      params: query,
    });
    return response.data;
  },

  /** 
   * Create new airline
   */
  create: async (data: AirlineCreateInput): Promise<Airline> => {
    const response = await apiClient.post<Airline>('/airlines', data);
    return response.data;
  },

  /**
   * Update existing airline
   */
  update: async (id: string, data: AirlineUpdateInput): Promise<Airline> => {
    const response = await apiClient.patch<Airline>(`/airlines/${id}`, data);
    return response.data;
  },

  /**
   * Delete airline
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/airlines/${id}`);
  },
};
