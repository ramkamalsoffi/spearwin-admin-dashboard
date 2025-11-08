import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { companyService } from "../services";
import { locationService, Country, State, City } from "../services/locationService";
import { CreateCompanyRequest } from "../services/types";
import { imageUploadService } from "../services/imageUploadService";

export default function AddCompany() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    website: "",
    logo: "",
    industry: "",
    foundedYear: new Date().getFullYear(),
    employeeCount: "",
    headquarters: "",
    address: "",
    country: "",
    state: "",
    city: "",
    linkedinUrl: "",
    twitterUrl: "",
    facebookUrl: "",
    isVerified: false,
    isActive: true
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Fetch countries
  const { data: countriesData, isLoading: countriesLoading, error: countriesError } = useQuery({
    queryKey: ['countries'],
    queryFn: () => locationService.getCountries(),
  });

  // Debug logging
  console.log('🌍 Countries data:', countriesData);
  console.log('🌍 Countries loading:', countriesLoading);
  console.log('🌍 Countries error:', countriesError);

  // Get selected country ID for states query
  const selectedCountry = countriesData?.data?.find((country: Country) => country.name === formData.country);
  const selectedCountryId = selectedCountry?.id;

  // Fetch states when country is selected
  const { data: statesData } = useQuery({
    queryKey: ['states', selectedCountryId],
    queryFn: () => locationService.getStatesByCountry(selectedCountryId!),
    enabled: !!selectedCountryId,
  });

  // Get selected state ID for cities query
  const selectedState = statesData?.data?.find((state: State) => state.name === formData.state);
  const selectedStateId = selectedState?.id;

  // Fetch cities when state is selected
  const { data: citiesData } = useQuery({
    queryKey: ['cities', selectedStateId],
    queryFn: () => locationService.getCitiesByState(selectedStateId!),
    enabled: !!selectedStateId,
  });

  // Reset dependent fields when parent selection changes
  useEffect(() => {
    if (formData.country) {
      setFormData(prev => ({ ...prev, state: "", city: "" }));
    }
  }, [formData.country]);

  useEffect(() => {
    if (formData.state) {
      setFormData(prev => ({ ...prev, city: "" }));
    }
  }, [formData.state]);

  // TanStack Query mutation for creating company
  const createCompanyMutation = useMutation({
    mutationFn: (companyData: CreateCompanyRequest) => companyService.createCompany(companyData),
    onSuccess: () => {
      toast.success("Company created successfully!");
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      navigate('/companies');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to create company";
      toast.error(errorMessage);
      console.error("Error creating company:", error);
    },
  });

  // Image upload mutation
  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      return await imageUploadService.uploadImage(file, 'company-logos');
    },
    onSuccess: (imageUrl) => {
      setFormData(prev => ({
        ...prev,
        logo: imageUrl
      }));
      toast.success("Logo uploaded successfully");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to upload logo";
      toast.error(errorMessage);
      console.error("Error uploading logo:", error);
      setSelectedFile(null);
      setImagePreview(null);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload image immediately
    setIsUploadingImage(true);
    uploadImageMutation.mutate(file, {
      onSettled: () => {
        setIsUploadingImage(false);
      }
    });
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setFormData(prev => ({
      ...prev,
      logo: ""
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim()) {
      toast.error("Company name is required");
      return;
    }
    
    if (!formData.slug.trim()) {
      toast.error("Company slug is required");
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error("Company description is required");
      return;
    }
    
    if (!formData.website.trim()) {
      toast.error("Company website is required");
      return;
    }
    
    if (!formData.industry) {
      toast.error("Please select an industry");
      return;
    }
    
    if (!formData.employeeCount) {
      toast.error("Please select employee count");
      return;
    }
    
    if (!formData.headquarters.trim()) {
      toast.error("Headquarters is required");
      return;
    }
    
    
    if (!formData.address.trim()) {
      toast.error("Address is required");
      return;
    }
    
    if (!formData.country) {
      toast.error("Please select a country");
      return;
    }
    
    const companyData: CreateCompanyRequest = {
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      description: formData.description.trim(),
      website: formData.website.trim(),
      logo: formData.logo || undefined,
      industry: formData.industry,
      foundedYear: formData.foundedYear,
      employeeCount: formData.employeeCount,
      headquarters: formData.headquarters.trim(),
      address: formData.address.trim(),
      country: formData.country || undefined,
      state: formData.state || undefined,
      city: formData.city || undefined,
      linkedinUrl: formData.linkedinUrl || undefined,
      twitterUrl: formData.twitterUrl || undefined,
      facebookUrl: formData.facebookUrl || undefined,
      isVerified: formData.isVerified,
      isActive: formData.isActive
    };

    console.log('📤 Submitting company data:', companyData);
    createCompanyMutation.mutate(companyData);
  };

  return (
    <>
      <PageMeta
        title="Add Company | spearwin-admin"
        description="Add new company"
      />
      
      {/* Title Bar */}
      <div className="px-4 sm:px-6 lg:px-30 ">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
          <PageBreadcrumb 
            items={[
              { label: "Dashboard", path: "/" },
              { label: "Companies", path: "/companies" },
              { label: "Add Company" }
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
                {/* Company Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter company name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Slug */}
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="company-slug"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter company description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Website */}
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                    Website <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://www.company.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Logo Upload */}
                <div>
                  <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Logo
                  </label>
                  <div className="space-y-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="logo"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={isUploadingImage}
                    />
                    <label
                      htmlFor="logo"
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 transition-colors ${
                        isUploadingImage ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      {isUploadingImage ? "Uploading..." : selectedFile ? "Change Logo" : "Upload Logo"}
                    </label>
                    {selectedFile && (
                      <p className="text-sm text-gray-600">{selectedFile.name}</p>
                    )}
                    {imagePreview && (
                      <div className="relative inline-block">
                        <img 
                          src={imagePreview} 
                          alt="Logo preview" 
                          className="w-32 h-32 object-contain rounded-md border border-gray-300 bg-white p-2"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          title="Remove logo"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                    {formData.logo && !imagePreview && (
                      <div className="relative inline-block">
                        <img 
                          src={formData.logo} 
                          alt="Current logo" 
                          className="w-32 h-32 object-contain rounded-md border border-gray-300 bg-white p-2"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          title="Remove logo"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Industry */}
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                    Industry <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                    required
                  >
                    <option value="">Select industry</option>
                    <option value="Technology">Technology</option>
                    <option value="Software">Software</option>
                    <option value="Research">Research</option>
                    <option value="Consulting">Consulting</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="Analytics">Analytics</option>
                    <option value="Cloud Services">Cloud Services</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Founded Year */}
                <div>
                  <label htmlFor="foundedYear" className="block text-sm font-medium text-gray-700 mb-2">
                    Founded Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="foundedYear"
                    name="foundedYear"
                    value={formData.foundedYear}
                    onChange={handleInputChange}
                    min="1800"
                    max={new Date().getFullYear()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Employee Count */}
                <div>
                  <label htmlFor="employeeCount" className="block text-sm font-medium text-gray-700 mb-2">
                    Employee Count <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="employeeCount"
                    name="employeeCount"
                    value={formData.employeeCount}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                    required
                  >
                    <option value="">Select employee count</option>
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-100">51-100</option>
                    <option value="101-500">101-500</option>
                    <option value="501-1000">501-1000</option>
                    <option value="1000+">1000+</option>
                  </select>
                </div>

                {/* Headquarters */}
                <div>
                  <label htmlFor="headquarters" className="block text-sm font-medium text-gray-700 mb-2">
                    Headquarters <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="headquarters"
                    name="headquarters"
                    value={formData.headquarters}
                    onChange={handleInputChange}
                    placeholder="San Francisco, CA"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Location Fields */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">Location</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Country */}
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        disabled={countriesLoading}
                      >
                        <option value="">
                          {countriesLoading ? "Loading countries..." : "Select Country"}
                        </option>
                        {countriesError ? (
                          <option value="" disabled>Error loading countries</option>
                        ) : (
                          countriesData?.data?.map((country: Country) => (
                            <option key={country.id} value={country.name}>
                              {country.name}
                            </option>
                          ))
                        )}
                      </select>
                    </div>

                    {/* State */}
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                        State/Province
                      </label>
                      <select
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        disabled={!formData.country}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="">Select State/Province</option>
                        {statesData?.data?.map((state: State) => (
                          <option key={state.id} value={state.name}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* City */}
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <select
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        disabled={!formData.state}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="">Select City</option>
                        {citiesData?.data?.map((city: City) => (
                          <option key={city.id} value={city.name}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Tech Street, Suite 100, San Francisco, CA 94105"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Social Media Links */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">Social Media Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* LinkedIn */}
                    <div>
                      <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700 mb-2">
                        LinkedIn URL
                      </label>
                      <input
                        type="url"
                        id="linkedinUrl"
                        name="linkedinUrl"
                        value={formData.linkedinUrl}
                        onChange={handleInputChange}
                        placeholder="https://linkedin.com/company/company"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Twitter */}
                    <div>
                      <label htmlFor="twitterUrl" className="block text-sm font-medium text-gray-700 mb-2">
                        Twitter URL
                      </label>
                      <input
                        type="url"
                        id="twitterUrl"
                        name="twitterUrl"
                        value={formData.twitterUrl}
                        onChange={handleInputChange}
                        placeholder="https://twitter.com/company"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Facebook */}
                    <div>
                      <label htmlFor="facebookUrl" className="block text-sm font-medium text-gray-700 mb-2">
                        Facebook URL
                      </label>
                      <input
                        type="url"
                        id="facebookUrl"
                        name="facebookUrl"
                        value={formData.facebookUrl}
                        onChange={handleInputChange}
                        placeholder="https://facebook.com/company"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Status Checkboxes */}
                <div className="md:col-span-2">
                  <div className="flex space-x-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isVerified"
                        checked={formData.isVerified}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Verified Company</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Active Company</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={createCompanyMutation.isPending}
                  className="bg-blue-900 hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {createCompanyMutation.isPending ? "Creating Company..." : "Create Company"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
