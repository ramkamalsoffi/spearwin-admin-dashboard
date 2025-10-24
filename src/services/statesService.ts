import api from '../utils/axios';
import { ApiResponse, State, CreateStateRequest, UpdateStateRequest } from './types';

export const statesService = {
  // Get all states
  getStates: async (): Promise<ApiResponse<State[]>> => {
    const response = await api.get('/locations/states');
    // The API returns data in format: { states: [...], total: number, hasMore: boolean } or just [...]
    return {
      success: true,
      data: response.data.states || response.data, // Handle both formats
      message: 'States retrieved successfully'
    };
  },

  // Get states by country ID
  getStatesByCountryId: async (countryId: string): Promise<ApiResponse<State[]>> => {
    const response = await api.get(`/locations/countries/${countryId}/states`);
    // The API returns data in format: { states: [...], total: number, hasMore: boolean } or just [...]
    return {
      success: true,
      data: response.data.states || response.data, // Handle both formats
      message: 'States retrieved successfully'
    };
  },

  // Get state by ID
  getStateById: async (id: string): Promise<ApiResponse<State>> => {
    const response = await api.get(`/locations/states/${id}`);
    return response.data;
  },

  // Create new state
  createState: async (stateData: CreateStateRequest): Promise<ApiResponse<State>> => {
    const response = await api.post('/locations/states', stateData);
    return response.data;
  },

  // Update state
  updateState: async (stateData: UpdateStateRequest): Promise<ApiResponse<State>> => {
    const { id, ...updateData } = stateData;
    const response = await api.put(`/locations/states/${id}`, updateData);
    return response.data;
  },

  // Delete state
  deleteState: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/locations/states/${id}`);
    return response.data;
  },
};
