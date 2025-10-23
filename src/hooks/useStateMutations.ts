import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import { statesService } from "../services";
import { CreateStateRequest, UpdateStateRequest } from "../services/types";

export const useStateMutations = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Create state mutation
  const createStateMutation = useMutation({
    mutationFn: (stateData: CreateStateRequest) => statesService.createState(stateData),
    onSuccess: () => {
      toast.success("State created successfully!");
      queryClient.invalidateQueries({ queryKey: ['states'] });
      navigate("/states");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to create state";
      toast.error(errorMessage);
      console.error("Error creating state:", error);
    },
  });

  // Update state mutation
  const updateStateMutation = useMutation({
    mutationFn: (stateData: UpdateStateRequest) => statesService.updateState(stateData),
    onSuccess: (response) => {
      toast.success("State updated successfully!");
      queryClient.invalidateQueries({ queryKey: ['states'] });
      queryClient.invalidateQueries({ queryKey: ['state', response.data.id] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to update state";
      toast.error(errorMessage);
      console.error("Error updating state:", error);
    },
  });

  // Delete state mutation
  const deleteStateMutation = useMutation({
    mutationFn: (id: string | number) => statesService.deleteState(String(id)),
    onSuccess: () => {
      toast.success("State deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ['states'] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to delete state";
      toast.error(errorMessage);
      console.error("Error deleting state:", error);
    },
  });

  return {
    createStateMutation,
    updateStateMutation,
    deleteStateMutation,
  };
};
