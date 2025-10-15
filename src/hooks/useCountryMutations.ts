import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import { countryService } from "../services";
import { CreateCountryRequest, UpdateCountryRequest } from "../services/types";

export const useCountryMutations = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Create country mutation
  const createCountryMutation = useMutation({
    mutationFn: (countryData: CreateCountryRequest) => countryService.createCountry(countryData),
    onSuccess: (response) => {
      toast.success("Country created successfully!");
      queryClient.invalidateQueries({ queryKey: ['countries'] });
      navigate("/countries");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to create country";
      toast.error(errorMessage);
      console.error("Error creating country:", error);
    },
  });

  // Update country mutation
  const updateCountryMutation = useMutation({
    mutationFn: (countryData: UpdateCountryRequest) => countryService.updateCountry(countryData),
    onSuccess: (response) => {
      toast.success("Country updated successfully!");
      queryClient.invalidateQueries({ queryKey: ['countries'] });
      queryClient.invalidateQueries({ queryKey: ['country', response.data.id] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to update country";
      toast.error(errorMessage);
      console.error("Error updating country:", error);
    },
  });

  // Delete country mutation
  const deleteCountryMutation = useMutation({
    mutationFn: (id: string) => countryService.deleteCountry(id),
    onSuccess: () => {
      toast.success("Country deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ['countries'] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to delete country";
      toast.error(errorMessage);
      console.error("Error deleting country:", error);
    },
  });

  return {
    createCountryMutation,
    updateCountryMutation,
    deleteCountryMutation,
  };
};
