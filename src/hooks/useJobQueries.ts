import { useQuery } from "@tanstack/react-query";
import { jobService } from "../services";

export const useJobQueries = () => {
  // Get all jobs
  const useJobs = () => {
    return useQuery({
      queryKey: ['jobs'],
      queryFn: () => jobService.getJobs(),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Get job by ID
  const useJob = (id: string) => {
    return useQuery({
      queryKey: ['job', id],
      queryFn: () => jobService.getJobById(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  return {
    useJobs,
    useJob,
  };
};
