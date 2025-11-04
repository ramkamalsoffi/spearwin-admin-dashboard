import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../components/ui/table";
import StatusBadge from "../components/ui/status-badge/StatusBadge";
import SearchableDropdown from "../components/ui/SearchableDropdown";
import { candidateService, CVSearchQueryParams } from "../services/candidateService";
import { companyService } from "../services/companyService";
import { skillsService } from "../services/skillsService";

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

  // Transform emails data
  const emailsOptions = emailsDropdown || [];

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
      profileType: searchData.profileType || undefined,
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
    queryFn: () => candidateService.searchCandidates(buildSearchParams()),
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

  // Handle error
  if (error) {
    const errorMessage = (error as any).response?.data?.message || "Failed to search candidates";
    toast.error(errorMessage);
    console.error("Error searching candidates:", error);
  }

  const searchResults = candidatesResponse?.candidates || [];
  const totalResults = candidatesResponse?.total || 0;
  const totalPages = candidatesResponse?.totalPages || 1;

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
      <div className="px-4 sm:px-6 lg:px-30 ">
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

      <div className="px-4 sm:px-6 lg:px-30 py-4">
        {/* Search Form Container */}
        <div className="bg-white rounded-[10px] shadow-sm border border-gray-200">
          <div className="p-6">
            {/* Search Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Row 1 */}
              <div>
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
              <div>
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
              <div>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Type
                </label>
                <select
                  value={searchData.profileType}
                  onChange={(e) => handleInputChange("profileType", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Profile Types</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="PENDING">Pending</option>
                </select>
              </div>
            </div>

            {/* Search Button */}
            <div className="flex justify-center gap-3 mb-6">
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
            <div className="border-t border-gray-200 pt-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
                  <span className="ml-2 text-gray-600">Searching candidates...</span>
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
                  <div className="flex items-center justify-between border-t border-gray-200 pt-4">
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
      </div>

      {/* CV Status Maintenance Section */}
      <div className="px-4 sm:px-6 lg:px-30 py-4">
        <CVStatusMaintenanceInline />
      </div>
    </>
  );
}

// Inline CV Status Maintenance Section (moved from separate page)
function CVStatusMaintenanceInline() {
  const navigate = useNavigate();
  const [cvPage, setCvPage] = useState(1);
  const [filterBy, setFilterBy] = useState("Language");
  const [orderType, setOrderType] = useState("Order Type");
  const [orderStatus, setOrderStatus] = useState("Order Status");

  // Sample CV status data matching the image
  const cvStatusData = [
    {
      id: 1,
      language: "English",
      cvStatus: "cv - Hold",
      assignedTo: "Role 2",
      isDefault: true,
      status: "Active"
    },
    {
      id: 2,
      language: "English",
      cvStatus: "cv - Hold",
      assignedTo: "Role 2",
      isDefault: true,
      status: "Inactive"
    },
    {
      id: 3,
      language: "English",
      cvStatus: "cv - Hold",
      assignedTo: "Role 2",
      isDefault: true,
      status: "Active"
    },
    {
      id: 4,
      language: "English",
      cvStatus: "cv - Hold",
      assignedTo: "Role 2",
      isDefault: true,
      status: "Active"
    },
    {
      id: 5,
      language: "English",
      cvStatus: "cv - Hold",
      assignedTo: "Role 2",
      isDefault: true,
      status: "Active"
    },
    {
      id: 6,
      language: "English",
      cvStatus: "cv - Hold",
      assignedTo: "Role 2",
      isDefault: true,
      status: "Active"
    },
    {
      id: 7,
      language: "English",
      cvStatus: "cv - Hold",
      assignedTo: "Role 2",
      isDefault: true,
      status: "Active"
    },
    {
      id: 8,
      language: "English",
      cvStatus: "cv - Hold",
      assignedTo: "Role 2",
      isDefault: true,
      status: "Active"
    },
    {
      id: 9,
      language: "English",
      cvStatus: "cv - Hold",
      assignedTo: "Role 2",
      isDefault: true,
      status: "Active"
    }
  ];

  const totalCVStatus = 78;
  const cvStatusPerPage = 10;
  const totalPages = Math.ceil(totalCVStatus / cvStatusPerPage);

  const handleEdit = (cvStatus: any) => {
    navigate(`/edit-cv-status/${cvStatus.id}`);
  };

  const handleDelete = (cvStatus: any) => {
    if (window.confirm(`Are you sure you want to delete this CV status?`)) {
      // Handle delete logic here
      // Placeholder
    }
  };

  const handleCvStatusRefresh = () => {
    // Reload data from API (placeholder - to be implemented)
    console.log('CV Status refresh triggered');
  };

  return (
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
                <option>Language</option>
                <option>CV Status</option>
                <option>Assigned to</option>
                <option>Default</option>
                <option>Status</option>
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

            <button className="p-2 text-gray-400 hover:text-gray-600" onClick={handleCvStatusRefresh}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          <button 
            onClick={() => navigate("/add-cv-status")}
            className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Add Status
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table className="w-full min-w-[700px]">
          <TableHeader>
            <TableRow className="bg-blue-50 mx-4">
              <TableCell isHeader className="rounded-l-[20px] pl-6 pr-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Language</TableCell>
              <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">CV Status</TableCell>
              <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Assigned to</TableCell>
              <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Default</TableCell>
              <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Status</TableCell>
              <TableCell isHeader className="rounded-r-[20px] pl-3 pr-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Action</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
            {cvStatusData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="pl-6 pr-3 py-3 whitespace-nowrap text-sm text-gray-500">{row.language}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">{row.cvStatus}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">{row.assignedTo}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">{row.isDefault ? "Yes" : "No"}</td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <StatusBadge status={row.status.toLowerCase() as "active" | "inactive"} />
                </td>
                <td className="pl-3 pr-6 py-3 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <button className="p-1 text-blue-600 hover:text-blue-800" onClick={() => handleEdit(row)}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button className="p-1 text-red-600 hover:text-red-800" onClick={() => handleDelete(row)}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing 1-{cvStatusPerPage} of {totalCVStatus}
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCvPage(Math.max(1, cvPage - 1))}
              disabled={cvPage === 1}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={() => setCvPage(Math.min(totalPages, cvPage + 1))}
              disabled={cvPage === totalPages}
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
  );
}
