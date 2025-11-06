import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { testimonialService } from "../services/testimonialService";
import { useTestimonialMutations } from "../hooks/useTestimonialMutations";
import { Testimonial } from "../services/types";
import { imageUploadService } from "../services/imageUploadService";

// File Upload Component
const FileUpload = ({ 
  onFileSelect,
  selectedFile,
  imagePreview,
  isUploading
}: { 
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  imagePreview: string | null;
  isUploading: boolean;
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
    }
    onFileSelect(file);
  };

  return (
    <div>
      <input
        type="file"
        id="profile-picture"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />
      <label
        htmlFor="profile-picture"
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 transition-colors ${
          isUploading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        {isUploading ? "Uploading..." : "Upload Image"}
      </label>
      {selectedFile && (
        <p className="text-sm text-gray-600 mt-1">{selectedFile.name}</p>
      )}
      {imagePreview && (
        <div className="mt-3">
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="w-32 h-32 object-cover rounded-md border border-gray-300"
          />
        </div>
      )}
    </div>
  );
};

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch testimonial data
  const { data: testimonialResponse, isLoading, error } = useQuery({
    queryKey: ['testimonial', id],
    queryFn: async () => {
      if (!id) throw new Error('Testimonial ID is required');
      return await testimonialService.getTestimonialById(id);
    },
    enabled: !!id,
  });

  // Image upload mutation
  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      return await imageUploadService.uploadImage(file, 'testimonials');
    },
    onSuccess: (imageUrl) => {
      setFormData(prev => ({
        ...prev,
        imageUrl
      }));
      toast.success("Image uploaded successfully");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to upload image";
      toast.error(errorMessage);
      console.error("Error uploading image:", error);
    },
  });

  // Update form data when testimonial data is loaded
  useEffect(() => {
    // Handle both wrapped response (ApiResponse) and direct response
    const testimonial = testimonialResponse?.data || testimonialResponse;
    
    if (testimonial && testimonial.id) {
      console.log('Loading testimonial data:', testimonial);
      const imageUrl = testimonial.imageUrl ?? "";
      setFormData({
        name: testimonial.name || "",
        imageUrl: imageUrl,
        title: testimonial.title ?? "",
        company: testimonial.company ?? "",
        content: testimonial.content || "",
        rating: testimonial.rating ?? 5,
        isActive: testimonial.isActive ?? true
      });
      // Set preview if image exists
      if (imageUrl) {
        setImagePreview(imageUrl);
      }
    }
  }, [testimonialResponse]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload image immediately
      uploadImageMutation.mutate(file);
    } else {
      setImagePreview(null);
      setFormData(prev => ({
        ...prev,
        imageUrl: ""
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    if (!id) {
      toast.error("Testimonial ID is missing");
      return;
    }

    // If a file was selected but upload is still in progress, wait for it
    if (selectedFile && uploadImageMutation.isPending) {
      toast.error("Please wait for image upload to complete");
      return;
    }

    // If a file was selected but no imageUrl yet, wait a bit
    if (selectedFile && !formData.imageUrl) {
      toast.error("Please wait for image upload to complete");
      return;
    }

    const testimonialData = {
      id: id,
      name: formData.name.trim(),
      imageUrl: formData.imageUrl.trim() || undefined,
      title: formData.title.trim() || undefined,
      company: formData.company.trim() || undefined,
      content: formData.content.trim(),
      rating: formData.rating,
      isActive: formData.isActive
    };

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

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Picture
                  </label>
                  <FileUpload 
                    onFileSelect={handleFileSelect}
                    selectedFile={selectedFile}
                    imagePreview={imagePreview}
                    isUploading={uploadImageMutation.isPending}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Upload an image or use the URL field below
                  </p>
                </div>

                {/* Image URL (Alternative) */}
                <div>
                  <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL (Alternative)
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
                  <p className="text-xs text-gray-500 mt-1">
                    If you upload an image above, this field will be auto-filled
                  </p>
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
                  disabled={updateTestimonialMutation.isPending || uploadImageMutation.isPending}
                  className="bg-blue-900 hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {updateTestimonialMutation.isPending 
                    ? "Updating..." 
                    : uploadImageMutation.isPending
                    ? "Uploading Image..."
                    : "Update Testimonial"}
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
