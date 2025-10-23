import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import { faqService } from "../services/faqService";
import { CreateFAQRequest, UpdateFAQRequest } from "../services/types";

export const useFaqMutations = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Create FAQ mutation
  const createFaqMutation = useMutation({
    mutationFn: (faqData: CreateFAQRequest) => faqService.createFAQ(faqData),
    onSuccess: () => {
      toast.success("FAQ created successfully!");
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      navigate("/faqs");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to create FAQ";
      toast.error(errorMessage);
      console.error("Error creating FAQ:", error);
    },
  });

  // Update FAQ mutation
  const updateFaqMutation = useMutation({
    mutationFn: (faqData: UpdateFAQRequest) => faqService.updateFAQ(faqData),
    onSuccess: (response) => {
      toast.success("FAQ updated successfully!");
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      queryClient.invalidateQueries({ queryKey: ['faq', response.data.id] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to update FAQ";
      toast.error(errorMessage);
      console.error("Error updating FAQ:", error);
    },
  });

  // Delete FAQ mutation
  const deleteFaqMutation = useMutation({
    mutationFn: (id: string) => faqService.deleteFAQ(id),
    onSuccess: () => {
      toast.success("FAQ deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to delete FAQ";
      toast.error(errorMessage);
      console.error("Error deleting FAQ:", error);
    },
  });

  return {
    createFaqMutation,
    updateFaqMutation,
    deleteFaqMutation,
  };
};
