import api from '../utils/axios';
import { ApiResponse, City, CreateCityRequest, UpdateCityRequest } from './types';

export const citiesService = {
  // Get all cities with pagination
  getCities: async (page: number = 1, limit: number = 10, search?: string): Promise<ApiResponse<City[]>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search })
    });
    const response = await api.get(`/locations/cities?${params}`);
    // The API returns cities array directly, wrap it in ApiResponse format
    return {
      success: true,
      data: response.data,
      message: 'Cities retrieved successfully'
    };
  },

  // Get cities by state ID with pagination
  getCitiesByStateId: async (stateId: string, page: number = 1, limit: number = 10, search?: string): Promise<ApiResponse<City[]>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search })
    });
    const response = await api.get(`/locations/states/${stateId}/cities?${params}`);
    // The API returns cities array directly, wrap it in ApiResponse format
    return {
      success: true,
      data: response.data,
      message: 'Cities retrieved successfully'
    };
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
