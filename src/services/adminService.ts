import api from '../utils/axios';
import { ApiResponse, LoginRequest, LoginResponse } from './types';

export const adminService = {
  // Admin login
  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },
};
