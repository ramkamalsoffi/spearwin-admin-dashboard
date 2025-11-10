import api from '../utils/axios';
import { ApiResponse, PaginatedApiResponse, Company, CreateCompanyRequest, UpdateCompanyRequest } from './types';

export const companyService = {
  // Get all companies
  getCompanies: async (params?: { 
    isActive?: boolean; 
    search?: string; 
    page?: number; 
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<PaginatedApiResponse<Company[]>> => {
    const queryParams = new URLSearchParams();
    if (params?.isActive !== undefined) {
      queryParams.append('isActive', params.isActive.toString());
    }
    if (params?.search) {
      queryParams.append('search', params.search);
    }
    if (params?.page !== undefined) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.limit !== undefined) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params?.sortBy) {
      queryParams.append('sortBy', params.sortBy);
    }
    if (params?.sortOrder) {
      queryParams.append('sortOrder', params.sortOrder);
    }
    
    const url = params ? `/companies?${queryParams.toString()}` : '/companies';
    console.log('CompanyService - Making API call to:', url);
    console.log('CompanyService - Query params:', queryParams.toString());
    console.log('CompanyService - isActive param:', params?.isActive);
    console.log('CompanyService - search param:', params?.search);
    const response = await api.get(url);
    console.log('CompanyService - API Response:', response.data);
    console.log('CompanyService - Companies count:', response.data?.companies?.length || response.data?.data?.length);
    // The API returns { companies: [...], total, page, limit, totalPages }
    // Extract the companies array from the response
    return {
      success: true,
      data: response.data.companies || response.data.data || [],
      message: 'Companies retrieved successfully',
      // Include pagination info if available
      total: response.data.total,
      page: response.data.page,
      limit: response.data.limit,
      totalPages: response.data.totalPages
    };
  },

  // Get company by ID
  getCompanyById: async (id: string): Promise<ApiResponse<Company>> => {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  },

  // Create new company (ADMIN+)
  createCompany: async (companyData: CreateCompanyRequest): Promise<ApiResponse<Company>> => {
    const response = await api.post('/companies', companyData);
    // Backend returns company object directly, wrap it in ApiResponse format
    return {
      success: true,
      data: response.data,
      message: 'Company created successfully'
    };
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

  // Get active companies
  getActiveCompanies: async (params?: { 
    search?: string; 
    page?: number; 
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<PaginatedApiResponse<Company[]>> => {
    const queryParams = new URLSearchParams();
    if (params?.search) {
      queryParams.append('search', params.search);
    }
    if (params?.page !== undefined) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.limit !== undefined) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params?.sortBy) {
      queryParams.append('sortBy', params.sortBy);
    }
    if (params?.sortOrder) {
      queryParams.append('sortOrder', params.sortOrder);
    }
    
    const url = queryParams.toString() ? `/companies/active?${queryParams.toString()}` : '/companies/active';
    const response = await api.get(url);
    return {
      success: true,
      data: response.data.companies || response.data.data || [],
      message: 'Active companies retrieved successfully',
      total: response.data.total,
      page: response.data.page,
      limit: response.data.limit,
      totalPages: response.data.totalPages
    };
  },

  // Get inactive companies
  getInactiveCompanies: async (params?: { 
    search?: string; 
    page?: number; 
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<PaginatedApiResponse<Company[]>> => {
    const queryParams = new URLSearchParams();
    if (params?.search) {
      queryParams.append('search', params.search);
    }
    if (params?.page !== undefined) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.limit !== undefined) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params?.sortBy) {
      queryParams.append('sortBy', params.sortBy);
    }
    if (params?.sortOrder) {
      queryParams.append('sortOrder', params.sortOrder);
    }
    
    const url = queryParams.toString() ? `/companies/inactive?${queryParams.toString()}` : '/companies/inactive';
    const response = await api.get(url);
    return {
      success: true,
      data: response.data.companies || response.data.data || [],
      message: 'Inactive companies retrieved successfully',
      total: response.data.total,
      page: response.data.page,
      limit: response.data.limit,
      totalPages: response.data.totalPages
    };
  },
};

