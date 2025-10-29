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
    mutationFn: (testimonialData: UpdateTestimonialRequest) => testimonialService.updateTestimonial(testimonialData),
    onSuccess: (response) => {
      toast.success("Testimonial updated successfully!");
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonial', response.data.id] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to update testimonial";
      toast.error(errorMessage);
      console.error("Error updating testimonial:", error);
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
