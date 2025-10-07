import { useState } from "react";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";

// Dropdown Input Component
const DropdownInput = ({ 
  placeholder, 
  value, 
  onChange 
}: { 
  placeholder: string; 
  value: string; 
  onChange: (value: string) => void; 
}) => {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default function CVSearch() {
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

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    setIsSearching(true);
    // Simulate search API call
    setTimeout(() => {
      // Sample search results
      const results = [
        {
          id: 1,
          candidateName: "John Doe",
          email: "john.doe@email.com",
          currentCompany: "Tech Corp",
          experience: "5 years",
          skills: ["React", "Node.js", "JavaScript"],
          location: "New York",
          salary: "$80,000",
          noticePeriod: "2 weeks"
        },
        {
          id: 2,
          candidateName: "Jane Smith",
          email: "jane.smith@email.com",
          currentCompany: "Design Studio",
          experience: "3 years",
          skills: ["UI/UX", "Figma", "Adobe Creative Suite"],
          location: "San Francisco",
          salary: "$75,000",
          noticePeriod: "1 month"
        }
      ];
      setSearchResults(results);
      setIsSearching(false);
    }, 1000);
  };

  const clearSearch = () => {
    setSearchData({
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
    setSearchResults([]);
  };

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
                <DropdownInput
                  placeholder="Company"
                  value={searchData.company}
                  onChange={(value) => handleInputChange("company", value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Code
                </label>
                <DropdownInput
                  placeholder="Job Code"
                  value={searchData.jobCode}
                  onChange={(value) => handleInputChange("jobCode", value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Candidate Name
                </label>
                <DropdownInput
                  placeholder="Candidate Name"
                  value={searchData.candidateName}
                  onChange={(value) => handleInputChange("candidateName", value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <DropdownInput
                  placeholder="Email"
                  value={searchData.email}
                  onChange={(value) => handleInputChange("email", value)}
                />
              </div>

              {/* Row 2 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Skill
                </label>
                <DropdownInput
                  placeholder="Select Skill"
                  value={searchData.selectSkill}
                  onChange={(value) => handleInputChange("selectSkill", value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Candidate CV
                </label>
                <DropdownInput
                  placeholder="Candidate CV"
                  value={searchData.candidateCV}
                  onChange={(value) => handleInputChange("candidateCV", value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience
                </label>
                <DropdownInput
                  placeholder="Experience"
                  value={searchData.experience}
                  onChange={(value) => handleInputChange("experience", value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary
                </label>
                <DropdownInput
                  placeholder="Salary"
                  value={searchData.salary}
                  onChange={(value) => handleInputChange("salary", value)}
                />
              </div>

              {/* Row 3 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Company
                </label>
                <DropdownInput
                  placeholder="Current Company"
                  value={searchData.currentCompany}
                  onChange={(value) => handleInputChange("currentCompany", value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Location
                </label>
                <DropdownInput
                  placeholder="Current Location"
                  value={searchData.currentLocation}
                  onChange={(value) => handleInputChange("currentLocation", value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notice Period
                </label>
                <DropdownInput
                  placeholder="Notice Period"
                  value={searchData.noticePeriod}
                  onChange={(value) => handleInputChange("noticePeriod", value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Type
                </label>
                <DropdownInput
                  placeholder="Profile Type"
                  value={searchData.profileType}
                  onChange={(value) => handleInputChange("profileType", value)}
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="flex justify-center mb-6">
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="bg-blue-900 hover:bg-blue-800 disabled:bg-blue-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
              >
                {isSearching ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </>
                ) : (
                  "Search"
                )}
              </button>
            </div>

            {/* Search Results Area */}
            <div className="border-t border-gray-200 pt-6">
              {searchResults.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Search Results ({searchResults.length})
                  </h3>
                  {searchResults.map((result) => (
                    <div key={result.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <span className="text-sm font-medium text-gray-500">Name:</span>
                          <p className="text-sm text-gray-900">{result.candidateName}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Email:</span>
                          <p className="text-sm text-gray-900">{result.email}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Company:</span>
                          <p className="text-sm text-gray-900">{result.currentCompany}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Experience:</span>
                          <p className="text-sm text-gray-900">{result.experience}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Location:</span>
                          <p className="text-sm text-gray-900">{result.location}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Salary:</span>
                          <p className="text-sm text-gray-900">{result.salary}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Notice Period:</span>
                          <p className="text-sm text-gray-900">{result.noticePeriod}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Skills:</span>
                          <p className="text-sm text-gray-900">{result.skills.join(", ")}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No search results</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Enter search criteria and click "Search" to find CVs.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
