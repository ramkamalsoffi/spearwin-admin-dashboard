import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../components/ui/table";
import StatusBadge from "../components/ui/status-badge/StatusBadge";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../components/ui/table";
import StatusBadge from "../components/ui/status-badge/StatusBadge";
import { countryService } from "../services/countryService";
import { useCountryMutations } from "../hooks/useCountryMutations";
import { useCountryMutations } from "../hooks/useCountryMutations";
import { Country } from "../services/types";

export default function Countries() {
  const navigate = useNavigate();
  const { deleteCountryMutation } = useCountryMutations();
  const { deleteCountryMutation } = useCountryMutations();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterBy, setFilterBy] = useState("Region");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [orderBy, setOrderBy] = useState("name");
  const [orderDirection, setOrderDirection] = useState("asc");
  const [filterBy, setFilterBy] = useState("Region");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [orderBy, setOrderBy] = useState("name");
  const [orderDirection, setOrderDirection] = useState("asc");

  // Fetch countries from API
  const { data: countriesResponse, isLoading, error, refetch } = useQuery({
    queryKey: ['countries'],
    queryFn: () => countryService.getCountries(),
  });

  // Handle error
  if (error) {
    const errorMessage = (error as any).response?.data?.message || "Failed to fetch countries";
    toast.error(errorMessage);
    console.error("Error fetching countries:", error);
  }

  // Debug: Log the response structure
  console.log("Countries Response:", countriesResponse);
  console.log("Countries Data:", countriesResponse?.data);

  // Handle different response structures
  let countries: Country[] = [];
  
  // Check if response is directly an array
  if (Array.isArray(countriesResponse)) {
    countries = countriesResponse;
  }
  // Check if response has data property
  else if (countriesResponse?.data) {
    // If data is an array, use it directly
    if (Array.isArray(countriesResponse.data)) {
      countries = countriesResponse.data;
    }
    // If data has a nested array (e.g., { data: { countries: [...] } })
    else if ((countriesResponse.data as any).countries && Array.isArray((countriesResponse.data as any).countries)) {
      countries = (countriesResponse.data as any).countries;
    }
    // If data has a results array
    else if ((countriesResponse.data as any).results && Array.isArray((countriesResponse.data as any).results)) {
      countries = (countriesResponse.data as any).results;
    }
  }

  console.log("Processed Countries:", countries);
  console.log("Countries Length:", countries.length);

  // If no countries found, show some sample data for testing
  if (countries.length === 0 && !isLoading && !error) {
    console.log("No countries found, showing sample data");
    countries = [
      {
        id: 1,
        name: "United States",
        iso2: "US",
        iso3: "USA",
        region: "North America",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        numeric_code: "840",
        phonecode: "+1",
        capital: "Washington D.C.",
        currency: "USD",
        currency_name: "US Dollar",
        currency_symbol: "$",
        tld: ".us",
        native: "United States",
        region_id: 1,
        subregion: "Northern America",
        subregion_id: 1,
        nationality: "American",
        latitude: "39.8283",
        longitude: "-98.5795"
      },
      {
        id: 2,
        name: "Canada",
        iso2: "CA",
        iso3: "CAN",
        region: "North America",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        numeric_code: "124",
        phonecode: "+1",
        capital: "Ottawa",
        currency: "CAD",
        currency_name: "Canadian Dollar",
        currency_symbol: "C$",
        tld: ".ca",
        native: "Canada",
        region_id: 1,
        subregion: "Northern America",
        subregion_id: 1,
        nationality: "Canadian",
        latitude: "56.1304",
        longitude: "-106.3468"
      }
    ];
  }

  // Get unique regions for filtering
  const uniqueRegions = [...new Set(countries.map(country => country.region))].filter(Boolean);

  // Filter and sort countries
  const filteredCountries = countries.filter(country => {
    if (selectedRegion && country.region !== selectedRegion) return false;
    return true;
  }).sort((a, b) => {
    const aValue = a[orderBy as keyof Country];
    const bValue = b[orderBy as keyof Country];

    if (orderDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const totalCountries = filteredCountries.length;
  const countriesPerPage = 10;
  const totalPages = Math.ceil(totalCountries / countriesPerPage);

  const handleEdit = (country: Country) => {
    navigate(`/edit-country/${country.id}`);
  };

  const handleDelete = (country: Country) => {
    if (window.confirm(`Are you sure you want to delete ${country.name}?`)) {
      deleteCountryMutation.mutate(country.id);
      deleteCountryMutation.mutate(country.id);
    }
  };

  const handleRefresh = () => {
    console.log("Refresh Countries data");
    refetch();
  };

  return (
    <>
      <PageMeta
        title="Countries | spearwin-admin"
        description="Manage Countries"
      />
      
      {/* Title Bar */}
      <div className="px-4 sm:px-6 lg:px-30 ">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
          <PageBreadcrumb 
            items={[
              { label: "Dashboard", path: "/" },
              { label: "Countries" }
            ]}
            showAdmin={true}
        title="Countries | spearwin-admin"
        description="Manage Countries"
      />
      
      {/* Title Bar */}
      <div className="px-4 sm:px-6 lg:px-30 ">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
          <PageBreadcrumb 
            items={[
              { label: "Dashboard", path: "/" },
              { label: "Countries" }
            ]}
            showAdmin={true}
            />
          </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-30 py-4">
        <div className="bg-white rounded-[10px] shadow-sm border border-gray-200">
          <div className="px-6 py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Filter By</span>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  {/* Region Filter */}
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Filter By Region</span>
                  </div>

                  <div className="relative">
                    <select
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      className="appearance-none rounded-[20px] px-4 py-2 pr-8 text-sm bg-white/30 border border-white/40 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer min-w-[150px]"
                    >
                      <option value="">All Regions</option>
                      {uniqueRegions.map(region => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Sort By */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Sort By</span>
                  </div>

                  <div className="relative">
                    <select
                      value={orderBy}
                      onChange={(e) => setOrderBy(e.target.value)}
                      className="appearance-none rounded-[20px] px-4 py-2 pr-8 text-sm bg-white/30 border border-white/40 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
                    >
                      <option value="name">Name</option>
                      <option value="iso2">ISO2 Code</option>
                      <option value="region">Region</option>
                      <option value="createdAt">Created Date</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  <div className="relative">
                    <select
                      value={orderDirection}
                      onChange={(e) => setOrderDirection(e.target.value)}
                      className="appearance-none rounded-[20px] px-4 py-2 pr-8 text-sm bg-white/30 border border-white/40 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
                    >
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <button className="p-2 text-gray-400 hover:text-gray-600" onClick={handleRefresh}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-30 py-4">
        <div className="bg-white rounded-[10px] shadow-sm border border-gray-200">
          <div className="px-6 py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Filter By</span>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  {/* Region Filter */}
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Filter By Region</span>
                  </div>

                  <div className="relative">
                    <select
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      className="appearance-none rounded-[20px] px-4 py-2 pr-8 text-sm bg-white/30 border border-white/40 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer min-w-[150px]"
                    >
                      <option value="">All Regions</option>
                      {uniqueRegions.map(region => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Sort By */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Sort By</span>
                  </div>

                  <div className="relative">
                    <select
                      value={orderBy}
                      onChange={(e) => setOrderBy(e.target.value)}
                      className="appearance-none rounded-[20px] px-4 py-2 pr-8 text-sm bg-white/30 border border-white/40 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
                    >
                      <option value="name">Name</option>
                      <option value="iso2">ISO2 Code</option>
                      <option value="region">Region</option>
                      <option value="createdAt">Created Date</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  <div className="relative">
                    <select
                      value={orderDirection}
                      onChange={(e) => setOrderDirection(e.target.value)}
                      className="appearance-none rounded-[20px] px-4 py-2 pr-8 text-sm bg-white/30 border border-white/40 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
                    >
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <button className="p-2 text-gray-400 hover:text-gray-600" onClick={handleRefresh}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
            </button>
              </div>

              </div>

            <button
                onClick={() => navigate("/add-country")}
                className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                onClick={() => navigate("/add-country")}
                className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Add Country
            </button>
          </div>
        </div>

          <div className="overflow-x-auto">
          <div className="overflow-x-auto">
          {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-gray-600">Loading countries...</span>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Failed to load countries</h3>
                  <p className="mt-1 text-sm text-gray-500">Please try refreshing the page</p>
                </div>
              </div>
            ) : filteredCountries.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No countries found</h3>
                  <p className="mt-1 text-sm text-gray-500">This region doesn't have any countries yet.</p>
                </div>
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-gray-600">Loading countries...</span>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Failed to load countries</h3>
                  <p className="mt-1 text-sm text-gray-500">Please try refreshing the page</p>
                </div>
              </div>
            ) : filteredCountries.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No countries found</h3>
                  <p className="mt-1 text-sm text-gray-500">This region doesn't have any countries yet.</p>
                </div>
            </div>
            ) : (
              <Table className="w-full min-w-[700px]">
                <TableHeader>
                  <TableRow className="bg-blue-50 mx-4">
                    <TableCell isHeader className="rounded-l-[20px] pl-6 pr-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Name</TableCell>
                    <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Code</TableCell>
                    <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Region</TableCell>
                    <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Status</TableCell>
                    <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Created</TableCell>
                    <TableCell isHeader className="rounded-r-[20px] pl-3 pr-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Action</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white divide-y divide-gray-200">
                  {(() => {
                    console.log("Rendering countries:", filteredCountries.slice((currentPage - 1) * countriesPerPage, currentPage * countriesPerPage));
                    return null;
                  })()}
                  {filteredCountries
                    .slice((currentPage - 1) * countriesPerPage, currentPage * countriesPerPage)
                    .map((country: Country) => {
                      console.log("Rendering country:", country);
                      return (
            ) : (
              <Table className="w-full min-w-[700px]">
                <TableHeader>
                  <TableRow className="bg-blue-50 mx-4">
                    <TableCell isHeader className="rounded-l-[20px] pl-6 pr-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Name</TableCell>
                    <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Code</TableCell>
                    <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Region</TableCell>
                    <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Status</TableCell>
                    <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Created</TableCell>
                    <TableCell isHeader className="rounded-r-[20px] pl-3 pr-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Action</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white divide-y divide-gray-200">
                  {(() => {
                    console.log("Rendering countries:", filteredCountries.slice((currentPage - 1) * countriesPerPage, currentPage * countriesPerPage));
                    return null;
                  })()}
                  {filteredCountries
                    .slice((currentPage - 1) * countriesPerPage, currentPage * countriesPerPage)
                    .map((country: Country) => {
                      console.log("Rendering country:", country);
                      return (
                        <tr key={country.id} className="hover:bg-gray-50">
                          <td className="pl-6 pr-3 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">{country.name}</td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">{country.iso2}</td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">{country.region}</td>
                          <td className="px-3 py-3 whitespace-nowrap">
                            <StatusBadge status={country.isActive ? "active" : "inactive"} />
                          <td className="pl-6 pr-3 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">{country.name}</td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">{country.iso2}</td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">{country.region}</td>
                          <td className="px-3 py-3 whitespace-nowrap">
                            <StatusBadge status={country.isActive ? "active" : "inactive"} />
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                            {new Date(country.createdAt).toLocaleDateString()}
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                            {new Date(country.createdAt).toLocaleDateString()}
                          </td>
                          <td className="pl-3 pr-6 py-3 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                              <button className="p-1 text-blue-600 hover:text-blue-800" onClick={() => handleEdit(country)}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button className="p-1 text-red-600 hover:text-red-800" onClick={() => handleDelete(country)}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          <td className="pl-3 pr-6 py-3 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                              <button className="p-1 text-blue-600 hover:text-blue-800" onClick={() => handleEdit(country)}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button className="p-1 text-red-600 hover:text-red-800" onClick={() => handleDelete(country)}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </TableBody>
              </Table>
            )}
                      );
                    })}
                </TableBody>
              </Table>
            )}
            </div>

          {/* Pagination */}
          {!isLoading && !error && countries.length > 0 && (
            <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {((currentPage - 1) * countriesPerPage) + 1}-{Math.min(currentPage * countriesPerPage, totalCountries)} of {totalCountries}
          {!isLoading && !error && countries.length > 0 && (
            <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {((currentPage - 1) * countriesPerPage) + 1}-{Math.min(currentPage * countriesPerPage, totalCountries)} of {totalCountries}
                </div>
                <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                    <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    </button>
                    <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
