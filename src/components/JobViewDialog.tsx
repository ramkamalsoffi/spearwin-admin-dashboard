import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { jobService } from "../services";
import { Job } from "../services/types";

interface JobViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string | null;
}

export default function JobViewDialog({ isOpen, onClose, jobId }: JobViewDialogProps) {
  const [activeTab, setActiveTab] = useState<"details" | "applicants">("details");

  // Fetch job details
  const { data: jobResponse, isLoading: jobLoading } = useQuery({
    queryKey: ['job-details', jobId],
    queryFn: () => jobId ? jobService.getJobById(jobId) : Promise.resolve(null),
    enabled: !!jobId && isOpen,
  });

  // Fetch job applications
  const { data: applicationsResponse, isLoading: applicationsLoading } = useQuery({
    queryKey: ['job-applications', jobId],
    queryFn: () => jobId ? jobService.getJobApplications(jobId) : Promise.resolve(null),
    enabled: !!jobId && isOpen && activeTab === "applicants",
  });

  const job = jobResponse?.data as Job;
  const applications = applicationsResponse?.applications || [];

  if (!isOpen) return null;

  console.log('JobViewDialog - jobId:', jobId);
  console.log('JobViewDialog - jobResponse:', jobResponse);
  console.log('JobViewDialog - job:', job);
  console.log('JobViewDialog - jobLoading:', jobLoading);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Job Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("details")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "details"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Job Details
            </button>
            <button
              onClick={() => setActiveTab("applicants")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "applicants"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Applicants ({applicationsResponse?.total || 0})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {jobLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading job details...</span>
            </div>
          ) : activeTab === "details" ? (
            job ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Job Title</label>
                  <p className="mt-1 text-base text-gray-900">{job.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Company</label>
                  <p className="mt-1 text-base text-gray-900">{job.companyId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Work Mode</label>
                  <p className="mt-1 text-base text-gray-900">{job.workMode}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Job Type</label>
                  <p className="mt-1 text-base text-gray-900">{job.jobType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Experience Level</label>
                  <p className="mt-1 text-base text-gray-900">{job.experienceLevel || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <p className="mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      job.status === 'PUBLISHED' 
                        ? 'bg-green-100 text-green-800' 
                        : job.status === 'DRAFT'
                        ? 'bg-yellow-100 text-yellow-800'
                        : job.status === 'CLOSED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {job.status}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Created At</label>
                  <p className="mt-1 text-base text-gray-900">{formatDate(job.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Updated At</label>
                  <p className="mt-1 text-base text-gray-900">{formatDate(job.updatedAt)}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="mt-1 text-base text-gray-700 whitespace-pre-wrap">{job.description || 'No description provided'}</p>
              </div>
              {job.requirements && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Requirements</label>
                  <p className="mt-1 text-base text-gray-700 whitespace-pre-wrap">{job.requirements}</p>
                </div>
              )}
              {job.responsibilities && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Responsibilities</label>
                  <p className="mt-1 text-base text-gray-700 whitespace-pre-wrap">{job.responsibilities}</p>
                </div>
              )}
            </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No job data available</h3>
                <p className="mt-1 text-sm text-gray-500">Unable to load job details. Please try again.</p>
              </div>
            )
          ) : activeTab === "applicants" ? (
            <div>
              {applicationsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Loading applicants...</span>
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No applicants yet</h3>
                  <p className="mt-1 text-sm text-gray-500">No one has applied to this job yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((application: any) => (
                    <div key={application.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-base font-medium text-gray-900">
                            {application.fullName || `${application.candidate?.firstName || ''} ${application.candidate?.lastName || ''}`.trim() || 'Unknown'}
                          </h4>
                          <p className="text-sm text-gray-500">{application.email || application.candidate?.email || 'N/A'}</p>
                          <p className="text-sm text-gray-500">{application.phone || application.candidate?.user?.phone || 'N/A'}</p>
                          {application.experienceLevel && (
                            <p className="text-sm text-gray-600 mt-1">Experience: {application.experienceLevel}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            application.status === 'SHORTLISTED' 
                              ? 'bg-green-100 text-green-800' 
                              : application.status === 'REVIEWED'
                              ? 'bg-blue-100 text-blue-800'
                              : application.status === 'REJECTED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {application.status}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            Applied: {formatDate(application.appliedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

