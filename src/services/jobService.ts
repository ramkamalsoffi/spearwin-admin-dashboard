import api from '../utils/axios';
import { ApiResponse, PaginatedApiResponse, Job, CreateJobRequest, UpdateJobRequest } from './types';

export interface JobQueryParams {
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  company?: string;
  city?: string;
  type?: string;
  experience?: string;
}

export const jobService = {
  // Get all jobs with optional filters
  getJobs: async (params?: JobQueryParams): Promise<PaginatedApiResponse<Job[]>> => {
    // Build query string from params
    const queryParams = new URLSearchParams();
    
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.company) queryParams.append('company', params.company);
    if (params?.city) queryParams.append('city', params.city);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.experience) queryParams.append('experience', params.experience);
    
    const queryString = queryParams.toString();
    const url = `/api/admin/jobs${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(url);
    // The API returns { jobs: [...], total, page, limit, totalPages }
    return {
      success: true,
      data: response.data.jobs || [],
      message: 'Jobs retrieved successfully',
      // Include pagination info
      total: response.data.total,
      page: response.data.page,
      limit: response.data.limit,
      totalPages: response.data.totalPages
    };
  },

  // Get job by ID
  getJobById: async (id: string): Promise<ApiResponse<Job>> => {
    const response = await api.get(`/api/admin/jobs/${id}`);
    return response.data;
  },

  // Create new job
  createJob: async (jobData: CreateJobRequest): Promise<ApiResponse<Job>> => {
    const response = await api.post('/api/admin/jobs', jobData);
    return response.data;
  },

  // Update job
  updateJob: async (jobData: UpdateJobRequest): Promise<ApiResponse<Job>> => {
    const { id, ...updateData } = jobData;
    const response = await api.put(`/api/admin/jobs/${id}`, updateData);
    return response.data;
  },

  // Delete job
  deleteJob: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/api/admin/jobs/${id}`);
    return response.data;
  },

  // Update job status
  updateJobStatus: async (id: string, status: string): Promise<ApiResponse<Job>> => {
    const response = await api.put(`/api/admin/jobs/${id}/status`, { status });
    return response.data;
  },

  // Get job applications
  getJobApplications: async (jobId: string, params?: { page?: number; limit?: number }): Promise<any> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const queryString = queryParams.toString();
    const url = `/api/admin/jobs/${jobId}/applications${queryString ? `?${queryString}` : ''}`;
    const response = await api.get(url);
    return response.data;
  },
};
