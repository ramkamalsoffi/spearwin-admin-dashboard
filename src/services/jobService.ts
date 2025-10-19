import api from '../utils/axios';
import { ApiResponse, Job, CreateJobRequest, UpdateJobRequest } from './types';

export const jobService = {
  // Get all jobs
  getJobs: async (): Promise<ApiResponse<Job[]>> => {
    const response = await api.get('/api/admin/jobs');
    return response.data;
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
    const response = await api.patch(`/api/admin/jobs/${id}/status`, { status });
    return response.data;
  },
};
