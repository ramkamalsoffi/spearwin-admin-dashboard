import { useState } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { jobService, companyService } from "../services";
import { CreateJobRequest } from "../services/types";
import { useCreateJob } from "../hooks/useJobs";

export default function AddJob() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    title: "",
    companyId: "",
    description: "",
    jobType: "",
    workMode: "",
    experienceLevel: ""
  });

  // Fetch companies for dropdown
  const { data: companiesData } = useQuery({
    queryKey: ['companies'],
    queryFn: () => companyService.getCompanies(),
  });

  // Debug: Log companies data
  console.log('Companies Data:', companiesData);
  if (companiesData?.data && companiesData.data.length > 0) {
    console.log('First Company:', companiesData.data[0]);
    console.log('First Company ID:', companiesData.data[0].id);
    console.log('First Company Name:', companiesData.data[0].name);
  }

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
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
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

    // Create job data object with only required fields
    const jobData: CreateJobRequest = {
      title: formData.title,
      companyId: formData.companyId,
      description: formData.description,
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
                    Job Title *
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
                    Job Type *
                  </label>
                  <select
                    id="jobType"
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    Work Mode *
                  </label>
                  <select
                    id="workMode"
                    name="workMode"
                    value={formData.workMode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select work mode</option>
                    <option value="REMOTE">Remote</option>
                    <option value="ONSITE">Onsite</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </div>

                {/* Experience Level */}
                <div>
                  <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level *
                  </label>
                  <select
                    id="experienceLevel"
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select experience level</option>
                    <option value="ENTRY_LEVEL">Entry Level</option>
                    <option value="MID_LEVEL">Mid Level</option>
                    <option value="SENIOR_LEVEL">Senior Level</option>
                    <option value="EXECUTIVE">Executive</option>
                  </select>
                </div>

                {/* Job Description */}
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description *
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
    </>
  );
}
