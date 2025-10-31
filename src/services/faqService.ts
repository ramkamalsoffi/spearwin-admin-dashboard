import api from '../utils/axios';
import { ApiResponse, FAQ, CreateFAQRequest, UpdateFAQRequest } from './types';

export interface FaqQueryParams {
  search?: string;
  active?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface FaqListResponse {
  faqs: FAQ[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export const faqService = {
  // Get all FAQs with query parameters
  getFAQs: async (params?: FaqQueryParams): Promise<FaqListResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.active !== undefined) queryParams.append('active', params.active.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    
    const queryString = queryParams.toString();
    const url = `/api/admin/faqs${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(url);
    return response.data;
  },

  // Get FAQ by ID
  getFAQById: async (id: string): Promise<ApiResponse<FAQ>> => {
    const response = await api.get(`/api/admin/faqs/${id}`);
    return response.data;
  },

  // Create new FAQ
  createFAQ: async (faqData: CreateFAQRequest): Promise<ApiResponse<FAQ>> => {
    const response = await api.post('/api/admin/faqs', faqData);
    return response.data;
  },

  // Update FAQ
  updateFAQ: async (faqData: UpdateFAQRequest): Promise<ApiResponse<FAQ>> => {
    const { id, ...updateData } = faqData;
    const response = await api.put(`/api/admin/faqs/${id}`, updateData);
    return response.data;
  },

  // Delete FAQ
  deleteFAQ: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/api/admin/faqs/${id}`);
    return response.data;
  },

};
