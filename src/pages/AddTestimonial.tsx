import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { useTestimonialMutations } from "../hooks/useTestimonialMutations";
import { imageUploadService } from "../services/imageUploadService";

// Interactive Star Rating Component
const StarRating = ({ 
  rating, 
  onRatingChange 
}: { 
  rating: number; 
  onRatingChange: (rating: number) => void; 
}) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          className={`w-6 h-6 transition-colors ${
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          } hover:text-yellow-400`}
        >
          <svg
            className="w-full h-full"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
};

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

export default function AddTestimonial() {
  const navigate = useNavigate();
  const { createTestimonialMutation } = useTestimonialMutations();
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

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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
      name: formData.name.trim(),
      imageUrl: formData.imageUrl.trim() || "/images/user/default-avatar.jpg",
      title: formData.title.trim(),
      company: formData.company.trim(),
      content: formData.content.trim(),
      rating: formData.rating,
      isActive: formData.isActive
    };

    console.log('📤 Submitting testimonial data:', testimonialData);
    createTestimonialMutation.mutate(testimonialData);
  };

  const statusOptions = [
    { value: true, label: "Active" },
    { value: false, label: "Inactive" }
  ];

  return (
    <>
      <PageMeta
        title="Add Testimonial | spearwin-admin"
        description="Add new testimonial"
      />
      
      {/* Title Bar */}
      <div className="px-4 sm:px-6 lg:px-30 ">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
          <PageBreadcrumb 
            items={[
              { label: "Dashboard", path: "/" },
              { label: "Testimonials", path: "/testimonial" },
              { label: "Add Testimonial" }
            ]}
            showAdmin={true}
          />
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-30 py-4">
        <div className="bg-white rounded-[10px] shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL (Alternative)
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    If you upload an image above, this field will be auto-filled
                  </p>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="e.g., Senior Software Engineer, Job Seeker"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    placeholder="e.g., Tech Corp, Design Studio"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.isActive.toString()}
                    onChange={(e) => handleInputChange("isActive", e.target.value === "true")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value.toString()} value={option.value.toString()}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <StarRating 
                    rating={formData.rating} 
                    onRatingChange={(rating) => handleInputChange("rating", rating)} 
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                <button
                  type="submit"
                  disabled={createTestimonialMutation.isPending || uploadImageMutation.isPending}
                  className="bg-blue-900 hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {createTestimonialMutation.isPending 
                    ? "Creating..." 
                    : uploadImageMutation.isPending
                    ? "Uploading Image..."
                    : "Create Testimonial"}
                </button>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => handleInputChange("content", e.target.value)}
                    placeholder="Enter testimonial content"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
