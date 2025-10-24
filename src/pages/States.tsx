import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../components/ui/table";
import StatusBadge from "../components/ui/status-badge/StatusBadge";
import { statesService, countryService } from "../services";
import { useStateMutations } from "../hooks/useStateMutations";
import { State } from "../services/types";

export default function States() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { deleteStateMutation } = useStateMutations();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterBy, setFilterBy] = useState("Region");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [orderBy, setOrderBy] = useState("name");
  const [orderDirection, setOrderDirection] = useState("asc");
  const [statesPerPage, setStatesPerPage] = useState(10);
  const [isRefreshing, setIsRefreshing] = useState(false);


  // Fetch countries for filter
  const { data: countriesResponse, isLoading: countriesLoading } = useQuery({
    queryKey: ['countries'],
    queryFn: () => countryService.getCountries(),
  });

  // Fetch states - either all states or filtered by country
  const { data: statesResponse, isLoading: statesLoading, error: statesError, refetch: refetchStates } = useQuery({
    queryKey: ['states', selectedCountry],
    queryFn: () => selectedCountry 
      ? statesService.getStatesByCountryId(selectedCountry)
      : statesService.getStates(),
  });

  // Handle errors
  if (statesError) {
    const errorMessage = (statesError as any).response?.data?.message || "Failed to fetch states";
    toast.error(errorMessage);
    console.error("Error fetching states:", statesError);
  }

  const countries = Array.isArray(countriesResponse)
    ? (countriesResponse as unknown as any[])
    : (countriesResponse?.data || []);

  const states: State[] = Array.isArray(statesResponse)
    ? (statesResponse as unknown as State[])
    : (statesResponse?.data || []);

    console.log("States:", states);
    

  // Extract states array from response
  const statesArray: State[] = Array.isArray(states) 
    ? states 
    : (states as any)?.states || (states as any)?.data || [];

  // Filter and sort states
  const filteredStates = statesArray.filter(state => {
    if (selectedCountry && state.countryId?.toString() !== selectedCountry) return false;
    return true;
  }).sort((a, b) => {
    const aValue = a[orderBy as keyof State];
    const bValue = b[orderBy as keyof State];

    if (orderDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const totalStates = filteredStates.length;
  const totalPages = Math.ceil(totalStates / statesPerPage);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Invalidate and refetch both states and countries queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['states'] }),
        queryClient.invalidateQueries({ queryKey: ['countries'] }),
        refetchStates()
      ]);
      toast.success("Data refreshed successfully!");
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Failed to refresh data. Please try again.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleEdit = (state: State) => {
    console.log("Edit State:", state);
    // Navigate to edit page or open modal
    navigate(`/edit-state/${state.id}`);
  };

  const handleDelete = (state: State) => {
    if (window.confirm(`Are you sure you want to delete ${state.name}?`)) {
      deleteStateMutation.mutate(state.id);
    }
  };


  return (
    <>
      <PageMeta
        title="States | spearwin-admin"
        description="Manage States"
      />
      
      {/* Title Bar */}
      <div className="px-4 sm:px-6 lg:px-30 ">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
          <PageBreadcrumb 
            items={[
              { label: "Dashboard", path: "/" },
              { label: "States" }
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
                  {/* Country Filter */}
                  

                  <div className="relative">
                    <select
                      value={selectedCountry}
                      onChange={(e) => {
                        setSelectedCountry(e.target.value);
                        setCurrentPage(1); // Reset to first page when changing country filter
                      }}
                      className="appearance-none rounded-[20px] px-4 py-2 pr-8 text-sm bg-white/30 border border-white/40 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer min-w-[150px]"
                    >
                      <option value="">All Countries</option>
                      {countries.map(country => (
                        <option key={country.id} value={country.id}>
                          {country.name}
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

                  {/* Rows per page */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Rows per page</span>
                  </div>

                  <div className="relative">
                    {/* <select
                      value={statesPerPage}
                      onChange={(e) => {
                        setStatesPerPage(Number(e.target.value));
                        setCurrentPage(1); // Reset to first page when changing rows per page
                      }}
                      className="appearance-none rounded-[20px] px-4 py-2 pr-8 text-sm bg-white/30 border border-white/40 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select> */}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <button 
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50" 
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  title="Refresh data"
                >
                  <svg 
                    className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>

            <button
                onClick={() => navigate("/add-states")}
                className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Add States
            </button>
          </div>
        </div>

          <div className="overflow-x-auto">
            {statesLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-gray-600">Loading states...</span>
                </div>
              </div>
            ) : statesError ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Failed to load states</h3>
                  <p className="mt-1 text-sm text-gray-500">Please try refreshing the page</p>
                </div>
              </div>
            ) : filteredStates.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No states found</h3>
                  <p className="mt-1 text-sm text-gray-500">This country doesn't have any states yet.</p>
                </div>
              </div>
            ) : (
              <Table className="w-full min-w-[700px]">
                <TableHeader>
                  <TableRow className="bg-blue-50 mx-4">
                    <TableCell isHeader className="rounded-l-[20px] pl-6 pr-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Name</TableCell>
                    <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Status</TableCell>
                    <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Created</TableCell>
                    <TableCell isHeader className="rounded-r-[20px] pl-3 pr-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Action</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white divide-y divide-gray-200">
                  {(() => {
                    console.log("Rendering states:", filteredStates.slice((currentPage - 1) * statesPerPage, currentPage * statesPerPage));
                    return null;
                  })()}
                  {filteredStates
                    .slice((currentPage - 1) * statesPerPage, currentPage * statesPerPage)
                    .map((state: State) => {
                      console.log("Rendering state:", state);
                      return (
                        <tr key={state.id} className="hover:bg-gray-50">
                          <td className="pl-6 pr-3 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">{state.name}</td>
                          <td className="px-3 py-3 whitespace-nowrap">
                            <StatusBadge status={state.isActive ? "active" : "inactive"} />
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                            {new Date(state.createdAt).toLocaleDateString()}
                          </td>
                          <td className="pl-3 pr-6 py-3 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                              <button className="p-1 text-blue-600 hover:text-blue-800" onClick={() => handleEdit(state)}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button className="p-1 text-red-600 hover:text-red-800" onClick={() => handleDelete(state)}>
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
          </div>

          {/* Pagination */}
          {!statesLoading && !statesError && filteredStates.length > 0 && (
            <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {((currentPage - 1) * statesPerPage) + 1}-{Math.min(currentPage * statesPerPage, filteredStates.length)} of {filteredStates.length}
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
        </div>
      </div>
    </>
  );
}
