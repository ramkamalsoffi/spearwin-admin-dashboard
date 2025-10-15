import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import { jobService } from "../services";
import { CreateJobRequest, UpdateJobRequest } from "../services/types";

export const useJobMutations = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Create job mutation
  const createJobMutation = useMutation({
    mutationFn: (jobData: CreateJobRequest) => jobService.createJob(jobData),
    onSuccess: (response) => {
      toast.success("Job created successfully!");
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      navigate("/jobs");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to create job";
      toast.error(errorMessage);
      console.error("Error creating job:", error);
    },
  });

  // Update job mutation
  const updateJobMutation = useMutation({
    mutationFn: (jobData: UpdateJobRequest) => jobService.updateJob(jobData),
    onSuccess: (response) => {
      toast.success("Job updated successfully!");
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['job', response.data.id] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to update job";
      toast.error(errorMessage);
      console.error("Error updating job:", error);
    },
  });

  // Delete job mutation
  const deleteJobMutation = useMutation({
    mutationFn: (id: string) => jobService.deleteJob(id),
    onSuccess: () => {
      toast.success("Job deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to delete job";
      toast.error(errorMessage);
      console.error("Error deleting job:", error);
    },
  });

  // Update job status mutation
  const updateJobStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      jobService.updateJobStatus(id, status),
    onSuccess: (response) => {
      toast.success("Job status updated successfully!");
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['job', response.data.id] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to update job status";
      toast.error(errorMessage);
      console.error("Error updating job status:", error);
    },
  });

  return {
    createJobMutation,
    updateJobMutation,
    deleteJobMutation,
    updateJobStatusMutation,
  };
};
