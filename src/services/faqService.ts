import api from '../utils/axios';
import { ApiResponse, FAQ, CreateFAQRequest, UpdateFAQRequest } from './types';

export const faqService = {
  // Get all FAQs
  getFAQs: async (): Promise<ApiResponse<FAQ[]>> => {
    const response = await api.get('/api/admin/faqs');
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
