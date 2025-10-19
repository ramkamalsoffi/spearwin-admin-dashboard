import api from '../utils/axios';
import { ApiResponse, Country, CreateCountryRequest, UpdateCountryRequest } from './types';

export const countryService = {
  // Get all countries
  getCountries: async (): Promise<ApiResponse<Country[]>> => {
    const response = await api.get('/locations/countries');
    return response.data;
  },

  // Get country by ID
  getCountryById: async (id: string): Promise<ApiResponse<Country>> => {
    const response = await api.get(`/locations/countries/${id}`);
    return response.data;
  },

  // Create new country
  createCountry: async (countryData: CreateCountryRequest): Promise<ApiResponse<Country>> => {
    const response = await api.post('/locations/countries', countryData);
    return response.data;
  },

  // Update country
  updateCountry: async (countryData: UpdateCountryRequest): Promise<ApiResponse<Country>> => {
    const { id, ...updateData } = countryData;
    const response = await api.put(`/locations/countries/${id}`, updateData);
    return response.data;
  },

  // Delete country
  deleteCountry: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/locations/countries/${id}`);
    return response.data;
  },

  // Get states by country
  getStatesByCountry: async (countryId: string): Promise<ApiResponse<any[]>> => {
    const response = await api.get(`/locations/countries/${countryId}/states`);
    return response.data;
  },
};
