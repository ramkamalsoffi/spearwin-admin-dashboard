import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { companyService } from "../services";
import { locationService, Country, State, City } from "../services/locationService";
import { UpdateCompanyRequest } from "../services/types";
import { imageUploadService } from "../services/imageUploadService";

export default function EditCompany() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
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

  // Fetch company data by ID
  const { data: companyResponse, isLoading: companyLoading, error: companyError } = useQuery({
    queryKey: ['company', id],
    queryFn: async () => {
      if (!id) throw new Error('Company ID is required');
      const response = await companyService.getCompanyById(id);
      return response;
    },
    enabled: !!id,
  });

  // Extract company data from response
  let company = null;
  if (companyResponse && typeof companyResponse === 'object') {
    const responseObj = companyResponse as any;
    if (responseObj.company) {
      company = responseObj.company;
    } else if (responseObj.data) {
      company = responseObj.data;
    } else {
      company = responseObj;
    }
  }

  // Fetch countries
  const { data: countriesData, isLoading: countriesLoading, error: countriesError } = useQuery({
    queryKey: ['countries'],
    queryFn: () => locationService.getCountries(),
  });

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

  // Update form data when company data is loaded
  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || "",
        description: company.description || "",
        website: company.website || "",
        logo: company.logo || "",
        industry: company.industry || "",
        foundedYear: company.foundedYear || new Date().getFullYear(),
        employeeCount: company.employeeCount || "",
        headquarters: company.headquarters || "",
        address: company.address || "",
        country: company.country || "",
        state: company.state || "",
        city: company.city || "",
        linkedinUrl: company.linkedinUrl || "",
        twitterUrl: company.twitterUrl || "",
        facebookUrl: company.facebookUrl || "",
        isVerified: company.isVerified || false,
        isActive: company.isActive || false
      });
      // Set image preview if logo exists
      if (company.logo) {
        setImagePreview(company.logo);
      }
    }
  }, [company]);

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

  // Reset dependent fields when parent selection changes
  useEffect(() => {
    if (formData.country && company && formData.country !== company.country) {
      setFormData(prev => ({ ...prev, state: "", city: "" }));
    }
  }, [formData.country, company]);

  useEffect(() => {
    if (formData.state && company && formData.state !== company.state) {
      setFormData(prev => ({ ...prev, city: "" }));
    }
  }, [formData.state, company]);

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
    
    if (!id) {
      toast.error("Company ID is missing");
      return;
    }

    // Validate required fields
    if (!formData.name.trim()) {
      toast.error("Company name is required");
      return;
    }

    if (!formData.industry.trim()) {
      toast.error("Industry is required");
      return;
    }

    const updateData: UpdateCompanyRequest = {
      id: id,
      name: formData.name.trim(),
      description: formData.description.trim(),
      website: formData.website.trim(),
      logo: formData.logo || undefined,
      industry: formData.industry.trim(),
      foundedYear: formData.foundedYear,
      employeeCount: formData.employeeCount.trim(),
      headquarters: formData.headquarters.trim(),
      address: formData.address.trim(),
      country: formData.country || undefined,
      state: formData.state || undefined,
      city: formData.city || undefined,
      linkedinUrl: formData.linkedinUrl.trim(),
      twitterUrl: formData.twitterUrl.trim(),
      facebookUrl: formData.facebookUrl.trim(),
      isVerified: formData.isVerified,
      isActive: formData.isActive
    };

    // Call the update API
    companyService.updateCompany(updateData)
      .then(() => {
        toast.success("Company updated successfully!");
        navigate('/companies');
      })
      .catch((error: any) => {
        const errorMessage = error.response?.data?.message || "Failed to update company";
        toast.error(errorMessage);
        console.error("Error updating company:", error);
      });
  };

  // Loading state
  if (companyLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-gray-600">Loading company...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (companyError) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Failed to load company</h3>
          <p className="mt-1 text-sm text-gray-500">{(companyError as any).message || "An unknown error occurred."}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Edit Company | Spearwin Admin Dashboard"
        description="Edit Company"
      />
      
      {/* Title Bar */}
      <div className="px-4 sm:px-6 lg:px-30 ">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
          <PageBreadcrumb 
            items={[
              { label: "Dashboard", path: "/" },
              { label: "Companies", path: "/companies" },
              { label: "Edit Company" }
            ]}
            showAdmin={true}
          />
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-30 py-4">
        <div className="bg-white rounded-[10px] shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              <h1 className="text-xl font-semibold text-gray-900 mb-6">Edit Company</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Name with Company ID */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter company name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  {/* Company ID - shown below company name */}
                  {company && company.companyId && (
                    <div className="mt-2">
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Company ID
                      </label>
                      <input
                        type="text"
                        value={company.companyId}
                        readOnly
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-blue-50 text-blue-700 font-mono text-sm cursor-not-allowed"
                        title="Company ID cannot be changed"
                      />
                    </div>
                  )}
                </div>

                {/* Industry */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

                {/* Website */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  </div>
                </div>

                {/* Founded Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Founded Year
                  </label>
                  <input
                    type="number"
                    name="foundedYear"
                    value={formData.foundedYear}
                    onChange={handleInputChange}
                    min="1800"
                    max={new Date().getFullYear()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Employee Count */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee Count
                  </label>
                  <select
                    name="employeeCount"
                    value={formData.employeeCount}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Headquarters
                  </label>
                  <input
                    type="text"
                    name="headquarters"
                    value={formData.headquarters}
                    onChange={handleInputChange}
                    placeholder="Enter headquarters location"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Location Fields */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">Location</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Country */}
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter company address"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Social Media Links */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">Social Media Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* LinkedIn URL */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        LinkedIn URL
                      </label>
                      <input
                        type="text"
                        name="linkedinUrl"
                        value={formData.linkedinUrl}
                        onChange={handleInputChange}
                        placeholder="https://linkedin.com/company/example"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Twitter URL */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Twitter URL
                      </label>
                      <input
                        type="text"
                        name="twitterUrl"
                        value={formData.twitterUrl}
                        onChange={handleInputChange}
                        placeholder="https://twitter.com/example"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Facebook URL */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Facebook URL
                      </label>
                      <input
                        type="text"
                        name="facebookUrl"
                        value={formData.facebookUrl}
                        onChange={handleInputChange}
                        placeholder="https://facebook.com/example"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Enter company description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Status Checkboxes */}
                <div className="md:col-span-2 flex gap-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isVerified"
                      checked={formData.isVerified}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">Verified Company</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">Active Company</label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate("/companies")}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Update Company
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
