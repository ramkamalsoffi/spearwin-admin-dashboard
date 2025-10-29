import api from '../utils/axios';
import { ApiResponse, Testimonial, CreateTestimonialRequest, UpdateTestimonialRequest } from './types';

export const testimonialService = {
  // Get all testimonials
  getTestimonials: async (): Promise<ApiResponse<Testimonial[]>> => {
    const response = await api.get('/testimonials');
    return response.data;
  },

  // Get testimonial by ID
  getTestimonialById: async (id: string): Promise<ApiResponse<Testimonial>> => {
    const response = await api.get(`/testimonials/${id}`);
    return response.data;
  },

  // Create new testimonial
  createTestimonial: async (testimonialData: CreateTestimonialRequest): Promise<ApiResponse<Testimonial>> => {
    const response = await api.post('/testimonials', testimonialData);
    return response.data;
  },

  // Update testimonial
  updateTestimonial: async (testimonialData: UpdateTestimonialRequest): Promise<ApiResponse<Testimonial>> => {
    const { id, ...updateData } = testimonialData;
    const response = await api.put(`/testimonials/${id}`, updateData);
    return response.data;
  },

  // Delete testimonial
  deleteTestimonial: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/testimonials/${id}`);
    return response.data;
  },
};
