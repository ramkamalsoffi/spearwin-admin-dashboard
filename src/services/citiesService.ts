import api from '../lib/axios';
import { ApiResponse, City, CreateCityRequest, UpdateCityRequest } from './types';

export const citiesService = {
  // Get all cities
  getCities: async (): Promise<ApiResponse<City[]>> => {
    const response = await api.get('/locations/cities');
    return response.data;
  },

  // Get cities by state ID
  getCitiesByStateId: async (stateId: string): Promise<ApiResponse<City[]>> => {
    const response = await api.get(`/locations/states/${stateId}/cities`);
    return response.data;
  },

  // Get city by ID
  getCityById: async (id: string): Promise<ApiResponse<City>> => {
    const response = await api.get(`/locations/cities/${id}`);
    return response.data;
  },

  // Create new city
  createCity: async (cityData: CreateCityRequest): Promise<ApiResponse<City>> => {
    const response = await api.post('/locations/cities', cityData);
    return response.data;
  },

  // Update city
  updateCity: async (cityData: UpdateCityRequest): Promise<ApiResponse<City>> => {
    const { id, ...updateData } = cityData;
    const response = await api.put(`/locations/cities/${id}`, updateData);
    return response.data;
  },

  // Delete city
  deleteCity: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/locations/cities/${id}`);
    return response.data;
  },
};
