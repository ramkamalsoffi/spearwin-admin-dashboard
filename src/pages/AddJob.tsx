import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { jobService, companyService } from "../services";
import { CreateJobRequest } from "../services/types";
import { locationService, Country, State, City } from "../services/locationService";
import api from "../utils/axios";

// Types for job attributes
interface Attribute {
  id: string;
  name: string;
  categoryId: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  displayName: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  attributes: Attribute[];
  _count: {
    attributes: number;
  };
}

interface CategoriesResponse {
  success: boolean;
  message: string;
  data: Category[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function AddJob() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    title: "",
    companyId: "",
    description: "",
    requirements: "",
    responsibilities: "",
    benefits: "",
    minSalary: "",
    maxSalary: "",
    cityId: "",
    skillsRequired: "",
    jobType: "",
    workMode: "",
    experienceLevel: "",
    status: ""
  });

  // Job attributes state
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<{[categoryId: string]: string[]}>({});
  const [showAttributeModal, setShowAttributeModal] = useState(false);
  const [loadingAttributes, setLoadingAttributes] = useState(false);

  // Location state
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null);
  const [selectedStateId, setSelectedStateId] = useState<number | null>(null);

  // Fetch countries for location
  const { data: countriesData } = useQuery({
    queryKey: ['countries'],
    queryFn: () => locationService.getCountries(),
  });

  // Fetch states when country is selected
  const { data: statesData } = useQuery({
    queryKey: ['states', selectedCountryId],
    queryFn: () => locationService.getStatesByCountry(selectedCountryId!),
    enabled: !!selectedCountryId,
  });

  // Fetch cities when state is selected
  const { data: citiesData } = useQuery({
    queryKey: ['cities', selectedStateId],
    queryFn: () => locationService.getCitiesByState(selectedStateId!),
    enabled: !!selectedStateId,
  });

  // Fetch companies for dropdown
  const { data: companiesData } = useQuery({
    queryKey: ['companies', 'active'],
    queryFn: async () => {
      const response = await companyService.getActiveCompanies();
      return response;
    },
  });

  // Debug: Log companies data
  console.log('Companies Data:', companiesData);
  if (companiesData?.data && companiesData.data.length > 0) {
    console.log('First Company:', companiesData.data[0]);
    console.log('First Company ID:', companiesData.data[0].id);
    console.log('First Company Name:', companiesData.data[0].name);
  }

  // Fetch job attributes categories
  const fetchJobAttributes = async () => {
    try {
      setLoadingAttributes(true);
      const response = await api.get<CategoriesResponse>('/job-attributes/categories');
      setCategories(response.data.data);
    } catch (error: any) {
      console.error('Error fetching job attributes:', error);
      toast.error('Failed to load job attributes');
    } finally {
      setLoadingAttributes(false);
    }
  };

  // Load job attributes on component mount
  useEffect(() => {
    fetchJobAttributes();
  }, []);

  // TanStack Query mutation for creating job
  const createJobMutation = useMutation({
    mutationFn: (jobData: CreateJobRequest) => jobService.createJob(jobData),
    onSuccess: () => {
      toast.success("Job created successfully!");
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      navigate('/jobs');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to create job";
      toast.error(errorMessage);
      console.error("Error creating job:", error);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle location changes
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryId = e.target.value ? parseInt(e.target.value) : null;
    setSelectedCountryId(countryId);
    setSelectedStateId(null);
    setFormData(prev => ({ ...prev, cityId: "" }));
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateId = e.target.value ? parseInt(e.target.value) : null;
    setSelectedStateId(stateId);
    setFormData(prev => ({ ...prev, cityId: "" }));
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityId = e.target.value ? parseInt(e.target.value) : null;
    setFormData(prev => ({
      ...prev,
      cityId: cityId ? cityId.toString() : ""
    }));
  };

  // Handle category selection
  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        // Remove category and its selected attributes
        const newSelected = prev.filter(id => id !== categoryId);
        setSelectedAttributes(prevAttrs => {
          const newAttrs = { ...prevAttrs };
          delete newAttrs[categoryId];
          return newAttrs;
        });
        return newSelected;
      } else {
        // Add category
        return [...prev, categoryId];
      }
    });
  };

  // Handle attribute selection (multi-select with checkboxes)
  const handleAttributeToggle = (categoryId: string, attributeId: string) => {
    setSelectedAttributes(prev => {
      const currentAttributes = prev[categoryId] || [];
      if (currentAttributes.includes(attributeId)) {
        // Remove attribute
        return {
          ...prev,
          [categoryId]: currentAttributes.filter(id => id !== attributeId)
        };
      } else {
        // Add attribute
        return {
          ...prev,
          [categoryId]: [...currentAttributes, attributeId]
        };
      }
    });
  };

  // Check if an attribute is selected
  const isAttributeSelected = (categoryId: string, attributeId: string): boolean => {
    return (selectedAttributes[categoryId] || []).includes(attributeId);
  };

  // Handle select all / deselect all for a category
  const handleSelectAllAttributes = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return;

    const currentSelected = selectedAttributes[categoryId] || [];
    const allAttributeIds = category.attributes.map(attr => attr.id);
    const allSelected = allAttributeIds.every(id => currentSelected.includes(id));

    if (allSelected) {
      // Deselect all
      setSelectedAttributes(prev => ({
        ...prev,
        [categoryId]: []
      }));
    } else {
      // Select all
      setSelectedAttributes(prev => ({
        ...prev,
        [categoryId]: allAttributeIds
      }));
    }
  };

  // Get selected category details
  const getSelectedCategoryDetails = () => {
    return selectedCategories.map(categoryId => {
      const category = categories.find(cat => cat.id === categoryId);
      return category;
    }).filter(Boolean) as Category[];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.title || !formData.companyId || !formData.description || 
        !formData.jobType || !formData.workMode || !formData.experienceLevel || !formData.status) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate description length
    if (formData.description.length < 10) {
      toast.error("Description must be at least 10 characters long");
      return;
    }

    if (formData.description.length > 5000) {
      toast.error("Description must be less than 5000 characters");
      return;
    }

    // Validate title length
    if (formData.title.length > 200) {
      toast.error("Title must be less than 200 characters");
      return;
    }

    // Parse skillsRequired from comma-separated string to array
    const skillsArray = formData.skillsRequired
      ? formData.skillsRequired.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0)
      : [];

    // Create job data object
    const jobData: CreateJobRequest = {
      title: formData.title,
      companyId: formData.companyId,
      description: formData.description,
      requirements: formData.requirements || null,
      responsibilities: formData.responsibilities || null,
      benefits: formData.benefits || null,
      minSalary: formData.minSalary ? parseFloat(formData.minSalary) : null,
      maxSalary: formData.maxSalary ? parseFloat(formData.maxSalary) : null,
      cityId: formData.cityId ? parseInt(formData.cityId) : null,
      skillsRequired: skillsArray.length > 0 ? skillsArray : [],
      jobType: formData.jobType as CreateJobRequest['jobType'],
      workMode: formData.workMode as CreateJobRequest['workMode'],
      experienceLevel: formData.experienceLevel as CreateJobRequest['experienceLevel'],
      status: formData.status as CreateJobRequest['status'],
    };

    // Debug: Log the data being sent
    console.log('Form Data:', formData);
    console.log('Job Data being sent:', jobData);
    console.log('Company ID:', formData.companyId);
    console.log('Company ID type:', typeof formData.companyId);
    console.log('Company ID length:', formData.companyId.length);
    
    // Check if we're sending a company name instead of ID
    if (formData.companyId && formData.companyId.length < 10) {
      console.error('❌ ERROR: Sending company name instead of ID:', formData.companyId);
      console.error('This will cause a 400 error. Expected UUID format like: cmh4e5w3m0004wi93vxxa9pah');
    } else if (formData.companyId && formData.companyId.length > 10) {
      console.log('✅ GOOD: Sending proper company ID:', formData.companyId);
    }

    // Submit the form
    createJobMutation.mutate(jobData);
  };

  return (
    <>
      <PageMeta
        title="Add Job | spearwin-admin"
        description="Add new job"
      />
      
      {/* Title Bar */}
      <div className="px-4 sm:px-6 lg:px-30 ">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
          <PageBreadcrumb 
            items={[
              { label: "Dashboard", path: "/" },
              { label: "Jobs", path: "/jobs" },
              { label: "Add Job" }
            ]}
            showAdmin={true}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-30 py-4">
        {/* Form Card */}
        <div className="bg-white rounded-[10px] shadow-sm border border-gray-200">
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Job Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter job title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Company */}
                <div>
                  <label htmlFor="companyId" className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <select
                    id="companyId"
                    name="companyId"
                    value={formData.companyId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select a company</option>
                    {companiesData?.data?.map((company) => {
                      console.log(`Company: ${company.name}, ID: ${company.id}, Using as value: ${company.id}`);
                      return (
                        <option key={company.id} value={company.id}>
                          {company.name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Job Type */}
                <div>
                  <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type
                  </label>
                  <select
                    id="jobType"
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                    required
                  >
                    <option value="">Select job type</option>
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="FREELANCE">Freelance</option>
                    <option value="INTERNSHIP">Internship</option>
                  </select>
                </div>

                {/* Work Mode */}
                <div>
                  <label htmlFor="workMode" className="block text-sm font-medium text-gray-700 mb-2">
                    Work Mode
                  </label>
                  <select
                    id="workMode"
                    name="workMode"
                    value={formData.workMode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                    required
                  >
                    <option value="">Select work mode</option>
                    <option value="REMOTE">Remote</option>
                    <option value="ONSITE">Onsite</option>
                    <option value="HYBRID">Hybrid</option>
                    <option value="HYBRID">Work From Office</option>
                  </select>
                </div>

                {/* Experience Level */}
                <div>
                  <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select
                    id="experienceLevel"
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                    required
                  >
                    <option value="">Select experience level</option>
                    <option value="ENTRY_LEVEL">Entry Level</option>
                    <option value="MID_LEVEL">Mid Level</option>
                    <option value="SENIOR_LEVEL">Senior Level</option>
                    <option value="EXECUTIVE">Executive</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                  >
                    <option value="">Select status</option>
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="CLOSED">Closed</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>

                {/* Add Job Attributes Button */}
                <div className="md:col-span-2">
                  <button
                    type="button"
                    onClick={() => setShowAttributeModal(true)}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Job Attribute
                  </button>
                </div>

                {/* Job Description */}
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter job description (minimum 10 characters)"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Requirements */}
                <div className="md:col-span-2">
                  <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
                    Requirements
                  </label>
                  <textarea
                    id="requirements"
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    placeholder="Enter job requirements"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Responsibilities */}
                <div className="md:col-span-2">
                  <label htmlFor="responsibilities" className="block text-sm font-medium text-gray-700 mb-2">
                    Responsibilities
                  </label>
                  <textarea
                    id="responsibilities"
                    name="responsibilities"
                    value={formData.responsibilities}
                    onChange={handleInputChange}
                    placeholder="Enter job responsibilities"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Benefits */}
                <div className="md:col-span-2">
                  <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 mb-2">
                    Benefits
                  </label>
                  <textarea
                    id="benefits"
                    name="benefits"
                    value={formData.benefits}
                    onChange={handleInputChange}
                    placeholder="Enter job benefits"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Salary Range */}
                <div>
                  <label htmlFor="minSalary" className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Salary (₹)
                  </label>
                  <input
                    type="number"
                    id="minSalary"
                    name="minSalary"
                    value={formData.minSalary}
                    onChange={handleInputChange}
                    placeholder="e.g., 50000"
                    min="0"
                    step="1000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="maxSalary" className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Salary (₹)
                  </label>
                  <input
                    type="number"
                    id="maxSalary"
                    name="maxSalary"
                    value={formData.maxSalary}
                    onChange={handleInputChange}
                    placeholder="e.g., 100000"
                    min="0"
                    step="1000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Location - Country */}
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <select
                    id="country"
                    value={selectedCountryId || ""}
                    onChange={handleCountryChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a country</option>
                    {countriesData?.data?.map((country: Country) => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location - State */}
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <select
                    id="state"
                    value={selectedStateId || ""}
                    onChange={handleStateChange}
                    disabled={!selectedCountryId}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">{selectedCountryId ? "Select a state" : "Select country first"}</option>
                    {statesData?.data?.map((state: State) => (
                      <option key={state.id} value={state.id}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location - City */}
                <div className="md:col-span-2">
                  <label htmlFor="cityId" className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <select
                    id="cityId"
                    name="cityId"
                    value={formData.cityId}
                    onChange={handleCityChange}
                    disabled={!selectedStateId}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">{selectedStateId ? "Select a city" : "Select state first"}</option>
                    {citiesData?.data?.map((city: City) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Skills Required */}
                <div className="md:col-span-2">
                  <label htmlFor="skillsRequired" className="block text-sm font-medium text-gray-700 mb-2">
                    Skills Required (comma-separated)
                  </label>
                  <input
                    type="text"
                    id="skillsRequired"
                    name="skillsRequired"
                    value={formData.skillsRequired}
                    onChange={handleInputChange}
                    placeholder="e.g., JavaScript, React, Node.js, TypeScript"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">Enter skills separated by commas</p>
                </div>

                {/* Selected Job Attributes - Multi-select with checkboxes */}
                {getSelectedCategoryDetails().map((category) => {
                  const selectedCount = (selectedAttributes[category.id] || []).length;
                  const totalCount = category.attributes.length;
                  const allSelected = totalCount > 0 && selectedCount === totalCount;
                  
                  return (
                    <div key={category.id} className="md:col-span-2">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          {category.displayName}
                          {selectedCount > 0 && (
                            <span className="ml-2 text-xs text-gray-500">
                              ({selectedCount} selected)
                            </span>
                          )}
                        </label>
                        {totalCount > 0 && (
                          <button
                            type="button"
                            onClick={() => handleSelectAllAttributes(category.id)}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {allSelected ? 'Deselect All' : 'Select All'}
                          </button>
                        )}
                      </div>
                      <div className="border border-gray-300 rounded-md shadow-sm p-3 max-h-48 overflow-y-auto bg-white">
                        {category.attributes.length === 0 ? (
                          <p className="text-sm text-gray-500">No attributes available for this category</p>
                        ) : (
                          <div className="space-y-2">
                            {category.attributes.map((attribute) => (
                              <label
                                key={attribute.id}
                                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                              >
                                <input
                                  type="checkbox"
                                  checked={isAttributeSelected(category.id, attribute.id)}
                                  onChange={() => handleAttributeToggle(category.id, attribute.id)}
                                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                />
                                <span className="text-sm text-gray-700">{attribute.name}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={createJobMutation.isPending}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    createJobMutation.isPending
                      ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                      : 'bg-blue-900 hover:bg-blue-800 text-white'
                  }`}
                >
                  {createJobMutation.isPending ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Job...
                    </div>
                  ) : (
                    'Submit'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Job Attributes Modal */}
      {showAttributeModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Select Job Attribute Categories
                </h3>
                <button
                  onClick={() => setShowAttributeModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {loadingAttributes ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
                  <span className="ml-2 text-gray-600">Loading categories...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedCategories.includes(category.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleCategoryToggle(category.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{category.displayName}</h4>
                          <p className="text-sm text-gray-500">
                            {category._count.attributes} attributes available
                            {selectedCategories.includes(category.id) && selectedAttributes[category.id] && selectedAttributes[category.id].length > 0 && (
                              <span className="ml-2 text-blue-600 font-medium">
                                • {selectedAttributes[category.id].length} selected
                              </span>
                            )}
                          </p>
                        </div>
                        <button
                          type="button"
                          className={`p-2 rounded-full transition-colors ${
                            selectedCategories.includes(category.id)
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAttributeModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setShowAttributeModal(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-900 border border-transparent rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
