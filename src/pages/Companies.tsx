import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../components/ui/table";
import { companyService } from "../services/companyService";
import { Company } from "../services/types";
import api from "../utils/axios";

export default function Companies() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("Name");
  const [orderType, setOrderType] = useState("asc");
  const [orderStatus, setOrderStatus] = useState("All");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCompanyLoading, setIsCompanyLoading] = useState(false);
  const [companyLoadError, setCompanyLoadError] = useState<string | null>(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when order status or order type changes
  useEffect(() => {
    setCurrentPage(1);
  }, [orderStatus, orderType]);

  // Fetch companies from API
  const { data: companiesResponse, isLoading, error, refetch } = useQuery({
    queryKey: ['companies', debouncedSearchTerm, currentPage, orderStatus, orderType],
    queryFn: async () => {
      console.log('Making API call with orderStatus:', orderStatus, 'orderType:', orderType);
      console.log('orderStatus type:', typeof orderStatus);
      console.log('orderStatus === "Active":', orderStatus === "Active");
      console.log('orderStatus === "inactive":', orderStatus === "inactive");
      
      // Use specific endpoints based on order status
      let result;
      if (orderStatus === "Active") {
        console.log('Calling API for ACTIVE companies');
        result = await companyService.getActiveCompanies({
          search: debouncedSearchTerm || undefined,
          page: currentPage,
          limit: 10,
          sortBy: 'name',
          sortOrder: orderType
        });
      } else if (orderStatus === "inactive") {
        console.log('Calling API for INACTIVE companies');
        result = await companyService.getInactiveCompanies({
          search: debouncedSearchTerm || undefined,
          page: currentPage,
          limit: 10,
          sortBy: 'name',
          sortOrder: orderType
        });
      } else {
        console.log('Calling API for ALL companies');
        result = await companyService.getCompanies({
          search: debouncedSearchTerm || undefined,
          page: currentPage,
          limit: 10,
          sortBy: 'name',
          sortOrder: orderType
        });
      }
      
      console.log('API Response:', result);
      console.log('API Response Data:', result?.data);
      console.log('Number of companies returned:', result?.data?.length);
      
      return result;
    },
  });

  // Mutation for updating company status
  const updateCompanyStatusMutation = useMutation({
    mutationFn: async ({ companyId, isActive }: { companyId: string; isActive: boolean }) => {
      const response = await api.put(`/companies/${companyId}/status`, { isActive });
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success(`Company ${variables.isActive ? 'activated' : 'deactivated'} successfully`);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to update company status';
      toast.error(errorMessage);
      console.error('Error updating company status:', error);
    },
  });

  // Debug logging
  console.log('Companies Response:', companiesResponse);
  console.log('Companies Loading:', isLoading);
  console.log('Companies Error:', error);

  // Handle error
  if (error) {
    const errorMessage = (error as any).response?.data?.message || "Failed to fetch companies";
    toast.error(errorMessage);
    console.error("Error fetching companies:", error);
  }

  // Use the companies directly from API response
  const companies = companiesResponse?.data || [];
  
  console.log('Order Status:', orderStatus);
  console.log('Companies from API:', companies);
  console.log('Company details:', companies.map(c => ({ 
    id: c.id, 
    name: c.name, 
    isActive: c.isActive,
    isVerified: c.isVerified
  })));
  
  const totalCompanies = companies.length;
  const totalPages = Math.ceil(totalCompanies / 10);
  const currentPageFromAPI = companiesResponse?.page || 1;

  const handleEdit = (company: Company) => {
    navigate(`/edit-company/${company.id}`);
  };

  const handleDelete = (company: Company) => {
    if (window.confirm(`Are you sure you want to delete ${company.name}?`)) {
      // TODO: Implement delete functionality
      toast.success(`Company ${company.name} deleted successfully`);
    }
  };

  const handleRefresh = async () => {
    console.log("Refresh Companies data - using GET /companies");
    try {
      // Force refresh using the general companies endpoint
      const result = await companyService.getCompanies({
        search: debouncedSearchTerm || undefined,
        page: currentPage,
        limit: 10,
        sortBy: 'name',
        sortOrder: orderType
      });
      console.log('Refresh API Response:', result);
      // Invalidate and refetch the query to update the UI
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    } catch (error) {
      console.error('Error refreshing companies:', error);
      toast.error('Failed to refresh companies data');
    }
  };

  const handleToggleStatus = (company: Company) => {
    updateCompanyStatusMutation.mutate({
      companyId: company.id,
      isActive: !company.isActive
    });
  };

  const handleView = async (company: Company) => {
    setIsViewModalOpen(true);
    setIsCompanyLoading(true);
    setCompanyLoadError(null);
    try {
      const response = await companyService.getCompanyById(String(company.id));
      const resp: any = response;
      const detailed: Company = resp?.data || resp?.company || resp;
      setSelectedCompany(detailed || company);
    } catch (e: any) {
      console.error('Error loading company details:', e);
      setCompanyLoadError(e?.message || 'Failed to load company details');
      setSelectedCompany(company);
    } finally {
      setIsCompanyLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setSelectedCompany(null);
  };


  return (
    <>
      <PageMeta
        title="Companies | Spearwin Admin Dashboard"
        description="Manage companies in the Spearwin admin dashboard"
      />
      
      {/* Title Bar */}
      <div className="px-4 sm:px-6 lg:px-30 ">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
          <PageBreadcrumb 
            items={[
              { label: "Dashboard", path: "/" },
              { label: "Companies" }
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
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Filter By</span>
                </div>

                {/* <div className="relative">
                  <select 
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className="appearance-none rounded-[20px] px-4 py-2 pr-8 text-sm bg-white/30 border border-white/40 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
                  >
                    <option>Name</option>
                    <option>Industry</option>
                    <option>Website</option>
                    <option>Status</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div> */}

                <div className="relative">
                  <select 
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value)}
                    className="appearance-none rounded-[20px] px-4 py-2 pr-8 text-sm bg-white/30 border border-white/40 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
                  >
                    <option value="asc">Ascending (A-Z)</option>
                    <option value="desc">Descending (Z-A)</option>
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
                    <option value="All">All Companies</option>
                    <option value="Active">Active</option>
                    <option value="inactive">Inactive</option>
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
                onClick={() => navigate("/add-company")}
                className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Add Company
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table className="w-full min-w-[700px]">
              <TableHeader>
                <TableRow className="bg-blue-50 mx-4">
                  <TableCell isHeader className="rounded-l-[20px] pl-6 pr-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Company</TableCell>
                  <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Industry</TableCell>
                  <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Website</TableCell>
                  <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Status</TableCell>
                  <TableCell isHeader className="rounded-r-[20px] pl-3 pr-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Action</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-900"></div>
                        <span className="ml-2 text-gray-600">Loading companies...</span>
                      </div>
                    </td>
                  </tr>
                ) : companies.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      {searchTerm ? 'No companies found matching your search' : 'No companies found'}
                    </td>
                  </tr>
                ) : (
                  companies.map((company: Company) => (
                    <tr key={company.id} className="hover:bg-gray-50">
                      <td className="pl-6 pr-3 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {company.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{company.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">{company.industry}</td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">{company.website || 'N/A'}</td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          company.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {company.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="pl-3 pr-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-3">
                          <button className="p-1 text-green-600 hover:text-green-800" onClick={() => handleView(company)} title="View Company">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button className="p-1 text-blue-600 hover:text-blue-800" onClick={() => handleEdit(company)}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          
                          {/* Toggle Switch */}
                          <div className="flex items-center">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={company.isActive}
                                onChange={() => handleToggleStatus(company)}
                                disabled={updateCompanyStatusMutation.isPending}
                              />
                              <div className={`relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 ${updateCompanyStatusMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
                              <span className="ml-2 text-xs font-medium text-gray-700">
                                {company.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </label>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {companies.length > 0 ? ((currentPage - 1) * 10) + 1 : 0}-{Math.min(currentPage * 10, totalCompanies)} of {totalCompanies}
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1 || isLoading}
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
                  disabled={currentPage === totalPages || isLoading}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

      {/* View Company Modal */}
      {isViewModalOpen && selectedCompany && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={handleCloseModal}
            ></div>
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Company Details</h3>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6 space-y-6">
                {isCompanyLoading && (
                  <div className="flex items-center justify-center py-10 text-gray-600">
                    <svg className="animate-spin h-5 w-5 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading company details...
                  </div>
                )}
                {companyLoadError && !isCompanyLoading && (
                  <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded">
                    {companyLoadError}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-900 leading-relaxed">{selectedCompany?.name || '—'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">{selectedCompany?.industry || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">{selectedCompany?.website || 'N/A'}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${selectedCompany?.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {selectedCompany?.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Verified</label>
                    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${selectedCompany?.isVerified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {selectedCompany?.isVerified ? 'Verified' : 'Not Verified'}
                    </span>
                  </div>
                </div>
                {/* More details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">{selectedCompany?.slug || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Founded Year</label>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">{selectedCompany?.foundedYear ?? 'N/A'}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employees</label>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">{selectedCompany?.employeeCount || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Headquarters</label>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">{selectedCompany?.headquarters || 'N/A'}</div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">{selectedCompany?.address || 'N/A'}</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">{selectedCompany?.linkedinUrl || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">{selectedCompany?.twitterUrl || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">{selectedCompany?.facebookUrl || 'N/A'}</div>
                  </div>
                </div>
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
