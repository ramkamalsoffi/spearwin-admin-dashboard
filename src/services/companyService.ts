import api from '../lib/axios';
import { ApiResponse, Company, CreateCompanyRequest, UpdateCompanyRequest } from './types';

export const companyService = {
  // Get all companies
  getCompanies: async (): Promise<ApiResponse<Company[]>> => {
    const response = await api.get('/companies');
    return response.data;
  },

  // Get company by ID
  getCompanyById: async (id: string): Promise<ApiResponse<Company>> => {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  },

  // Create new company (ADMIN+)
  createCompany: async (companyData: CreateCompanyRequest): Promise<ApiResponse<Company>> => {
    const response = await api.post('/companies', companyData);
    return response.data;
  },

  // Update company
  updateCompany: async (companyData: UpdateCompanyRequest): Promise<ApiResponse<Company>> => {
    const { id, ...updateData } = companyData;
    const response = await api.put(`/companies/${id}`, updateData);
    return response.data;
  },

  // Delete company
  deleteCompany: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/companies/${id}`);
    return response.data;
  },

  // Update company status
  updateCompanyStatus: async (id: string, status: 'ACTIVE' | 'PENDING' | 'INACTIVE'): Promise<ApiResponse<Company>> => {
    const response = await api.patch(`/companies/${id}/status`, { status });
    return response.data;
  },
};

