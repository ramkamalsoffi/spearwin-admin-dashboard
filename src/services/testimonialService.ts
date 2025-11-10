import api from '../utils/axios';
import { ApiResponse, Testimonial, CreateTestimonialRequest, UpdateTestimonialRequest } from './types';

export interface TestimonialQueryParams {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TestimonialListResponse {
  testimonials: Testimonial[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  statistics: {
    totalTestimonials: number;
    activeTestimonials: number;
    inactiveTestimonials: number;
    averageRating: number;
  };
}

export const testimonialService = {
  // Get all testimonials with query parameters
  getTestimonials: async (params?: TestimonialQueryParams): Promise<TestimonialListResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params?.search) {
      queryParams.append('search', params.search);
    }
    
    if (params?.isActive !== undefined) {
      // Convert boolean to string for URLSearchParams
      // false.toString() = "false", true.toString() = "true"
      queryParams.append('isActive', String(params.isActive));
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
    
    const queryString = queryParams.toString();
    const url = `/testimonials${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(url);
    return response.data;
  },

  // Get testimonial by ID
  getTestimonialById: async (id: string): Promise<any> => {
    const response = await api.get(`/testimonials/${id}`);
    // Backend returns testimonial directly, wrap it for consistency
    return {
      data: response.data,
      success: true,
      message: 'Testimonial retrieved successfully'
    };
  },

  // Create new testimonial
  createTestimonial: async (testimonialData: CreateTestimonialRequest): Promise<any> => {
    const response = await api.post('/testimonials', testimonialData);
    // Backend returns testimonial directly, wrap it for consistency
    return {
      data: response.data,
      success: true,
      message: 'Testimonial created successfully'
    };
  },

  // Update testimonial
  updateTestimonial: async (testimonialData: UpdateTestimonialRequest): Promise<any> => {
    const { id, ...updateData } = testimonialData;
    const response = await api.put(`/testimonials/${id}`, updateData);
    // Backend returns testimonial directly, wrap it for consistency
    return {
      data: response.data,
      success: true,
      message: 'Testimonial updated successfully'
    };
  },

  // Delete testimonial
  deleteTestimonial: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/testimonials/${id}`);
    return response.data;
  },
};
