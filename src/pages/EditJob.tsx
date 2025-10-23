import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { jobService } from "../services";
import { UpdateJobRequest } from "../services/types";
import { useJobMutations } from "../hooks/useJobMutations";

export default function EditJob() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    title: "",
    companyId: "",
    description: "",
    jobType: "FULL_TIME",
    workMode: "REMOTE",
    experienceLevel: "MID_LEVEL",
    status: "DRAFT"
  });

  // Fetch job data by ID
  const { data: jobResponse, isLoading: jobLoading, error: jobError } = useQuery({
    queryKey: ['job', id],
    queryFn: async () => {
      if (!id) throw new Error('Job ID is required');
      const response = await jobService.getJobById(id);
      return response;
    },
    enabled: !!id,
  });

  // Extract job data from response
  let job = null;
  if (jobResponse && typeof jobResponse === 'object') {
    const responseObj = jobResponse as any;
    if (responseObj.job) {
      job = responseObj.job;
    } else if (responseObj.data) {
      job = responseObj.data;
    } else {
      job = responseObj;
    }
  }

  // Use the mutation from the hook
  const { updateJobMutation } = useJobMutations();

  // Update form data when job data is loaded
  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || "",
        companyId: job.companyId || "",
        description: job.description || "",
        jobType: job.jobType || "FULL_TIME",
        workMode: job.workMode || "REMOTE",
        experienceLevel: job.experienceLevel || "MID_LEVEL",
        status: job.status || "DRAFT"
      });
    }
  }, [job]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) {
      toast.error("Job ID is missing");
      return;
    }

    // Validate form data
    if (!formData.title || !formData.companyId || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Create update data object
    const updateData: UpdateJobRequest = {
      id,
      title: formData.title,
      companyId: formData.companyId,
      description: formData.description,
      jobType: formData.jobType as any,
      workMode: formData.workMode as any,
      experienceLevel: formData.experienceLevel as any,
      status: formData.status as any
    };

    // Submit the form
    updateJobMutation.mutate(updateData, {
      onSuccess: () => {
        navigate('/jobs');
      }
    });
  };

  // Loading state
  if (jobLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-gray-600">Loading job...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (jobError) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Failed to load job</h3>
          <p className="mt-1 text-sm text-gray-500">{(jobError as any).message || "An unknown error occurred."}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Edit Job | spearwin-admin"
        description="Edit Job"
      />
      
      {/* Title Bar */}
      <div className="px-4 sm:px-6 lg:px-30 ">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
          <PageBreadcrumb 
            items={[
              { label: "Dashboard", path: "/" },
              { label: "Jobs", path: "/jobs" },
              { label: "Edit Job" }
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
                {/* Job Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter job title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Company ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.companyId}
                    onChange={(e) => handleInputChange("companyId", e.target.value)}
                    placeholder="Enter company ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Job Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.jobType}
                    onChange={(e) => handleInputChange("jobType", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="INTERNSHIP">Internship</option>
                    <option value="FREELANCE">Freelance</option>
                  </select>
                </div>

                {/* Work Mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Mode <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.workMode}
                    onChange={(e) => handleInputChange("workMode", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="REMOTE">Remote</option>
                    <option value="ONSITE">Onsite</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={updateJobMutation.isPending}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      updateJobMutation.isPending
                        ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                        : 'bg-blue-900 hover:bg-blue-800 text-white'
                    }`}
                  >
                    {updateJobMutation.isPending ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating Job...
                      </div>
                    ) : (
                      'Update Job'
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Job Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Enter job description"
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Experience Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.experienceLevel}
                    onChange={(e) => handleInputChange("experienceLevel", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="ENTRY_LEVEL">Entry Level</option>
                    <option value="MID_LEVEL">Mid Level</option>
                    <option value="SENIOR_LEVEL">Senior Level</option>
                    <option value="EXECUTIVE">Executive</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange("status", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="CLOSED">Closed</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
