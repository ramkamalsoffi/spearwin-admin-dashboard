import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { jobService } from "../services";
import { Job, PaginatedApiResponse } from "../services/types";
import { useJobMutations } from "../hooks/useJobMutations";

export default function Jobs() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterBy, setFilterBy] = useState("Date");
  const [orderType, setOrderType] = useState("Order Type");
  const [orderStatus, setOrderStatus] = useState("Order Status");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isJobLoading, setIsJobLoading] = useState(false);
  const [jobLoadError, setJobLoadError] = useState<string | null>(null);

  // Fetch jobs from API
  const { data: jobsResponse, isLoading, error, refetch } = useQuery<PaginatedApiResponse<Job[]>>({
    queryKey: ['jobs'],
    queryFn: () => jobService.getJobs(),
  });

  // Handle error with useEffect
  if (error) {
    const errorMessage = (error as any).response?.data?.message || "Failed to fetch jobs";
    toast.error(errorMessage);
    console.error("Error fetching jobs:", error);
  }

  const jobs = jobsResponse?.data || [];
  const totalJobs = jobsResponse?.total || jobs.length;
  const jobsPerPage = 10;
  const totalPages = Math.ceil(totalJobs / jobsPerPage);

  // Debug: Log jobs data
  console.log('Jobs Response:', jobsResponse);
  console.log('Jobs Array:', jobs);
  console.log('Total Jobs:', totalJobs);

  const handleEdit = (job: Job) => {
    navigate(`/edit-job/${job.id}`);
  };

  const { deleteJobMutation, updateJobStatusMutation } = useJobMutations();

  const handleDelete = (job: Job) => {
    if (window.confirm(`Are you sure you want to delete ${job.title}?`)) {
      deleteJobMutation.mutate(job.id);
    }
  };

  const handleRefresh = () => {
    console.log("Refresh Jobs data");
    refetch();
    toast.success("Jobs data refreshed!");
  };

  const handleView = async (job: Job) => {
    setIsViewModalOpen(true);
    setIsJobLoading(true);
    setJobLoadError(null);
    try {
      const response = await jobService.getJobById(String(job.id));
      const resp: any = response;
      const detailed: Job = resp?.data || resp?.job || resp;
      setSelectedJob(detailed || job);
    } catch (e: any) {
      console.error('Error loading job details:', e);
      setJobLoadError(e?.message || 'Failed to load job details');
      setSelectedJob(job);
    } finally {
      setIsJobLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setSelectedJob(null);
  };

  return (
    <>
      <PageMeta
        title="Jobs | spearwin-admin"
        description="Manage jobs"
      />
      
      {/* Title Bar */}
      <div className="px-4 sm:px-6 lg:px-30 ">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
          <PageBreadcrumb 
            items={[
              { label: "Dashboard", path: "/" },
              { label: "Jobs" }
            ]}
            showAdmin={true}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-30 py-4">
        
        {/* Jobs Table */}
        <div className="bg-white rounded-[10px] shadow-sm border border-gray-200">
          <div className="px-6 py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Filter By</span>
                </div>
                
                <div className="relative">
                  <select 
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className="appearance-none rounded-[20px] px-4 py-2 pr-8 text-sm bg-white/30 border border-white/40 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
                  >
                    <option>Date</option>
                    <option>Job Title</option>
                    <option>Company</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                <div className="relative">
                  <select 
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value)}
                    className="appearance-none rounded-[20px] px-4 py-2 pr-8 text-sm bg-white/30 border border-white/40 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
                  >
                    <option>Order Type</option>
                    <option>Ascending</option>
                    <option>Descending</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                <div className="relative">
                  <select 
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value)}
                    className="appearance-none rounded-[20px] px-4 py-2 pr-8 text-sm bg-white/30 border border-white/40 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
                  >
                    <option>Order Status</option>
                    <option>Active</option>
                    <option>Pending</option>
                    <option>Inactive</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <button 
                  className="p-2 text-gray-400 hover:text-gray-600" 
                  onClick={handleRefresh}
                  title="Refresh jobs data"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
              
              <button 
                onClick={() => navigate("/add-job")}
                className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Add Job
              </button>
            </div>
          </div>
        
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-gray-600">Loading jobs...</span>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Failed to load jobs</h3>
                  <p className="mt-1 text-sm text-gray-500">Please try refreshing the page</p>
                </div>
              </div>
            ) : jobs.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating a new job.</p>
                </div>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr className="mx-4">
                    <th className="rounded-l-[20px] pl-6 pr-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company ID</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Mode</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Type</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Description</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="rounded-r-[20px] pl-3 pr-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jobs.map((job: Job) => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="pl-6 pr-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{job.title}</td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">{job.companyId}</td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">{job.workMode}</td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">{job.jobType}</td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">{job.description?.substring(0, 50)}...</td>
                      <td className="px-3 py-3 whitespace-nowrap">
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
                      </td>
                      <td className="pl-3 pr-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <button 
                            className="p-1 text-green-600 hover:text-green-800" 
                            onClick={() => handleView(job)}
                            title="View job"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button 
                            className="p-1 text-blue-600 hover:text-blue-800" 
                            onClick={() => handleEdit(job)}
                            title="Edit job"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            className="p-1 text-red-600 hover:text-red-800" 
                            onClick={() => handleDelete(job)}
                            title="Delete job"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                          {/* Toggle Published/Draft after Delete */}
                          <label className="relative inline-flex items-center cursor-pointer ml-1" title="Toggle Published">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={job.status === 'PUBLISHED'}
                              onChange={() => updateJobStatusMutation.mutate({ id: String(job.id), status: job.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED' })}
                            />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
          {/* Pagination */}
          {!isLoading && !error && jobs.length > 0 && (
            <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {((currentPage - 1) * jobsPerPage) + 1}-{Math.min(currentPage * jobsPerPage, totalJobs)} of {totalJobs}
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
        </div>
              </div>
            </div>
          )}

      {/* View Job Modal */}
      {isViewModalOpen && selectedJob && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={handleCloseModal}
            ></div>
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Job Details</h3>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6 space-y-6">
                {isJobLoading && (
                  <div className="flex items-center justify-center py-10 text-gray-600">
                    <svg className="animate-spin h-5 w-5 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading job details...
                  </div>
                )}
                {jobLoadError && !isJobLoading && (
                  <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded">
                    {jobLoadError}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-900 leading-relaxed">{selectedJob?.title || '—'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company ID</label>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">{selectedJob?.companyId || '—'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                      selectedJob?.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                      selectedJob?.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                      selectedJob?.status === 'CLOSED' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedJob?.status || '—'}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">{selectedJob?.jobType || '—'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Work Mode</label>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">{selectedJob?.workMode || '—'}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">{selectedJob?.experienceLevel || '—'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Created</label>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">{selectedJob?.createdAt ? new Date(selectedJob.createdAt).toLocaleString() : '—'}</div>
                  </div>
                </div>
                {selectedJob.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">{selectedJob?.description}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
        </div>
      </div>
    </>
  );
}
