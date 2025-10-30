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
    name: "",
    imageUrl: "",
    title: "",
    company: "",
    content: "",
    rating: 5,
    isActive: true
  });

  // Fetch testimonial data
  const { data: testimonialResponse, isLoading, error } = useQuery({
    queryKey: ['testimonial', id],
    queryFn: () => testimonialService.getTestimonialById(id!),
    enabled: !!id,
  });

  // Update form data when testimonial data is loaded (robust to varying shapes)
  useEffect(() => {
    if (!testimonialResponse) return;
    const resp: any = testimonialResponse;
    const t: Partial<Testimonial> = resp?.data || resp?.testimonial || resp;
    if (!t) return;
    setFormData({
      name: t.name || "",
      imageUrl: t.imageUrl || "",
      title: t.title || "",
      company: t.company || "",
      content: t.content || "",
      rating: typeof t.rating === 'number' ? t.rating : 5,
      isActive: typeof t.isActive === 'boolean' ? t.isActive : true,
    });
  }, [testimonialResponse]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? (parseInt(value, 10) || 0) : (type === 'number' ? parseInt(value) || 0 : value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    
    if (!formData.company.trim()) {
      toast.error("Company is required");
      return;
    }
    
    if (!formData.content.trim()) {
      toast.error("Content is required");
      return;
    }
    
    if (formData.rating < 1 || formData.rating > 5) {
      toast.error("Rating must be between 1 and 5");
      return;
    }

    const testimonialData = {
      id: id!,
      name: formData.name.trim(),
      imageUrl: formData.imageUrl.trim() || "/images/user/default-avatar.jpg",
      title: formData.title.trim(),
      company: formData.company.trim(),
      content: formData.content.trim(),
      rating: formData.rating,
      isActive: formData.isActive
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
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Senior Software Engineer, Job Seeker"
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
                  <label htmlFor="isActive" className="block text-sm font-medium text-gray-700 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="isActive"
                    name="isActive"
                    value={formData.isActive.toString()}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      setFormData(prev => ({
                        ...prev,
                        [name]: value === "true"
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>

                {/* Content */}
                <div className="md:col-span-2">
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Enter testimonial content"
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
