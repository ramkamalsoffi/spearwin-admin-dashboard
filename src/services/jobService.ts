import api from '../lib/axios';
import { ApiResponse, Job, CreateJobRequest, UpdateJobRequest } from './types';

export const jobService = {
  // Get all jobs
  getJobs: async (): Promise<ApiResponse<Job[]>> => {
    const response = await api.get('/jobs');
    return response.data;
  },

  // Get job by ID
  getJobById: async (id: string): Promise<ApiResponse<Job>> => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  // Create new job
  createJob: async (jobData: CreateJobRequest): Promise<ApiResponse<Job>> => {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },

  // Update job
  updateJob: async (jobData: UpdateJobRequest): Promise<ApiResponse<Job>> => {
    const { id, ...updateData } = jobData;
    const response = await api.put(`/jobs/${id}`, updateData);
    return response.data;
  },

  // Delete job
  deleteJob: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  },

  // Update job status
  updateJobStatus: async (id: string, status: string): Promise<ApiResponse<Job>> => {
    const response = await api.patch(`/jobs/${id}/stats`, { status });
    return response.data;
  },
};
