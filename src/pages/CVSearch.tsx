import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../components/ui/table";
import StatusBadge from "../components/ui/status-badge/StatusBadge";
import SearchableDropdown from "../components/ui/SearchableDropdown";
import { candidateService, CVSearchQueryParams, CandidateProfile } from "../services/candidateService";
import { companyService } from "../services/companyService";
import { skillsService } from "../services/skillsService";
import { adminService, AdminApplication, AdvancedCVSearchResult } from "../services/adminService";
import { jobService } from "../services/jobService";
import { FileIcon } from "../icons";
import CandidateViewDialog from "../components/CandidateViewDialog";

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
  
  // Advanced Search state
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [advancedSearchData, setAdvancedSearchData] = useState({
    keywords: "",
    skills: "",
    location: "",
    company: "",
    minExperience: "",
    maxExperience: "",
    candidateName: "",
    email: "",
  });
  const [advancedSearchTriggered, setAdvancedSearchTriggered] = useState(false);

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

      {/* Advanced Search Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white rounded-[10px] shadow-sm border border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Advanced CV Search</h2>
              <button
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {showAdvancedSearch ? 'Hide' : 'Show'} Advanced Search
              </button>
            </div>

            {showAdvancedSearch && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Keywords (Resume Text)
                    </label>
                    <input
                      type="text"
                      value={advancedSearchData.keywords}
                      onChange={(e) => setAdvancedSearchData(prev => ({ ...prev, keywords: e.target.value }))}
                      placeholder="Search within resume text..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Search within extracted resume content</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Skills
                    </label>
                    <input
                      type="text"
                      value={advancedSearchData.skills}
                      onChange={(e) => setAdvancedSearchData(prev => ({ ...prev, skills: e.target.value }))}
                      placeholder="e.g., JavaScript, React"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={advancedSearchData.location}
                      onChange={(e) => setAdvancedSearchData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="City or location"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      value={advancedSearchData.company}
                      onChange={(e) => setAdvancedSearchData(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="Current company"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Experience (Years)
                    </label>
                    <input
                      type="number"
                      value={advancedSearchData.minExperience}
                      onChange={(e) => setAdvancedSearchData(prev => ({ ...prev, minExperience: e.target.value }))}
                      placeholder="0"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Experience (Years)
                    </label>
                    <input
                      type="number"
                      value={advancedSearchData.maxExperience}
                      onChange={(e) => setAdvancedSearchData(prev => ({ ...prev, maxExperience: e.target.value }))}
                      placeholder="20"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Candidate Name
                    </label>
                    <input
                      type="text"
                      value={advancedSearchData.candidateName}
                      onChange={(e) => setAdvancedSearchData(prev => ({ ...prev, candidateName: e.target.value }))}
                      placeholder="Candidate name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={advancedSearchData.email}
                      onChange={(e) => setAdvancedSearchData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="candidate@email.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setAdvancedSearchTriggered(true);
                      setCurrentPage(1);
                    }}
                    className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search Resumes
                  </button>
                  <button
                    onClick={() => {
                      setAdvancedSearchData({
                        keywords: "",
                        skills: "",
                        location: "",
                        company: "",
                        minExperience: "",
                        maxExperience: "",
                        candidateName: "",
                        email: "",
                      });
                      setAdvancedSearchTriggered(false);
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Search Results */}
      {advancedSearchTriggered && showAdvancedSearch && (
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <AdvancedSearchResults 
            searchParams={advancedSearchData}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}

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

      {/* Job Applications Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <JobApplicationsSection />
      </div>
    </>
  );
}

// Advanced Search Results Component
function AdvancedSearchResults({ 
  searchParams, 
  currentPage, 
  setCurrentPage 
}: { 
  searchParams: any; 
  currentPage: number; 
  setCurrentPage: (page: number) => void;
}) {
  const navigate = useNavigate();
  const [selectedCandidateUserId, setSelectedCandidateUserId] = useState<string | null>(null);


  // Build query params
  const buildQueryParams = () => {
    const params: any = {
      page: currentPage.toString(),
      limit: '10',
    };
    
    if (searchParams.keywords) params.keywords = searchParams.keywords;
    if (searchParams.skills) params.skills = searchParams.skills;
    if (searchParams.location) params.location = searchParams.location;
    if (searchParams.company) params.company = searchParams.company;
    if (searchParams.minExperience) params.minExperience = parseInt(searchParams.minExperience);
    if (searchParams.maxExperience) params.maxExperience = parseInt(searchParams.maxExperience);
    if (searchParams.candidateName) params.candidateName = searchParams.candidateName;
    if (searchParams.email) params.email = searchParams.email;
    
    return params;
  };

  // Check if there's at least one search parameter
  const hasSearchParams = () => {
    return !!(
      searchParams.keywords ||
      searchParams.skills ||
      searchParams.location ||
      searchParams.company ||
      searchParams.minExperience ||
      searchParams.maxExperience ||
      searchParams.candidateName ||
      searchParams.email
    );
  };

  const { 
    data: searchResults, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['advanced-cv-search', buildQueryParams()],
    queryFn: () => adminService.advancedCVSearch(buildQueryParams()),
    enabled: hasSearchParams(), // Only run if there are search parameters
    staleTime: 5 * 60 * 1000,
  });

  // Show all candidates (no filtering by applications)
  const allResults = searchResults?.results || [];
  const total = searchResults?.total || 0;
  const totalPages = searchResults?.totalPages || 1;

  if (isLoading) {
    return (
      <div className="bg-white rounded-[10px] shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
          <span className="ml-2 text-gray-600">Searching resumes...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-[10px] shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <p className="text-red-600 mb-2">Error searching resumes</p>
          <p className="text-sm text-gray-500 mb-4">
            {(error as any)?.response?.data?.message || 'Please check your connection and try again'}
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[10px] shadow-sm border border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Search Results ({total} candidates found)
          </h3>
          <button
            onClick={() => refetch()}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {allResults.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No candidates found</h3>
            <p className="mt-1 text-sm text-gray-500 mb-2">
              {searchParams.keywords 
                ? "No candidates found with extracted text matching your keywords. Resumes need to have their text extracted first."
                : "No candidates match your search criteria. Try adjusting your filters."}
            </p>
            {searchParams.keywords && (
              <p className="text-xs text-gray-400">
                Note: Advanced search requires resumes to have extracted text content.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {allResults.map((result: AdvancedCVSearchResult) => {
              const fullName = `${result.firstName} ${result.lastName}`.trim();
              const skills = result.skills?.join(', ') || 'N/A';

              return (
                <div key={result.candidateId} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors">
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
                      <p className="text-sm text-gray-900">{result.currentLocation || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Expected Salary:</span>
                      <p className="text-sm text-gray-900">
                        {result.expectedSalary ? `₹${result.expectedSalary.toLocaleString()}` : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Current Title:</span>
                      <p className="text-sm text-gray-900">{result.currentTitle || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Resume:</span>
                      <p className="text-sm text-gray-900 truncate">{result.resumeFileName}</p>
                    </div>
                    <div className="md:col-span-2 lg:col-span-4">
                      <span className="text-sm font-medium text-gray-500">Skills:</span>
                      <p className="text-sm text-gray-900 line-clamp-2">{skills}</p>
                    </div>
                    
                    {/* Show matched snippets if available */}
                    {result.matchedSnippets && result.matchedSnippets.length > 0 && (
                      <div className="md:col-span-2 lg:col-span-4">
                        <span className="text-sm font-medium text-gray-500">Matched Content:</span>
                        <div className="mt-2 space-y-2">
                          {result.matchedSnippets.slice(0, 3).map((snippet, idx) => (
                            <div key={idx} className="bg-yellow-50 border border-yellow-200 rounded px-3 py-2">
                              <p className="text-xs text-gray-700">{snippet}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="md:col-span-2 lg:col-span-4 flex gap-2">
                      <button 
                        onClick={() => {
                          // Try to get userId from result, or fetch it if needed
                          if (result.userId) {
                            setSelectedCandidateUserId(result.userId);
                          } else {
                            // If userId is not available, try to fetch it
                            // For now, we'll use candidateId and let the dialog handle it
                            // The dialog might need to be updated to accept candidateId
                            toast.error('User ID not available. Please try again.');
                          }
                        }}
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
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="text-sm text-gray-700">
                  Showing {((currentPage - 1) * 10) + 1}-{Math.min(currentPage * 10, total)} of {total}
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
            )}
          </div>
        )}
      </div>

      {/* Candidate View Dialog */}
      <CandidateViewDialog
        isOpen={selectedCandidateUserId !== null}
        onClose={() => setSelectedCandidateUserId(null)}
        userId={selectedCandidateUserId}
      />
    </div>
  );
}

// All Candidates List Section - Shows all candidate users with their details
function CVStatusMaintenanceInline() {
  const navigate = useNavigate();
  const [candidatesPage, setCandidatesPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [candidateNameFilter, setCandidateNameFilter] = useState<string>("");
  const [emailFilter, setEmailFilter] = useState<string>("");
  const [companyFilter, setCompanyFilter] = useState<string>("");
  const [selectedCandidateUserId, setSelectedCandidateUserId] = useState<string | null>(null);

  // Debounced filter values for API calls
  const [debouncedCandidateNameFilter, setDebouncedCandidateNameFilter] = useState<string>("");
  const [debouncedEmailFilter, setDebouncedEmailFilter] = useState<string>("");
  const [debouncedCompanyFilter, setDebouncedCompanyFilter] = useState<string>("");

  // Debounce candidate name filter (1 second)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCandidateNameFilter(candidateNameFilter);
      setCandidatesPage(1); // Reset to first page when filter changes
    }, 1000);
    return () => clearTimeout(timer);
  }, [candidateNameFilter]);

  // Debounce email filter (1 second)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedEmailFilter(emailFilter);
      setCandidatesPage(1); // Reset to first page when filter changes
    }, 1000);
    return () => clearTimeout(timer);
  }, [emailFilter]);

  // Debounce company filter (1 second)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCompanyFilter(companyFilter);
      setCandidatesPage(1); // Reset to first page when filter changes
    }, 1000);
    return () => clearTimeout(timer);
  }, [companyFilter]);

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

  // Fetch all candidates
  const { 
    data: candidatesData, 
    isLoading: candidatesLoading, 
    error: candidatesError,
    refetch: refetchCandidates 
  } = useQuery({
    queryKey: ['all-candidates', candidatesPage, statusFilter, debouncedCandidateNameFilter, debouncedEmailFilter, debouncedCompanyFilter],
    queryFn: async () => {
      try {
        const result = await candidateService.searchCandidates({
          search: debouncedCandidateNameFilter || undefined,
          email: debouncedEmailFilter || undefined,
          currentCompany: debouncedCompanyFilter || undefined,
          page: candidatesPage,
          limit: 10,
          sortBy: 'createdAt',
          sortOrder: 'desc',
        });
        console.log('Candidates data:', result);
        return result;
      } catch (error) {
        console.error('Error fetching candidates:', error);
        toast.error('Failed to load candidates');
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
    enabled: true, // Always enable the query
  });

  // Handle response data
  const candidates = candidatesData?.candidates || [];
  const totalCandidates = candidatesData?.total || 0;
  const totalPages = candidatesData?.totalPages || 1;
  
  console.log('Full candidates response:', candidatesData);
  console.log('Candidates array:', candidates);
  console.log('Candidates count:', candidates.length);
  console.log('Total candidates:', totalCandidates);
  console.log('Is Loading:', candidatesLoading);
  console.log('Has Error:', candidatesError);

  const handleViewResume = async (candidate: CandidateProfile) => {
    console.log('Viewing resume for candidate:', candidate.id);
    console.log('Candidate resumes:', candidate.resumes);
    
    // Get the first resume if available
    let resume = candidate.resumes?.[0];
    
    // If no resume in the list, try to fetch the full profile
    if (!resume && candidate.userId) {
      try {
        toast.loading('Loading resume information...');
        const profileResponse = await candidateService.getCandidateProfile(candidate.userId);
        const fullProfile = profileResponse.data;
        console.log('Full profile data:', fullProfile);
        resume = fullProfile?.resumes?.[0];
        
        if (resume) {
          toast.dismiss();
          toast.success('Resume loaded');
        } else {
          toast.dismiss();
          toast.error('No resume available for this candidate');
          return;
        }
      } catch (error) {
        console.error('Error fetching candidate profile:', error);
        toast.dismiss();
        toast.error('Failed to load resume information');
        return;
      }
    }
    
    if (!resume) {
      console.error('No resume found for candidate:', candidate.id);
      toast.error('No resume available for this candidate');
      return;
    }
    
    console.log('Resume data:', resume);
    
    // Build resume URL - Use filePath instead of fileUrl
    let resumeUrl: string | null = null;
    const filePath = (resume as any).filePath || (resume as any).fileUrl; // Support both field names for compatibility
    
    if (!filePath) {
      console.error('Resume filePath is missing:', resume);
      toast.error('Resume file path is not available');
      return;
    }
    
    // Check if it's already a full URL
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      resumeUrl = filePath;
    } else {
      // Construct DigitalOcean Spaces URL
      const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
      resumeUrl = `https://spearwin.sfo3.digitaloceanspaces.com/${cleanPath}`;
    }
    
    console.log('Resume URL:', resumeUrl);
    
    // Open the resume URL
    if (resumeUrl) {
      try {
        // Try to open in new window first
        const newWindow = window.open(resumeUrl, '_blank', 'noopener,noreferrer');
        if (!newWindow) {
          // If popup blocked, try to download instead
          console.warn('Popup blocked, attempting to download resume');
          const link = document.createElement('a');
          link.href = resumeUrl;
          link.target = '_blank';
          link.download = resume.fileName || 'resume.pdf';
          link.rel = 'noopener noreferrer';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          toast.success('Downloading resume...');
        } else {
          toast.success('Opening resume...');
        }
      } catch (error) {
        console.error('Error opening resume:', error);
        // Fallback: try to download
        try {
          const link = document.createElement('a');
          link.href = resumeUrl;
          link.target = '_blank';
          link.download = resume.fileName || 'resume.pdf';
          link.rel = 'noopener noreferrer';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          toast.success('Downloading resume...');
        } catch (downloadError) {
          console.error('Error downloading resume:', downloadError);
          toast.error('Failed to open resume. Please check the console for details.');
        }
      }
    } else {
      console.error('Resume URL is null or empty');
      toast.error('Resume URL not available');
    }
  };

  const handleViewCandidate = (candidate: CandidateProfile) => {
    const userId = candidate.userId || candidate.id;
    if (userId) {
      setSelectedCandidateUserId(userId);
    } else {
      toast.error('User ID not available for this candidate');
    }
  };

  const handleRefresh = () => {
    refetchCandidates();
    toast.success('Candidates refreshed');
  };

  const queryClient = useQueryClient();

  // Mutation for updating candidate/user status
  const updateCandidateStatusMutation = useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: string }) => {
      return adminService.updateUserStatus(userId, status);
    },
    onSuccess: () => {
      // Invalidate and refetch candidates list
      queryClient.invalidateQueries({ queryKey: ['all-candidates'] });
      toast.success('Candidate status updated successfully');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to update candidate status';
      toast.error(errorMessage);
      console.error('Error updating candidate status:', error);
    },
  });

  const handleCandidateStatusChange = (candidate: CandidateProfile, newStatus: string) => {
    const userId = candidate.userId || candidate.id;
    
    if (!userId) {
      toast.error('Cannot update candidate status: User ID is missing');
      return;
    }
    
    updateCandidateStatusMutation.mutate({
      userId: userId,
      status: newStatus,
    });
  };

  return (
    <div className="bg-white rounded-[10px] shadow-sm border border-gray-200">
      <div className="px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-900">All Candidates</h2>
          <button 
            onClick={handleRefresh}
            disabled={candidatesLoading}
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
                setCandidatesPage(1);
              }}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="PENDING_VERIFICATION">Pending Verification</option>
              </select>
              </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Candidate Name</label>
            <input
              type="text"
              value={candidateNameFilter}
              onChange={(e) => {
                setCandidateNameFilter(e.target.value);
              }}
              placeholder="Filter by candidate name"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
            <input
              type="text"
              value={emailFilter}
              onChange={(e) => {
                setEmailFilter(e.target.value);
              }}
              placeholder="Filter by email"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
              </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Current Company</label>
            <input
              type="text"
              value={companyFilter}
              onChange={(e) => {
                setCompanyFilter(e.target.value);
              }}
              placeholder="Filter by company"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            </div>
              </div>
            </div>

      {candidatesLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
          <span className="ml-2 text-gray-600">Loading candidates...</span>
        </div>
      ) : candidatesError ? (
        <div className="text-center py-12 px-6">
          <p className="text-red-600 mb-2 font-medium">Error loading candidates</p>
          <p className="text-sm text-gray-500 mb-4">
            {(candidatesError as any)?.response?.data?.message || 
             (candidatesError as any)?.message || 
             'Please check your connection and try again'}
          </p>
          <button 
            onClick={() => refetchCandidates()}
            className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors"
          >
            Retry
            </button>
          </div>
      ) : candidates.length === 0 ? (
        <div className="text-center py-12 px-6">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-gray-500 text-lg font-medium mb-2">No candidates found</p>
          <p className="text-gray-400 text-sm mb-4">Try adjusting your filters or check back later</p>
          <button 
            onClick={() => refetchCandidates()}
            className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors"
          >
            Refresh
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto px-6 pb-4">
            <Table className="w-full">
          <TableHeader>
                <TableRow className="bg-blue-50">
                  <TableCell isHeader className="pl-6 pr-3 py-3 text-left text-xs font-medium text-blue-900 uppercase">Email</TableCell>
                  <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase">Phone</TableCell>
                  <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase">Location</TableCell>
                  <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase">Experience</TableCell>
                  <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase">Status</TableCell>
                  <TableCell isHeader className="px-3 py-3 text-center text-xs font-medium text-blue-900 uppercase">Resume</TableCell>
                  <TableCell isHeader className="pl-3 pr-6 py-3 text-left text-xs font-medium text-blue-900 uppercase">Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
                {candidates.map((candidate: CandidateProfile) => {
                    const location = candidate.city?.name || candidate.currentLocation || 'N/A';
                    const hasResume = candidate.resumes && candidate.resumes.length > 0;
                    
                    return (
                      <tr key={candidate.id} className="hover:bg-gray-50">
                        <td className="pl-6 pr-3 py-3 text-sm text-gray-500 break-words">{candidate.email || 'N/A'}</td>
                        <td className="px-3 py-3 text-sm text-gray-500">{candidate.phone || 'N/A'}</td>
                        <td className="px-3 py-3 text-sm text-gray-500">{location}</td>
                        <td className="px-3 py-3 text-sm text-gray-500">
                          {candidate.experienceYears ? `${candidate.experienceYears} years` : 'N/A'}
                        </td>
                <td className="px-3 py-3 whitespace-nowrap">
                          <StatusBadge 
                            status={mapUserStatus(candidate.status || 'PENDING_VERIFICATION')} 
                          />
                </td>
                        <td className="px-3 py-3 whitespace-nowrap text-center">
                          {hasResume ? (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleViewResume(candidate);
                              }}
                              className="mx-auto p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors active:scale-95 cursor-pointer"
                              title="View Resume"
                              type="button"
                            >
                              <FileIcon className="w-6 h-6" />
                            </button>
                          ) : (
                            <span className="text-gray-400" title="No resume available">
                              <FileIcon className="w-6 h-6 opacity-30" />
                            </span>
                          )}
                        </td>
                        <td className="pl-3 pr-6 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2 flex-wrap">
                            <button
                              onClick={() => handleViewCandidate(candidate)}
                              className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors"
                              title="View Candidate Profile"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => navigate(`/edit-profile/${candidate.userId || candidate.id}`)}
                              className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                              title="Edit Candidate"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <select
                              value={candidate.status || 'PENDING_VERIFICATION'}
                              onChange={(e) => handleCandidateStatusChange(candidate, e.target.value)}
                              disabled={!candidate.userId || updateCandidateStatusMutation.isPending}
                              className="text-xs px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed bg-white min-w-[140px]"
                              title="Change Candidate Status"
                            >
                              <option value="ACTIVE">Active</option>
                              <option value="INACTIVE">Inactive</option>
                              <option value="SUSPENDED">Suspended</option>
                              <option value="PENDING_VERIFICATION">Pending Verification</option>
                            </select>
                  </div>
                </td>
              </tr>
                    );
                  })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden px-6 pb-4 space-y-4">
        {candidates.map((candidate: CandidateProfile) => {
          const location = candidate.city?.name || candidate.currentLocation || 'N/A';
          const hasResume = candidate.resumes && candidate.resumes.length > 0;
          
          return (
            <div key={candidate.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Email</p>
                  <p className="text-sm text-gray-900 break-words">{candidate.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Phone</p>
                  <p className="text-sm text-gray-900">{candidate.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Location</p>
                  <p className="text-sm text-gray-900">{location}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Experience</p>
                  <p className="text-sm text-gray-900">
                    {candidate.experienceYears ? `${candidate.experienceYears} years` : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Status</p>
                  <StatusBadge 
                    status={mapUserStatus(candidate.status || 'PENDING_VERIFICATION')} 
                  />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">Resume</p>
                  {hasResume ? (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleViewResume(candidate);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors active:scale-95 cursor-pointer w-full justify-center"
                      title="View Resume"
                      type="button"
                    >
                      <FileIcon className="w-5 h-5" />
                      <span className="text-sm font-medium">View Resume</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-500 rounded-md w-full justify-center opacity-50">
                      <FileIcon className="w-5 h-5" />
                      <span className="text-sm font-medium">No Resume Available</span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">Actions</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => handleViewCandidate(candidate)}
                      className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors"
                      title="View Candidate Profile"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => navigate(`/edit-profile/${candidate.userId || candidate.id}`)}
                      className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                      title="Edit Candidate"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <select
                      value={candidate.status || 'PENDING_VERIFICATION'}
                      onChange={(e) => handleCandidateStatusChange(candidate, e.target.value)}
                      disabled={!candidate.userId || updateCandidateStatusMutation.isPending}
                      className="text-xs px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed bg-white flex-1"
                      title="Change Candidate Status"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                      <option value="SUSPENDED">Suspended</option>
                      <option value="PENDING_VERIFICATION">Pending Verification</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="px-4 sm:px-6 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
                Showing {((candidatesPage - 1) * 10) + 1}-{Math.min(candidatesPage * 10, totalCandidates)} of {totalCandidates}
          </div>
          <div className="flex items-center gap-2">
            <button 
                  onClick={() => setCandidatesPage(Math.max(1, candidatesPage - 1))}
                  disabled={candidatesPage === 1 || candidatesLoading}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
                <span className="text-xs sm:text-sm text-gray-500">
                  Page {candidatesPage} of {totalPages}
                </span>
            <button 
                  onClick={() => setCandidatesPage(Math.min(totalPages, candidatesPage + 1))}
                  disabled={candidatesPage === totalPages || candidatesLoading}
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

      {/* Candidate View Dialog */}
      <CandidateViewDialog
        isOpen={selectedCandidateUserId !== null}
        onClose={() => setSelectedCandidateUserId(null)}
        userId={selectedCandidateUserId}
      />
    </div>
  );
}

// Job Applications Section - Shows all job applications with search filters
function JobApplicationsSection() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [jobTitleFilter, setJobTitleFilter] = useState<string>("");
  const [emailFilter, setEmailFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [jobSearch, setJobSearch] = useState("");
  const [applicationsPage, setApplicationsPage] = useState(1);

  // Debounced email filter for API calls
  const [debouncedEmailFilter, setDebouncedEmailFilter] = useState<string>("");

  // Debounce email filter (1 second)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedEmailFilter(emailFilter);
      setApplicationsPage(1); // Reset to first page when filter changes
    }, 1000);
    return () => clearTimeout(timer);
  }, [emailFilter]);

  // Fetch jobs for dropdown
  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ['jobs-dropdown', jobSearch],
    queryFn: () => jobService.getJobs({
      search: jobSearch || undefined,
      limit: 100,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    }),
    staleTime: 5 * 60 * 1000,
  });

  // Transform jobs data for dropdown
  const jobsOptions = (jobsData?.data || []).map((job: any) => ({
    value: job.title,
    label: `${job.title} - ${job.company?.name || 'N/A'}`,
  }));

  // Fetch all job applications with filters
  const { 
    data: applicationsResponse, 
    isLoading: applicationsLoading, 
    error: applicationsError,
    refetch: refetchApplications 
  } = useQuery({
    queryKey: ['all-applications', jobTitleFilter, debouncedEmailFilter, statusFilter, applicationsPage],
    queryFn: async () => {
      const params: any = {
        page: applicationsPage.toString(),
        limit: '20',
      };
      
      if (jobTitleFilter) params.jobTitle = jobTitleFilter;
      if (debouncedEmailFilter) params.candidateName = debouncedEmailFilter; // Using candidateName for email search
      if (statusFilter) params.status = statusFilter;
      
      const response = await adminService.getAllApplications(params);
      return response;
    },
    enabled: true, // Always enabled to show all applications
    staleTime: 5 * 60 * 1000,
  });

  // Handle response structure
  const applications = (applicationsResponse?.applications || []) as AdminApplication[];
  const totalApplications = applicationsResponse?.total || 0;
  const totalPages = applicationsResponse?.totalPages || 1;

  // Mutation for updating application status
  const updateApplicationStatusMutation = useMutation({
    mutationFn: async ({ applicationId, status }: { applicationId: string; status: string }) => {
      return adminService.updateApplicationStatus(applicationId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-applications'] });
      toast.success('Application status updated successfully');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to update application status';
      toast.error(errorMessage);
      console.error('Error updating application status:', error);
    },
  });

  const handleApplicationStatusChange = (applicationId: string, newStatus: string) => {
    if (!applicationId) {
      toast.error('Cannot update application status: Application ID is missing');
      return;
    }
    
    updateApplicationStatusMutation.mutate({
      applicationId: applicationId,
      status: newStatus,
    });
  };

  const handleViewCandidate = (candidateId: string) => {
    if (candidateId) {
      navigate(`/candidate/${candidateId}`);
    }
  };

  const handleViewResume = async (application: AdminApplication) => {
    if (!application.resumeFilePath && !application.resume?.filePath) {
      toast.error('No resume available for this application');
      return;
    }

    const filePath = application.resumeFilePath || application.resume?.filePath;
    if (!filePath) {
      toast.error('Resume file path is not available');
      return;
    }

    let resumeUrl: string | null = null;
    
    // Check if it's already a full URL
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      resumeUrl = filePath;
    } else {
      // Construct DigitalOcean Spaces URL
      const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
      resumeUrl = `https://spearwin.sfo3.digitaloceanspaces.com/${cleanPath}`;
    }

    if (resumeUrl) {
      try {
        const newWindow = window.open(resumeUrl, '_blank', 'noopener,noreferrer');
        if (!newWindow) {
          const link = document.createElement('a');
          link.href = resumeUrl;
          link.target = '_blank';
          link.download = application.resume?.fileName || 'resume.pdf';
          link.rel = 'noopener noreferrer';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          toast.success('Downloading resume...');
        } else {
          toast.success('Opening resume...');
        }
      } catch (error) {
        console.error('Error opening resume:', error);
        toast.error('Failed to open resume');
      }
    }
  };

  const formatDate = (dateString: string | Date | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  const handleRefresh = () => {
    refetchApplications();
    toast.success('Applications refreshed');
  };

  const handleClearFilters = () => {
    setJobTitleFilter("");
    setEmailFilter("");
    setStatusFilter("");
    setApplicationsPage(1);
  };

  return (
    <div className="bg-white rounded-[10px] shadow-sm border border-gray-200">
      <div className="px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Job Applications</h2>
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

        {/* Search Filters */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by Job Title
              </label>
              <SearchableDropdown
                placeholder="Search and select a job..."
                value={jobTitleFilter}
                onChange={(value) => {
                  setJobTitleFilter(value);
                  setApplicationsPage(1);
                }}
                options={jobsOptions}
                isLoading={jobsLoading}
                onSearch={setJobSearch}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by Email
              </label>
              <input
                type="text"
                value={emailFilter}
                onChange={(e) => {
                  setEmailFilter(e.target.value);
                }}
                placeholder="Enter candidate email..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setApplicationsPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="APPLIED">Applied</option>
                <option value="REVIEWED">Reviewed</option>
                <option value="SHORTLISTED">Shortlisted</option>
                <option value="REJECTED">Rejected</option>
                <option value="HIRED">Hired</option>
              </select>
            </div>
          </div>
          {(jobTitleFilter || emailFilter || statusFilter) && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm font-medium transition-colors"
              >
                Clear Filters
              </button>
              <span className="text-sm text-gray-600">
                {totalApplications} application{totalApplications !== 1 ? 's' : ''} found
              </span>
            </div>
          )}
        </div>

        {/* Applications List */}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-gray-500 text-lg font-medium mb-2">No applications found</p>
            <p className="text-gray-400 text-sm mb-4">
              {jobTitleFilter || emailFilter || statusFilter 
                ? "No applications match your search criteria. Try adjusting your filters."
                : "No applications found in the system."}
            </p>
            <button 
              onClick={() => refetchApplications()}
              className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors"
            >
              Refresh
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto pb-4">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="bg-blue-50">
                    <TableCell isHeader className="pl-6 pr-3 py-3 text-left text-xs font-medium text-blue-900 uppercase">Job Title</TableCell>
                    <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase">Candidate</TableCell>
                    <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase">Email</TableCell>
                    <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase">Phone</TableCell>
                    <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase">Applied Date</TableCell>
                    <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase">Status</TableCell>
                    <TableCell isHeader className="px-3 py-3 text-center text-xs font-medium text-blue-900 uppercase">Resume</TableCell>
                    <TableCell isHeader className="pl-3 pr-6 py-3 text-left text-xs font-medium text-blue-900 uppercase">Actions</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white divide-y divide-gray-200">
                  {applications.map((application: AdminApplication) => {
                    const candidateName = application.candidate 
                      ? `${application.candidate.firstName || ''} ${application.candidate.lastName || ''}`.trim() || 'N/A'
                      : 'N/A';
                    const candidateEmail = application.candidate?.email || 'N/A';
                    const candidatePhone = application.candidate?.phone || 'N/A';
                    const hasResume = !!(application.resumeFilePath || application.resume?.filePath);
                    
                    return (
                      <tr key={application.id} className="hover:bg-gray-50">
                        <td className="pl-6 pr-3 py-3 text-sm text-gray-900">
                          <div>
                            <p className="font-medium">{application.job?.title || 'N/A'}</p>
                            <p className="text-xs text-gray-500">{application.job?.company?.name || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-900 font-medium">{candidateName}</td>
                        <td className="px-3 py-3 text-sm text-gray-500 break-words">{candidateEmail}</td>
                        <td className="px-3 py-3 text-sm text-gray-500">{candidatePhone}</td>
                        <td className="px-3 py-3 text-sm text-gray-500">{formatDate(application.appliedAt)}</td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <StatusBadge 
                            status={application.status?.toLowerCase() as "active" | "inactive" | "pending" | "completed" | "cancelled"} 
                          />
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-center">
                          {hasResume ? (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleViewResume(application);
                              }}
                              className="mx-auto p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors active:scale-95 cursor-pointer"
                              title="View Resume"
                              type="button"
                            >
                              <FileIcon className="w-6 h-6" />
                            </button>
                          ) : (
                            <span className="text-gray-400" title="No resume available">
                              <FileIcon className="w-6 h-6 opacity-30" />
                            </span>
                          )}
                        </td>
                        <td className="pl-3 pr-6 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2 flex-wrap">
                            {application.candidateId && (
                              <button
                                onClick={() => handleViewCandidate(application.candidateId!)}
                                className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors"
                                title="View Candidate Profile"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </button>
                            )}
                            <select
                              value={application.status || 'APPLIED'}
                              onChange={(e) => handleApplicationStatusChange(application.id!, e.target.value)}
                              disabled={!application.id || updateApplicationStatusMutation.isPending}
                              className="text-xs px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed bg-white min-w-[140px]"
                              title="Change Application Status"
                            >
                              <option value="APPLIED">Applied</option>
                              <option value="REVIEWED">Reviewed</option>
                              <option value="SHORTLISTED">Shortlisted</option>
                              <option value="REJECTED">Rejected</option>
                              <option value="HIRED">Hired</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4 pb-4">
              {applications.map((application: AdminApplication) => {
                const candidateName = application.candidate 
                  ? `${application.candidate.firstName || ''} ${application.candidate.lastName || ''}`.trim() || 'N/A'
                  : 'N/A';
                const candidateEmail = application.candidate?.email || 'N/A';
                const candidatePhone = application.candidate?.phone || 'N/A';
                const hasResume = !!(application.resumeFilePath || application.resume?.filePath);
                
                return (
                  <div key={application.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Job Title</p>
                        <p className="text-sm text-gray-900 font-medium">{application.job?.title || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{application.job?.company?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Candidate</p>
                        <p className="text-sm text-gray-900 font-medium">{candidateName}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Email</p>
                        <p className="text-sm text-gray-900 break-words">{candidateEmail}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Phone</p>
                        <p className="text-sm text-gray-900">{candidatePhone}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Applied Date</p>
                        <p className="text-sm text-gray-900">{formatDate(application.appliedAt)}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Status</p>
                        <StatusBadge 
                          status={application.status?.toLowerCase() as "active" | "inactive" | "pending" | "completed" | "cancelled"} 
                        />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-2">Resume</p>
                        {hasResume ? (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleViewResume(application);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors active:scale-95 cursor-pointer w-full justify-center"
                            title="View Resume"
                            type="button"
                          >
                            <FileIcon className="w-5 h-5" />
                            <span className="text-sm font-medium">View Resume</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-500 rounded-md w-full justify-center opacity-50">
                            <FileIcon className="w-5 h-5" />
                            <span className="text-sm font-medium">No Resume Available</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-2">Actions</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          {application.candidateId && (
                            <button
                              onClick={() => handleViewCandidate(application.candidateId!)}
                              className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors"
                              title="View Candidate Profile"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </button>
                          )}
                          <select
                            value={application.status || 'APPLIED'}
                            onChange={(e) => handleApplicationStatusChange(application.id!, e.target.value)}
                            disabled={!application.id || updateApplicationStatusMutation.isPending}
                            className="text-xs px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed bg-white flex-1"
                            title="Change Application Status"
                          >
                            <option value="APPLIED">Applied</option>
                            <option value="REVIEWED">Reviewed</option>
                            <option value="SHORTLISTED">Shortlisted</option>
                            <option value="REJECTED">Rejected</option>
                            <option value="HIRED">Hired</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 sm:px-6 py-3 border-t border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
                    Showing {((applicationsPage - 1) * 20) + 1}-{Math.min(applicationsPage * 20, totalApplications)} of {totalApplications}
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
                    <span className="text-xs sm:text-sm text-gray-500">
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
            )}
          </>
        )}
      </div>
    </div>
  );
}
