import { useMutation } from '@tanstack/react-query';
import { jobsApi, CreateJobDto } from '../services/jobsApi';

// Hook to create job
export const useCreateJob = () => {
  return useMutation({
    mutationFn: (jobData: CreateJobDto) => jobsApi.createJob(jobData),
  });
};
