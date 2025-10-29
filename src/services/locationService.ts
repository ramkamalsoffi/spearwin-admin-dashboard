import api from '../utils/axios';
import { ApiResponse } from './types';

// Location types
export interface Country {
  id: number;
  name: string;
  iso3: string | null;
  iso2: string | null;
  numeric_code: string | null;
  phonecode: string | null;
  capital: string | null;
  currency: string | null;
  currency_name: string | null;
  currency_symbol: string | null;
  tld: string | null;
  native: string | null;
  region: string | null;
  region_id: number | null;
  subregion: string | null;
  subregion_id: number | null;
  nationality: string | null;
  latitude: string | null;
  longitude: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface State {
  id: number;
  name: string;
  country_id: number;
  country_code: string;
  fips_code: string | null;
  iso2: string | null;
  latitude: string | null;
  longitude: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  country?: Country;
}

export interface City {
  id: number;
  name: string;
  state_id: number;
  state_code: string | null;
  country_id: number;
  country_code: string | null;
  latitude: string | null;
  longitude: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  state?: State;
  country?: Country;
}

export const locationService = {
  // Get all countries
  getCountries: async (): Promise<ApiResponse<Country[]>> => {
    const response = await api.get('/locations/countries');
    console.log('🌍 Raw API response:', response.data);
    // The API returns the array directly, so we need to wrap it in the expected format
    return {
      success: true,
      data: response.data,
      message: 'Countries fetched successfully'
    };
  },

  // Get states of a specific country
  getStatesByCountry: async (countryId: number): Promise<ApiResponse<State[]>> => {
    const response = await api.get(`/locations/countries/${countryId}/states`);
    console.log('🏛️ Raw states API response:', response.data);
    return {
      success: true,
      data: response.data,
      message: 'States fetched successfully'
    };
  },

  // Get cities of a specific state
  getCitiesByState: async (stateId: number): Promise<ApiResponse<City[]>> => {
    const response = await api.get(`/locations/states/${stateId}/cities`);
    console.log('🏙️ Raw cities API response:', response.data);
    return {
      success: true,
      data: response.data,
      message: 'Cities fetched successfully'
    };
  },
};
