import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import { testimonialService } from "../services/testimonialService";
import { CreateTestimonialRequest, UpdateTestimonialRequest } from "../services/types";

export const useTestimonialMutations = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Create testimonial mutation
  const createTestimonialMutation = useMutation({
    mutationFn: (testimonialData: CreateTestimonialRequest) => testimonialService.createTestimonial(testimonialData),
    onSuccess: () => {
      toast.success("Testimonial created successfully!");
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      navigate("/testimonial");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to create testimonial";
      toast.error(errorMessage);
      console.error("Error creating testimonial:", error);
    },
  });

  // Update testimonial mutation
  const updateTestimonialMutation = useMutation({
    mutationFn: async (testimonialData: UpdateTestimonialRequest) => {
      try {
        return await testimonialService.updateTestimonial(testimonialData);
      } catch (error: any) {
        // Re-throw to trigger onError handler
        throw error;
      }
    },
    onSuccess: (response) => {
      // Handle both wrapped response and direct response
      const testimonialId = response?.data?.id || response?.id;
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      if (testimonialId) {
        queryClient.invalidateQueries({ queryKey: ['testimonial', testimonialId.toString()] });
      }
      queryClient.invalidateQueries({ queryKey: ['testimonial'] });
      toast.success("Testimonial updated successfully!");
      // Navigate back to testimonials list after a short delay to show the success message
      setTimeout(() => {
        navigate("/testimonial");
      }, 1000);
    },
    onError: (error: any) => {
      console.error("Error updating testimonial:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to update testimonial";
      toast.error(errorMessage);
    },
  });

  // Delete testimonial mutation
  const deleteTestimonialMutation = useMutation({
    mutationFn: (id: string) => testimonialService.deleteTestimonial(id),
    onSuccess: () => {
      toast.success("Testimonial deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to delete testimonial";
      toast.error(errorMessage);
      console.error("Error deleting testimonial:", error);
    },
  });

  return {
    createTestimonialMutation,
    updateTestimonialMutation,
    deleteTestimonialMutation,
  };
};
