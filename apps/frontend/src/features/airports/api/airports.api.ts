import { apiClient } from "@/lib/api";
import type {
  Airport,
  AirportQuery,
  AirportCreateInput,
  AirportUpdateInput,
  AirportResponse,
  AirportIncludeQuery,
  PaginatedResponse,
} from "@/types";

export const airportsApi = {
  /**
   * Get paginated list of airports
   */
  findAll: async (query: AirportQuery): Promise<PaginatedResponse<AirportResponse>> => {
    const response = await apiClient.get<PaginatedResponse<AirportResponse>>(
      "/airports",
      {
        params: query,
      }
    );
    return response.data;
  },

  /**
   * Get single airport by ID
   */
  findOne: async (id: string, query?: AirportIncludeQuery): Promise<AirportResponse> => {
    const response = await apiClient.get<AirportResponse>(`/airports/${id}`, {
      params: query,
    });
    return response.data;
  },

  /**
   * Create new airport
   */
  create: async (data: AirportCreateInput): Promise<Airport> => {
    const response = await apiClient.post<Airport>("/airports", data);
    return response.data;
  },

  /**
   * Update existing airport
   */
  update: async (id: string, data: AirportUpdateInput): Promise<Airport> => {
    const response = await apiClient.patch<Airport>(
      `/airports/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Delete airport
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/airports/${id}`);
  },
};
