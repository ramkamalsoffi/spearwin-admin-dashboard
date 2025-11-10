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
    onSuccess: (response, variables) => {
      // Invalidate queries first (without showing toast)
      const faqId = response?.data?.id || variables.id;
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      if (faqId) {
        queryClient.invalidateQueries({ queryKey: ['faq', faqId] });
      }
      // Show success toast only once
      toast.success("FAQ updated successfully!");
      // Navigate to FAQs list page
      navigate("/faqs");
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

  // Toggle FAQ status mutation
  const toggleFaqStatusMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      return faqService.updateFAQ({ id, active });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      toast.success(`FAQ ${variables.active ? 'activated' : 'deactivated'} successfully`);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to update FAQ status";
      toast.error(errorMessage);
      console.error("Error toggling FAQ status:", error);
    },
  });

  return {
    createFaqMutation,
    updateFaqMutation,
    deleteFaqMutation,
    toggleFaqStatusMutation,
  };
};
