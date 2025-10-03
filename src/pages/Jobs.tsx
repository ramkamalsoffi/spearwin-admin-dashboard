import { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../components/common/PageMeta";

export default function Jobs() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterBy, setFilterBy] = useState("Date");
  const [orderType, setOrderType] = useState("Order Type");
  const [orderStatus, setOrderStatus] = useState("Order Status");

  // Sample data - you can replace this with real data
  const jobs = [
    {
      id: 1,
      jobTitle: "UI/UX Designer",
      companyName: "Spearwin Pvt. Ltd.",
      location: "Bangalore, IN",
      jobType: "Full - Time",
      jobDescription: "We are looking for a senior",
      status: "Active"
    },
    {
      id: 2,
      jobTitle: "UI/UX Designer",
      companyName: "Spearwin Pvt. Ltd.",
      location: "Bangalore, IN",
      jobType: "Full - Time",
      jobDescription: "We are looking for a senior",
      status: "Pending"
    },
    {
      id: 3,
      jobTitle: "UI/UX Designer",
      companyName: "Spearwin Pvt. Ltd.",
      location: "Bangalore, IN",
      jobType: "Full - Time",
      jobDescription: "We are looking for a senior",
      status: "Active"
    },
    {
      id: 4,
      jobTitle: "UI/UX Designer",
      companyName: "Spearwin Pvt. Ltd.",
      location: "Bangalore, IN",
      jobType: "Full - Time",
      jobDescription: "We are looking for a senior",
      status: "Active"
    },
    {
      id: 5,
      jobTitle: "UI/UX Designer",
      companyName: "Spearwin Pvt. Ltd.",
      location: "Bangalore, IN",
      jobType: "Full - Time",
      jobDescription: "We are looking for a senior",
      status: "Active"
    },
    {
      id: 6,
      jobTitle: "UI/UX Designer",
      companyName: "Spearwin Pvt. Ltd.",
      location: "Bangalore, IN",
      jobType: "Full - Time",
      jobDescription: "We are looking for a senior",
      status: "Active"
    },
    {
      id: 7,
      jobTitle: "UI/UX Designer",
      companyName: "Spearwin Pvt. Ltd.",
      location: "Bangalore, IN",
      jobType: "Full - Time",
      jobDescription: "We are looking for a senior",
      status: "Active"
    },
    {
      id: 8,
      jobTitle: "UI/UX Designer",
      companyName: "Spearwin Pvt. Ltd.",
      location: "Bangalore, IN",
      jobType: "Full - Time",
      jobDescription: "We are looking for a senior",
      status: "Active"
    },
    {
      id: 9,
      jobTitle: "UI/UX Designer",
      companyName: "Spearwin Pvt. Ltd.",
      location: "Bangalore, IN",
      jobType: "Full - Time",
      jobDescription: "We are looking for a senior",
      status: "Active"
    },
    {
      id: 10,
      jobTitle: "UI/UX Designer",
      companyName: "Spearwin Pvt. Ltd.",
      location: "Bangalore, IN",
      jobType: "Full - Time",
      jobDescription: "We are looking for a senior",
      status: "Active"
    }
  ];

  const totalJobs = 78;
  const jobsPerPage = 10;
  const totalPages = Math.ceil(totalJobs / jobsPerPage);

  return (
    <>
      <PageMeta
        title="Jobs | Spearwin Admin"
        description="Manage jobs"
      />
      
      {/* Title Bar */}
      <div className="px-30 py-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-900">Jobs</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-30 py-4">
        
        {/* Filters and Add Button */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Filter By</span>
                </div>
                
                <select 
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>Date</option>
                  <option>Job Title</option>
                  <option>Company</option>
                </select>
                
                <select 
                  value={orderType}
                  onChange={(e) => setOrderType(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>Order Type</option>
                  <option>Ascending</option>
                  <option>Descending</option>
                </select>
                
                <select 
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>Order Status</option>
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Inactive</option>
                </select>

                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
              
              <button 
                onClick={() => navigate("/add-job")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Add Job
              </button>
            </div>
          </div>
        </div>

        {/* Jobs Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{job.jobTitle}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.companyName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.jobType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.jobDescription}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        job.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <button className="p-1 text-blue-600 hover:text-blue-800">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button className="p-1 text-red-600 hover:text-red-800">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing 1-{jobsPerPage} of {totalJobs}
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
        </div>
      </div>
    </>
  );
}
