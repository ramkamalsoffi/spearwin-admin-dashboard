import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { jobService } from "../services";
import { Job } from "../services/types";

interface JobViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string | null;
}

interface Application {
  id: string;
  status: string;
  appliedAt: string;
  coverLetter?: string;
  resumeId?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  feedback?: string;
  candidate: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
}

export default function JobViewDialog({ isOpen, onClose, jobId }: JobViewDialogProps) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"details" | "applicants">("details");
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

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

  // Handle different response structures from the API
  // If response has a 'data' property, use it; otherwise use the response directly
  const job = (jobResponse?.data || jobResponse) as Job;
  const applications = (applicationsResponse?.applications || []) as Application[];

  if (!isOpen) return null;

  console.log('JobViewDialog - jobId:', jobId);
  console.log('JobViewDialog - jobResponse:', jobResponse);
  console.log('JobViewDialog - job extracted:', job);
  console.log('JobViewDialog - applicationsResponse:', applicationsResponse);
  console.log('JobViewDialog - applications:', applications);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
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
            (job && job.id) ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Job Title</label>
                  <p className="mt-1 text-base text-gray-900">{job.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Company</label>
                  <p className="mt-1 text-base text-gray-900">{job.company?.name || job.companyId}</p>
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
                  <label className="text-sm font-medium text-gray-500">Location</label>
                  <p className="mt-1 text-base text-gray-900">
                    {job.location?.city?.name 
                      ? `${job.location.city.name}, ${job.location.city.state?.name || ''}`
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Salary Range</label>
                  <p className="mt-1 text-base text-gray-900">
                    {job.minSalary && job.maxSalary 
                      ? `$${job.minSalary} - $${job.maxSalary}${job.salaryNegotiable ? ' (Negotiable)' : ''}`
                      : 'Not specified'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Applications</label>
                  <p className="mt-1 text-base text-gray-900">{job.applicationCount || 0}</p>
                </div>
              </div>
              
              {/* Skills Required */}
              {job.skillsRequired && job.skillsRequired.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Skills Required</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {job.skillsRequired.map((skill, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
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
              {job.benefits && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Benefits</label>
                  <p className="mt-1 text-base text-gray-700 whitespace-pre-wrap">{job.benefits}</p>
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
                <div className="space-y-3">
                  {applications.map((application) => (
                    <div key={application.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all bg-white">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                {`${application.candidate.firstName} ${application.candidate.lastName}`.trim() || 'Unknown Candidate'}
                                {application.resumeId && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                    Resume Attached
                                  </span>
                                )}
                              </h4>
                              <div className="mt-1 space-y-1">
                                <p className="text-sm text-gray-600 flex items-center gap-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                  </svg>
                                  {application.candidate.email}
                                </p>
                                {application.candidate.phone && (
                                  <p className="text-sm text-gray-600 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    {application.candidate.phone}
                                  </p>
                                )}
                              </div>
                              
                              {application.coverLetter && (
                                <div className="mt-3">
                                  <p className="text-xs font-medium text-gray-700 mb-1">Cover Letter:</p>
                                  <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded border border-gray-200 line-clamp-3">
                                    {application.coverLetter}
                                  </p>
                                </div>
                              )}
                              
                              {application.feedback && (
                                <div className="mt-3">
                                  <p className="text-xs font-medium text-gray-700 mb-1">Admin Feedback:</p>
                                  <p className="text-sm text-gray-600 bg-yellow-50 p-2 rounded border border-yellow-200">
                                    {application.feedback}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                            application.status === 'SHORTLISTED' || application.status === 'SELECTED'
                              ? 'bg-green-100 text-green-800' 
                              : application.status === 'UNDER_REVIEW' || application.status === 'REVIEWED'
                              ? 'bg-blue-100 text-blue-800'
                              : application.status === 'INTERVIEWED'
                              ? 'bg-purple-100 text-purple-800'
                              : application.status === 'REJECTED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {application.status.replace(/_/g, ' ')}
                          </span>
                          <div className="text-right text-xs text-gray-500 space-y-1">
                            <p className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Applied: {formatDate(application.appliedAt)}
                            </p>
                            {application.reviewedAt && (
                              <p className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Reviewed: {formatDate(application.reviewedAt)}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => setSelectedApplication(application)}
                            className="mt-1 px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded border border-blue-300 transition-colors"
                          >
                            View Details
                          </button>
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

      {/* Application Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Application Details</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {`${selectedApplication.candidate.firstName} ${selectedApplication.candidate.lastName}`}
                </p>
              </div>
              <button
                onClick={() => setSelectedApplication(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Status */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <div className="mt-1">
                    <span className={`inline-flex px-3 py-1.5 text-sm font-semibold rounded-full ${
                      selectedApplication.status === 'SHORTLISTED' || selectedApplication.status === 'SELECTED'
                        ? 'bg-green-100 text-green-800' 
                        : selectedApplication.status === 'UNDER_REVIEW' || selectedApplication.status === 'REVIEWED'
                        ? 'bg-blue-100 text-blue-800'
                        : selectedApplication.status === 'INTERVIEWED'
                        ? 'bg-purple-100 text-purple-800'
                        : selectedApplication.status === 'REJECTED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedApplication.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedApplication.candidate.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedApplication.candidate.phone || 'N/A'}</p>
                  </div>
                </div>

                {/* Application Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Applied Date</label>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(selectedApplication.appliedAt)}</p>
                  </div>
                  {selectedApplication.reviewedAt && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Reviewed Date</label>
                      <p className="mt-1 text-sm text-gray-900">{formatDate(selectedApplication.reviewedAt)}</p>
                    </div>
                  )}
                </div>

                {/* Resume */}
                {selectedApplication.resumeId && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Resume</label>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-sm text-blue-900 font-medium">Resume Attached</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cover Letter */}
                {selectedApplication.coverLetter && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Cover Letter</label>
                    <div className="mt-2 p-4 bg-gray-50 border border-gray-200 rounded-md">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedApplication.coverLetter}</p>
                    </div>
                  </div>
                )}

                {/* Feedback */}
                {selectedApplication.feedback && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Admin Feedback</label>
                    <div className="mt-2 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedApplication.feedback}</p>
                    </div>
                  </div>
                )}

                {/* Candidate ID (for reference) */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Candidate ID</label>
                  <p className="mt-1 text-sm text-gray-600 font-mono">{selectedApplication.candidate.id}</p>
                </div>

                {/* Application ID (for reference) */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Application ID</label>
                  <p className="mt-1 text-sm text-gray-600 font-mono">{selectedApplication.id}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
              <button
                onClick={() => setSelectedApplication(null)}
                className="px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-100 border border-gray-300 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // Copy candidate email to clipboard
                  navigator.clipboard.writeText(selectedApplication.candidate.email);
                  toast.success('Email copied to clipboard!');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Copy Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

