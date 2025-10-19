import api from '../utils/axios';
import { ApiResponse, State, CreateStateRequest, UpdateStateRequest } from './types';

export const statesService = {
  // Get all states
  getStates: async (): Promise<ApiResponse<State[]>> => {
    const response = await api.get('/locations/states');
    return response.data;
  },

  // Get states by country ID
  getStatesByCountryId: async (countryId: string): Promise<ApiResponse<State[]>> => {
    const response = await api.get(`/locations/countries/${countryId}/states`);
    return response.data;
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
