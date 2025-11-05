import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../components/ui/table";
import StatusBadge from "../components/ui/status-badge/StatusBadge";
import SearchableDropdown from "../components/ui/SearchableDropdown";
import { candidateService, CVSearchQueryParams } from "../services/candidateService";
import { companyService } from "../services/companyService";
import { skillsService } from "../services/skillsService";
import { adminService, AdminApplication } from "../services/adminService";

export default function CVSearch() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchData, setSearchData] = useState({
    company: "",
    jobCode: "",
    candidateName: "",
    email: "",
    selectSkill: "",
    candidateCV: "",
    experience: "",
    salary: "",
    currentCompany: "",
    currentLocation: "",
    noticePeriod: "",
    profileType: ""
  });

  const [searchTriggered, setSearchTriggered] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search terms for dropdowns
  const [companySearch, setCompanySearch] = useState("");
  const [candidateSearch, setCandidateSearch] = useState("");
  const [emailSearch, setEmailSearch] = useState("");
  const [skillSearch, setSkillSearch] = useState("");

  // Debounce search term for candidate name
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchData.candidateName);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchData.candidateName]);

  // Fetch companies for dropdown
  const { data: companiesData, isLoading: companiesLoading } = useQuery({
    queryKey: ['companies-dropdown', companySearch],
    queryFn: () => companyService.getCompanies({
      search: companySearch || undefined,
      limit: 100,
      sortBy: 'name',
      sortOrder: 'asc',
    }),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch candidates for dropdown
  const { data: candidatesDropdown, isLoading: candidatesDropdownLoading } = useQuery({
    queryKey: ['candidates-dropdown', candidateSearch],
    queryFn: () => candidateService.getCandidatesForDropdown(candidateSearch || undefined),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch emails for dropdown
  const { data: emailsDropdown, isLoading: emailsDropdownLoading } = useQuery({
    queryKey: ['emails-dropdown', emailSearch],
    queryFn: () => candidateService.getCandidateEmails(emailSearch || undefined),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch skills for dropdown
  const { data: skillsDropdown, isLoading: skillsLoading } = useQuery({
    queryKey: ['skills-dropdown', skillSearch],
    queryFn: () => skillsService.getSkills(skillSearch || undefined),
    staleTime: 5 * 60 * 1000,
  });

  // Transform companies data
  const companiesOptions = (companiesData?.data || []).map((company: any) => ({
    value: company.name || company.id,
    label: company.name || 'Unknown Company',
  }));

  // Transform candidates data
  const candidatesOptions = candidatesDropdown || [];
  console.log('Candidates dropdown options:', candidatesOptions);
  console.log('Candidates dropdown loading:', candidatesDropdownLoading);

  // Transform emails data
  const emailsOptions = emailsDropdown || [];
  console.log('Emails dropdown options:', emailsOptions);

  // Transform skills data
  const skillsOptions = skillsDropdown || [];

  const handleInputChange = (field: string, value: string) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Build search query parameters
  const buildSearchParams = (): CVSearchQueryParams => {
    // Extract name from candidate selection (format: "Name (email)" or just email)
    let candidateNameSearch = searchData.candidateName;
    if (candidateNameSearch && candidateNameSearch.includes('(')) {
      // Extract name from "Name (email)" format
      candidateNameSearch = candidateNameSearch.split('(')[0].trim();
    }
    
    return {
      search: debouncedSearch || candidateNameSearch || undefined,
      email: searchData.email || undefined,
      currentCompany: searchData.company || searchData.currentCompany || undefined,
      currentLocation: searchData.currentLocation || undefined,
      // profileType removed - status is now handled by application status filter
      skills: searchData.selectSkill || undefined,
      page: currentPage,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    };
  };

  // Fetch candidates using TanStack Query
  const { 
    data: candidatesResponse, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['cv-search', buildSearchParams()],
    queryFn: async () => {
      try {
        const result = await candidateService.searchCandidates(buildSearchParams());
        console.log('CV Search result:', result);
        console.log('Candidates count:', result?.candidates?.length);
        return result;
      } catch (error) {
        console.error('Error in CV search:', error);
        throw error;
      }
    },
    enabled: searchTriggered,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleSearch = () => {
    setSearchTriggered(true);
    setCurrentPage(1);
    refetch();
  };

  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success('Search results refreshed successfully');
    } catch (error) {
      console.error('Error refreshing results:', error);
      toast.error('Failed to refresh search results');
    }
  };

  // Handle error - moved to useEffect to avoid rendering issues
  useEffect(() => {
  if (error) {
    const errorMessage = (error as any).response?.data?.message || "Failed to search candidates";
    toast.error(errorMessage);
    console.error("Error searching candidates:", error);
  }
  }, [error]);

  const searchResults = candidatesResponse?.candidates || [];
  const totalResults = candidatesResponse?.total || 0;
  const totalPages = candidatesResponse?.totalPages || 1;
  
  console.log('Search Results:', searchResults);
  console.log('Total Results:', totalResults);
  console.log('Is Loading:', isLoading);
  console.log('Search Triggered:', searchTriggered);

  // Trigger search when page changes
  useEffect(() => {
    if (searchTriggered && currentPage > 1) {
      refetch();
    }
  }, [currentPage]);

  return (
    <>
      <PageMeta
        title="CV Search | spearwin-admin"
        description="Search and manage CVs"
      />
      
      {/* Title Bar */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
          <PageBreadcrumb 
            items={[
              { label: "Dashboard", path: "/" },
              { label: "CV Search" }
            ]}
            showAdmin={true}
          />
        </div>
      </div>

      {/* Search Form Section - Commented Out */}
      {/* <div className="px-4 sm:px-6 lg:px-8 py-4">
        {/* Search Form Container */}
        {/* <div className="bg-white rounded-[10px] shadow-sm border border-gray-200">
          <div className="p-6">
            {/* Search Form Grid */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Row 1 */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <SearchableDropdown
                  placeholder="Select Company"
                  value={searchData.company}
                  onChange={(value) => handleInputChange("company", value)}
                  options={companiesOptions}
                  isLoading={companiesLoading}
                  onSearch={setCompanySearch}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Code
                </label>
                <input
                  type="text"
                  value={searchData.jobCode}
                  onChange={(e) => handleInputChange("jobCode", e.target.value)}
                  placeholder="Job Code"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Candidate Name
                </label>
                <SearchableDropdown
                  placeholder="Select Candidate"
                  value={searchData.candidateName}
                  onChange={(value) => handleInputChange("candidateName", value)}
                  options={candidatesOptions}
                  isLoading={candidatesDropdownLoading}
                  onSearch={setCandidateSearch}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <SearchableDropdown
                  placeholder="Select Email"
                  value={searchData.email}
                  onChange={(value) => handleInputChange("email", value)}
                  options={emailsOptions}
                  isLoading={emailsDropdownLoading}
                  onSearch={setEmailSearch}
                />
              </div>

              {/* Row 2 */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Skill
                </label>
                <SearchableDropdown
                  placeholder="Select Skill"
                  value={searchData.selectSkill}
                  onChange={(value) => handleInputChange("selectSkill", value)}
                  options={skillsOptions}
                  isLoading={skillsLoading}
                  onSearch={setSkillSearch}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Candidate CV
                </label>
                <input
                  type="text"
                  value={searchData.candidateCV}
                  onChange={(e) => handleInputChange("candidateCV", e.target.value)}
                  placeholder="Candidate CV"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience
                </label>
                <input
                  type="text"
                  value={searchData.experience}
                  onChange={(e) => handleInputChange("experience", e.target.value)}
                  placeholder="Experience (e.g., 5 years)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary
                </label>
                <input
                  type="text"
                  value={searchData.salary}
                  onChange={(e) => handleInputChange("salary", e.target.value)}
                  placeholder="Salary (e.g., 50000)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Row 3 */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Company
                </label>
                <SearchableDropdown
                  placeholder="Select Current Company"
                  value={searchData.currentCompany}
                  onChange={(value) => handleInputChange("currentCompany", value)}
                  options={companiesOptions}
                  isLoading={companiesLoading}
                  onSearch={setCompanySearch}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Location
                </label>
                <input
                  type="text"
                  value={searchData.currentLocation}
                  onChange={(e) => handleInputChange("currentLocation", e.target.value)}
                  placeholder="Current Location"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notice Period
                </label>
                <input
                  type="text"
                  value={searchData.noticePeriod}
                  onChange={(e) => handleInputChange("noticePeriod", e.target.value)}
                  placeholder="Notice Period (e.g., 2 weeks)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {/* Profile Type dropdown removed - using application status instead */}
            {/* </div>

            {/* Search Button */}
            {/* <div className="flex justify-center gap-3 mb-6">
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="bg-blue-900 hover:bg-blue-800 disabled:bg-blue-400 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search
                  </>
                )}
              </button>
              {searchTriggered && (
                <button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              )}
            </div>

            {/* Search Results Area */}
            {/* <div className="border-t border-gray-200 pt-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
                  <span className="ml-2 text-gray-600">Searching candidates...</span>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-600 mb-2">Error searching candidates</p>
                  <p className="text-sm text-gray-500 mb-4">
                    {(error as any)?.response?.data?.message || 
                     (error as any)?.message || 
                     'Please check your connection and try again'}
                  </p>
                  <button
                    onClick={() => refetch()}
                    className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800"
                  >
                    Retry
                  </button>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Search Results ({totalResults} found)
                  </h3>
                    <div className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </div>
                  </div>
                  {searchResults.map((result) => {
                    const fullName = `${result.firstName || ''} ${result.lastName || ''}`.trim() || 'N/A';
                    const skills = result.skills?.map((s: any) => s.skill).join(', ') || 'N/A';
                    const location = result.city?.name || result.currentLocation || 'N/A';
                    
                    return (
                      <div key={result.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <span className="text-sm font-medium text-gray-500">Name:</span>
                            <p className="text-sm text-gray-900 font-medium">{fullName}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Email:</span>
                            <p className="text-sm text-gray-900">{result.email || 'N/A'}</p>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-500">Current Company:</span>
                            <p className="text-sm text-gray-900">{result.currentCompany || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Experience:</span>
                            <p className="text-sm text-gray-900">{result.experienceYears ? `${result.experienceYears} years` : 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Location:</span>
                            <p className="text-sm text-gray-900">{location}</p>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-500">Expected Salary:</span>
                            <p className="text-sm text-gray-900">
                              {result.expectedSalary ? `₹${result.expectedSalary.toLocaleString()}` : 'N/A'}
                            </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Notice Period:</span>
                            <p className="text-sm text-gray-900">{result.noticePeriod || 'N/A'}</p>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-500">Status:</span>
                            <StatusBadge status={result.status?.toLowerCase() as "active" | "inactive"} />
                          </div>
                          <div className="md:col-span-2 lg:col-span-4">
                          <span className="text-sm font-medium text-gray-500">Skills:</span>
                            <p className="text-sm text-gray-900 line-clamp-2">{skills}</p>
                          </div>
                          <div className="md:col-span-2 lg:col-span-4 flex gap-2">
                            <button 
                              onClick={() => navigate(`/candidate/${result.id}`)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              View Profile →
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Pagination */}
                  {/* <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <div className="text-sm text-gray-700">
                      Showing {((currentPage - 1) * 10) + 1}-{Math.min(currentPage * 10, totalResults)} of {totalResults}
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1 || isLoading}
                        className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <span className="text-sm text-gray-500">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button 
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages || isLoading}
                        className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ) : searchTriggered ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No candidates found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your search criteria.
                  </p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Start Your Search</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Enter search criteria and click "Search" to find candidates.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div> */}

      {/* CV Status Maintenance Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <CVStatusMaintenanceInline />
      </div>
    </>
  );
}

// Applications List Section - Shows candidates who applied for jobs
function CVStatusMaintenanceInline() {
  const navigate = useNavigate();
  const [applicationsPage, setApplicationsPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [jobTitleFilter, setJobTitleFilter] = useState<string>("");
  const [companyNameFilter, setCompanyNameFilter] = useState<string>("");
  const [candidateNameFilter, setCandidateNameFilter] = useState<string>("");

  // Map application status to StatusBadge type and get display label
  const getApplicationStatusDisplay = (status: string): { 
    badgeType: "active" | "inactive" | "pending" | "completed" | "cancelled";
    label: string;
  } => {
    const normalizedStatus = status?.toUpperCase() || 'UNDER_REVIEW';
    
    const statusMap: Record<string, { badgeType: "active" | "inactive" | "pending" | "completed" | "cancelled"; label: string }> = {
      'APPLIED': { badgeType: 'pending', label: 'Applied' },
      'UNDER_REVIEW': { badgeType: 'pending', label: 'Under Review' },
      'SHORTLISTED': { badgeType: 'active', label: 'Shortlisted' },
      'INTERVIEWED': { badgeType: 'active', label: 'Interviewed' },
      'SELECTED': { badgeType: 'completed', label: 'Selected' },
      'REJECTED': { badgeType: 'cancelled', label: 'Rejected' },
      'WITHDRAWN': { badgeType: 'cancelled', label: 'Withdrawn' },
    };
    
    return statusMap[normalizedStatus] || { badgeType: 'pending', label: normalizedStatus.replace(/_/g, ' ') };
  };

  // Fetch applications with candidate details
  const { 
    data: applicationsData, 
    isLoading: applicationsLoading, 
    error: applicationsError,
    refetch: refetchApplications 
  } = useQuery({
    queryKey: ['admin-applications', applicationsPage, statusFilter, jobTitleFilter, companyNameFilter, candidateNameFilter],
    queryFn: async () => {
      try {
        const result = await adminService.getAllApplications({
          page: applicationsPage.toString(),
          limit: '10',
          status: statusFilter || undefined,
          jobTitle: jobTitleFilter || undefined,
          companyName: companyNameFilter || undefined,
          candidateName: candidateNameFilter || undefined,
        });
        console.log('Applications data:', result);
        return result;
      } catch (error) {
        console.error('Error fetching applications:', error);
        toast.error('Failed to load applications');
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
    enabled: true, // Always enable the query
  });

  // Handle response data - ensure we extract it correctly
  const applications = applicationsData?.applications || [];
  const totalApplications = applicationsData?.total || 0;
  const totalPages = applicationsData?.totalPages || 1;
  
  console.log('Full applications response:', applicationsData);
  console.log('Applications array:', applications);
  console.log('Applications count:', applications.length);
  console.log('Total applications:', totalApplications);
  console.log('Is Loading:', applicationsLoading);
  console.log('Has Error:', applicationsError);

  const handleViewResume = (application: AdminApplication) => {
    // Build resume URL - check multiple sources
    let resumeUrl: string | null = null;
    
    // First check if resumeFilePath is already a full URL
    if (application.resumeFilePath) {
      if (application.resumeFilePath.startsWith('http://') || application.resumeFilePath.startsWith('https://')) {
        resumeUrl = application.resumeFilePath;
      } else {
        // It's a relative path, build full URL
        resumeUrl = `https://spearwin.sfo3.digitaloceanspaces.com/${application.resumeFilePath}`;
      }
    } 
    // If no resumeFilePath, check resume object
    else if (application.resume) {
      // Check if resume has filePath (document key)
      const resume = application.resume as any;
      if (resume.filePath) {
        if (resume.filePath.startsWith('http://') || resume.filePath.startsWith('https://')) {
          resumeUrl = resume.filePath;
        } else {
          resumeUrl = `https://spearwin.sfo3.digitaloceanspaces.com/${resume.filePath}`;
        }
      } else if (resume.fileName) {
        // Fallback: try to construct from fileName
        resumeUrl = `https://spearwin.sfo3.digitaloceanspaces.com/documents/${resume.fileName}`;
      }
    }
    
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    } else {
      toast.error('Resume not available for this application');
    }
  };

  const handleViewCandidate = (candidateId: string) => {
    navigate(`/candidate/${candidateId}`);
  };

  const handleRefresh = () => {
    refetchApplications();
    toast.success('Applications refreshed');
  };

  const queryClient = useQueryClient();

  // Mutation for updating application status using admin API
  const updateStatusMutation = useMutation({
    mutationFn: async ({ applicationId, status }: { applicationId: string; status: string }) => {
      return adminService.updateApplicationStatus(applicationId, status);
    },
    onSuccess: () => {
      // Invalidate and refetch applications list
      queryClient.invalidateQueries({ queryKey: ['admin-applications'] });
      toast.success('Application status updated successfully');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to update application status';
      toast.error(errorMessage);
      console.error('Error updating status:', error);
    },
  });

  // Mutation for updating candidate/user status
  const updateCandidateStatusMutation = useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: string }) => {
      return adminService.updateUserStatus(userId, status);
    },
    onSuccess: () => {
      // Invalidate and refetch applications list
      queryClient.invalidateQueries({ queryKey: ['admin-applications'] });
      toast.success('Candidate status updated successfully');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to update candidate status';
      toast.error(errorMessage);
      console.error('Error updating candidate status:', error);
    },
  });

  const handleStatusChange = (application: AdminApplication, newStatus: string) => {
    // Since API returns null IDs, we need to handle this
    // For now, we'll show an error if ID is null
    if (!application.id) {
      toast.error('Cannot update status: Application ID is missing');
      console.error('Application ID is null:', application);
      return;
    }
    
    console.log('Updating application status:', {
      applicationId: application.id,
      currentStatus: application.status,
      newStatus: newStatus
    });
    
    updateStatusMutation.mutate({
      applicationId: application.id.toString(),
      status: newStatus,
    });
  };

  const handleCandidateStatusChange = (application: AdminApplication, newStatus: string) => {
    // Get userId from candidate - we need to fetch it if not available
    // The backend should include userId in the candidate response
    const userId = application.candidate?.userId;
    
    if (!userId) {
      toast.error('Cannot update candidate status: User ID is missing');
      return;
    }
    
    updateCandidateStatusMutation.mutate({
      userId: userId,
      status: newStatus,
    });
  };

  // Map user status to StatusBadge type
  const mapUserStatus = (status: string): "active" | "inactive" | "pending" | "completed" | "cancelled" => {
    const normalizedStatus = status?.toUpperCase() || 'PENDING_VERIFICATION';
    switch (normalizedStatus) {
      case 'ACTIVE':
        return 'active';
      case 'INACTIVE':
        return 'inactive';
      case 'SUSPENDED':
        return 'cancelled';
      case 'PENDING_VERIFICATION':
        return 'pending';
      default:
        return 'pending';
    }
  };

  return (
    <div className="bg-white rounded-[10px] shadow-sm border border-gray-200">
      <div className="px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Job Applications - Candidate Details</h2>
          <button 
            onClick={handleRefresh}
            disabled={applicationsLoading}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <select 
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setApplicationsPage(1);
              }}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="INTERVIEWED">Interviewed</option>
              <option value="SELECTED">Selected</option>
              <option value="REJECTED">Rejected</option>
              </select>
              </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Job Title</label>
            <input
              type="text"
              value={jobTitleFilter}
              onChange={(e) => {
                setJobTitleFilter(e.target.value);
                setApplicationsPage(1);
              }}
              placeholder="Filter by job title"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Company</label>
            <input
              type="text"
              value={companyNameFilter}
              onChange={(e) => {
                setCompanyNameFilter(e.target.value);
                setApplicationsPage(1);
              }}
              placeholder="Filter by company"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
              </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Candidate Name</label>
            <input
              type="text"
              value={candidateNameFilter}
              onChange={(e) => {
                setCandidateNameFilter(e.target.value);
                setApplicationsPage(1);
              }}
              placeholder="Filter by candidate name"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            </div>
              </div>
            </div>

      {applicationsLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
          <span className="ml-2 text-gray-600">Loading applications...</span>
        </div>
      ) : applicationsError ? (
        <div className="text-center py-12 px-6">
          <p className="text-red-600 mb-2 font-medium">Error loading applications</p>
          <p className="text-sm text-gray-500 mb-4">
            {(applicationsError as any)?.response?.data?.message || 
             (applicationsError as any)?.message || 
             'Please check your connection and try again'}
          </p>
          <button 
            onClick={() => refetchApplications()}
            className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors"
          >
            Retry
            </button>
          </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-12 px-6">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500 text-lg font-medium mb-2">No applications found</p>
          <p className="text-gray-400 text-sm mb-4">Try adjusting your filters or check back later</p>
          <button 
            onClick={() => refetchApplications()}
            className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors"
          >
            Refresh
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto px-6 pb-4">
            <Table className="w-full min-w-[1200px]">
          <TableHeader>
                <TableRow className="bg-blue-50">
                  <TableCell isHeader className="pl-6 pr-3 py-3 text-left text-xs font-medium text-blue-900 uppercase">Candidate Name</TableCell>
                  <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase">Email</TableCell>
                  <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase">Job Title</TableCell>
                  <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase">Company</TableCell>
                  <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase">Location</TableCell>
                  <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase">Current Title</TableCell>
                  <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase">Status</TableCell>
                  <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase">Applied Date</TableCell>
                  <TableCell isHeader className="pl-3 pr-6 py-3 text-left text-xs font-medium text-blue-900 uppercase">Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
                {applications.map((application: AdminApplication, index: number) => {
                    const candidateName = `${application.candidate?.firstName || ''} ${application.candidate?.lastName || ''}`.trim() || 'N/A';
                    // Try candidate city first, then job location city, then fallback to N/A
                    const location = application.candidate?.city?.name || application.job?.location?.city?.name || 'N/A';
                    // Use index as fallback key if id is null
                    const rowKey = application.id || `app-${index}-${application.appliedAt}`;
                    
                    return (
                      <tr key={rowKey} className="hover:bg-gray-50">
                        <td className="pl-6 pr-3 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{candidateName}</p>
                              {application.candidate?.currentTitle && (
                                <p className="text-xs text-gray-500">{application.candidate.currentTitle}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">{application.candidate?.email || 'N/A'}</td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">{application.job?.title || 'N/A'}</td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">{application.job?.company?.name || 'N/A'}</td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">{location}</td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                          {application.candidate?.currentTitle || 'N/A'}
                        </td>
                <td className="px-3 py-3 whitespace-nowrap">
                          {(() => {
                            const statusDisplay = getApplicationStatusDisplay(application.status || 'APPLIED');
                            return (
                              <StatusBadge 
                                status={statusDisplay.badgeType} 
                                customLabel={statusDisplay.label}
                              />
                            );
                          })()}
                </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                          {application.appliedAt ? new Date(application.appliedAt).toLocaleDateString() : 'N/A'}
                </td>
                        <td className="pl-3 pr-6 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewResume(application)}
                              className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="View Resume"
                              disabled={!application.resume && !application.resumeFilePath}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                            {/* <button
                              onClick={() => application.candidate?.id && handleViewCandidate(application.candidate.id)}
                              className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="View Candidate Profile"
                              disabled={!application.candidate?.id}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </button> */}
                            {/* Application Status Dropdown */}
                            <select
                              value={application.status || 'UNDER_REVIEW'}
                              onChange={(e) => handleStatusChange(application, e.target.value)}
                              disabled={!application.id || updateStatusMutation.isPending}
                              className="text-xs px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed bg-white min-w-[120px]"
                              title="Change Application Status"
                            >
                              <option value="UNDER_REVIEW">Under Review</option>
                              <option value="SHORTLISTED">Shortlisted</option>
                              <option value="INTERVIEWED">Interviewed</option>
                              <option value="SELECTED">Selected</option>
                              <option value="REJECTED">Rejected</option>
                            </select>
                            {/* Candidate Status Dropdown */}
                            {/* <select
                              value={application.candidate?.status || 'PENDING_VERIFICATION'}
                              onChange={(e) => handleCandidateStatusChange(application, e.target.value)}
                              disabled={!application.candidate?.userId || updateCandidateStatusMutation.isPending}
                              className="text-xs px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed bg-white min-w-[140px]"
                              title="Change Candidate Status"
                            >
                              <option value="ACTIVE">Active</option>
                              <option value="INACTIVE">Inactive</option>
                              <option value="SUSPENDED">Suspended</option>
                              <option value="PENDING_VERIFICATION">Pending Verification</option>
                            </select> */}
                  </div>
                </td>
              </tr>
                    );
                  })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
                Showing {((applicationsPage - 1) * 10) + 1}-{Math.min(applicationsPage * 10, totalApplications)} of {totalApplications}
          </div>
          <div className="flex items-center gap-2">
            <button 
                  onClick={() => setApplicationsPage(Math.max(1, applicationsPage - 1))}
                  disabled={applicationsPage === 1 || applicationsLoading}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
                <span className="text-sm text-gray-500">
                  Page {applicationsPage} of {totalPages}
                </span>
            <button 
                  onClick={() => setApplicationsPage(Math.min(totalPages, applicationsPage + 1))}
                  disabled={applicationsPage === totalPages || applicationsLoading}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
}
