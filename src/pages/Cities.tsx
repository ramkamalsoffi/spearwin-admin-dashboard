import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../components/ui/table";
import StatusBadge from "../components/ui/status-badge/StatusBadge";
import { citiesService, statesService } from "../services";
import { City } from "../services/types";

export default function Cities() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [orderStatus, setOrderStatus] = useState("Order Status");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const citiesPerPage = 10;

  // Fetch cities data
  const { data: citiesData, isLoading: citiesLoading, error: citiesError } = useQuery({
    queryKey: ['cities', selectedState],
    queryFn: () => selectedState ? citiesService.getCitiesByStateId(selectedState) : citiesService.getCities(),
  });

  // Fetch states for filter dropdown
  const { data: statesData } = useQuery({
    queryKey: ['states'],
    queryFn: () => statesService.getStates(),
  });

  // Delete city mutation
  const deleteCityMutation = useMutation({
    mutationFn: (cityId: string) => citiesService.deleteCity(cityId),
    onSuccess: () => {
      toast.success("City deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ['cities'] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to delete city";
      toast.error(errorMessage);
      console.error("Error deleting city:", error);
    },
  });

  // Filter and search cities
  const filteredCities = citiesData?.data?.filter((city: City) => {
    const matchesSearch = searchTerm === "" || 
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = orderStatus === "Order Status" || 
      (orderStatus === "Active" && city.isActive) ||
      (orderStatus === "Inactive" && !city.isActive);
    
    return matchesSearch && matchesStatus;
  }) || [];

  const totalCities = filteredCities.length;
  const totalPages = Math.ceil(totalCities / citiesPerPage);
  const startIndex = (currentPage - 1) * citiesPerPage;
  const endIndex = startIndex + citiesPerPage;
  const paginatedCities = filteredCities.slice(startIndex, endIndex);

  // filters will be rendered inline in the card header

  const handleEdit = (city: City) => {
    console.log("Edit City:", city);
    // Navigate to edit page or open modal
    navigate(`/edit-city/${city.id}`);
  };

  const handleDelete = (city: City) => {
    console.log("Delete City:", city);
    // Show confirmation modal or delete directly
    if (window.confirm(`Are you sure you want to delete ${city.name}?`)) {
      deleteCityMutation.mutate(city.id);
    }
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['cities'] });
    toast.success("Cities data refreshed!");
  };

  const handleStateFilter = (stateId: string) => {
    setSelectedState(stateId);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Get state name by ID
  const getStateName = (stateId: string) => {
    const state = statesData?.data?.find(s => s.id === stateId);
    return state?.name || "Unknown State";
  };

  // Loading state
  if (citiesLoading) {
    return (
      <>
        <PageMeta title="Cities | spearwin-admin" description="Manage Cities" />
        <div className="px-4 sm:px-6 lg:px-30 py-4">
          <div className="bg-white rounded-[10px] shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-500"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (citiesError) {
    return (
      <>
        <PageMeta title="Cities | spearwin-admin" description="Manage Cities" />
        <div className="px-4 sm:px-6 lg:px-30 py-4">
          <div className="bg-white rounded-[10px] shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col items-center justify-center py-12">
              <svg className="w-16 h-16 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load cities</h3>
              <p className="text-gray-500 mb-4">There was an error loading the cities data.</p>
              <button 
                onClick={handleRefresh}
                className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title="Cities | spearwin-admin"
        description="Manage Cities"
      />
      
      {/* Title Bar */}
      <div className="px-4 sm:px-6 lg:px-30 ">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
          <PageBreadcrumb 
            items={[
              { label: "Dashboard", path: "/" },
              { label: "Cities" }
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
              <div className="flex items-center gap-4">
                {/* Search Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search cities..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>

                {/* State Filter */}
                <div className="relative">
                  <select 
                    value={selectedState}
                    onChange={(e) => handleStateFilter(e.target.value)}
                    className="appearance-none rounded-[20px] px-4 py-2 pr-8 text-sm bg-white/30 border border-white/40 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
                  >
                    <option value="">All States</option>
                    {statesData?.data?.map((state) => (
                      <option key={state.id} value={state.id}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <select 
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value)}
                    className="appearance-none rounded-[20px] px-4 py-2 pr-8 text-sm bg-white/30 border border-white/40 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
                  >
                    <option>Order Status</option>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <button className="p-2 text-gray-400 hover:text-gray-600" onClick={handleRefresh}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>

              <button 
                onClick={() => navigate("/add-cities")}
                className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Add Cities
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table className="w-full min-w-[700px]">
              <TableHeader>
                <TableRow className="bg-blue-50 mx-4">
                  <TableCell isHeader className="rounded-l-[20px] pl-6 pr-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">City Name</TableCell>
                  <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Code</TableCell>
                  <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">State</TableCell>
                  <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Status</TableCell>
                  <TableCell isHeader className="rounded-r-[20px] pl-3 pr-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Action</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white divide-y divide-gray-200">
                {paginatedCities.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No cities found</h3>
                        <p className="text-gray-500 mb-4">
                          {searchTerm || selectedState 
                            ? "Try adjusting your search or filter criteria." 
                            : "Get started by adding your first city."
                          }
                        </p>
                        {!searchTerm && !selectedState && (
                          <button 
                            onClick={() => navigate("/add-cities")}
                            className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                          >
                            Add City
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedCities.map((city: City) => (
                    <tr key={city.id} className="hover:bg-gray-50">
                      <td className="pl-6 pr-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {city.name}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {city.code}
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                        {getStateName(city.stateId)}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <StatusBadge status={city.isActive ? "active" : "inactive"} />
                      </td>
                      <td className="pl-3 pr-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <button 
                            className="p-1 text-blue-600 hover:text-blue-800" 
                            onClick={() => handleEdit(city)}
                            title="Edit city"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            className="p-1 text-red-600 hover:text-red-800" 
                            onClick={() => handleDelete(city)}
                            title="Delete city"
                            disabled={deleteCityMutation.isPending}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalCities > 0 && (
            <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {startIndex + 1}-{Math.min(endIndex, totalCities)} of {totalCities}
                  {searchTerm && ` (filtered from ${citiesData?.data?.length || 0} total)`}
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
                  <span className="text-sm text-gray-500">
                    Page {currentPage} of {totalPages}
                  </span>
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
