import api from '../utils/axios';
import { ApiResponse, Testimonial, CreateTestimonialRequest, UpdateTestimonialRequest } from './types';

export const testimonialService = {
  // Get all testimonials
  getTestimonials: async (): Promise<ApiResponse<Testimonial[]>> => {
    const response = await api.get('/testimonials');
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
