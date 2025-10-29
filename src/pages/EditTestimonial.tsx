import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { testimonialService } from "../services/testimonialService";
import { useTestimonialMutations } from "../hooks/useTestimonialMutations";
import { Testimonial } from "../services/types";

export default function EditTestimonial() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { updateTestimonialMutation } = useTestimonialMutations();

  const [formData, setFormData] = useState({
    userName: "",
    userAvatar: "",
    role: "",
    company: "",
    feedback: "",
    rating: 5,
    status: "ACTIVE" as "ACTIVE" | "INACTIVE"
  });

  // Fetch testimonial data
  const { data: testimonialResponse, isLoading, error } = useQuery({
    queryKey: ['testimonial', id],
    queryFn: () => testimonialService.getTestimonialById(id!),
    enabled: !!id,
  });

  // Update form data when testimonial data is loaded
  useEffect(() => {
    if (testimonialResponse?.data) {
      const testimonial = testimonialResponse.data;
      setFormData({
        userName: testimonial.userName || "",
        userAvatar: testimonial.userAvatar || "",
        role: testimonial.role || "",
        company: testimonial.company || "",
        feedback: testimonial.feedback || "",
        rating: testimonial.rating || 5,
        status: testimonial.status || "ACTIVE"
      });
    }
  }, [testimonialResponse]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.userName.trim()) {
      toast.error("User name is required");
      return;
    }
    
    if (!formData.role.trim()) {
      toast.error("Role is required");
      return;
    }
    
    if (!formData.company.trim()) {
      toast.error("Company is required");
      return;
    }
    
    if (!formData.feedback.trim()) {
      toast.error("Feedback is required");
      return;
    }
    
    if (formData.rating < 1 || formData.rating > 5) {
      toast.error("Rating must be between 1 and 5");
      return;
    }

    const testimonialData = {
      id: id!,
      userName: formData.userName.trim(),
      userAvatar: formData.userAvatar.trim() || "/images/user/default-avatar.jpg",
      role: formData.role.trim(),
      company: formData.company.trim(),
      feedback: formData.feedback.trim(),
      rating: formData.rating,
      status: formData.status
    };

    console.log('📤 Submitting testimonial data:', testimonialData);
    updateTestimonialMutation.mutate(testimonialData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Testimonial</h2>
          <p className="text-gray-600 mb-4">Failed to load testimonial data</p>
          <button
            onClick={() => navigate("/testimonial")}
            className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Back to Testimonials
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Edit Testimonial | spearwin-admin"
        description="Edit testimonial"
      />
      
      {/* Title Bar */}
      <div className="px-4 sm:px-6 lg:px-30 ">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
          <PageBreadcrumb 
            items={[
              { label: "Dashboard", path: "/" },
              { label: "Testimonials", path: "/testimonial" },
              { label: "Edit Testimonial" }
            ]}
            showAdmin={true}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-30 py-2">
        {/* Form Card */}
        <div className="bg-white rounded-[10px] shadow-sm border border-gray-200">
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Name */}
                <div>
                  <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
                    User Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="userName"
                    name="userName"
                    value={formData.userName}
                    onChange={handleInputChange}
                    placeholder="Enter user name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* User Avatar */}
                <div>
                  <label htmlFor="userAvatar" className="block text-sm font-medium text-gray-700 mb-2">
                    User Avatar URL
                  </label>
                  <input
                    type="url"
                    id="userAvatar"
                    name="userAvatar"
                    value={formData.userAvatar}
                    onChange={handleInputChange}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Role */}
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    placeholder="e.g., Job Seeker, Software Engineer"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Company */}
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Company <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="e.g., Tech Corp, Design Studio"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Rating */}
                <div>
                  <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                    Rating <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="rating"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value={1}>1 Star</option>
                    <option value={2}>2 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={5}>5 Stars</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>

                {/* Feedback */}
                <div className="md:col-span-2">
                  <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
                    Feedback <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="feedback"
                    name="feedback"
                    value={formData.feedback}
                    onChange={handleInputChange}
                    placeholder="Enter testimonial feedback"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="mt-8 flex gap-4">
                <button
                  type="submit"
                  disabled={updateTestimonialMutation.isPending}
                  className="bg-blue-900 hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {updateTestimonialMutation.isPending ? "Updating..." : "Update Testimonial"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/testimonial")}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
