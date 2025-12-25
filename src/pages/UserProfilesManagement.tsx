import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../components/ui/table";
import { userService } from "../services/userService";
import { User } from "../services/types";
import CandidateViewDialog from "../components/CandidateViewDialog";
import { useModal } from "../hooks/useModal";

export default function UserProfilesManagement() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [orderType, setOrderType] = useState<"asc" | "desc">("desc");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Modal state for candidate view dialog
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const viewModal = useModal();

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, orderType, debouncedSearchTerm, rowsPerPage]);

  // Build query parameters
  const queryParams = {
    page: currentPage,
    limit: rowsPerPage,
    sortBy: 'createdAt',
    sortOrder: orderType,
    ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
    ...(filterStatus && { 
      status: filterStatus as 'ACTIVE' | 'PENDING_VERIFICATION' | 'INACTIVE' | 'SUSPENDED' 
    }),
  };

  // Fetch users from API with server-side pagination and filters
  const { data: usersResponse, isLoading, error, refetch } = useQuery({
    queryKey: ['userProfiles', queryParams],
    queryFn: () => userService.getUserProfiles(queryParams),
  });

  const users = usersResponse?.users || [];
  const totalProfiles = usersResponse?.total || 0;
  const totalPages = usersResponse?.totalPages || 1;

  // Mutation for updating user status
  const updateUserStatusMutation = useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: User['status'] }) => {
      return userService.updateUserStatus(userId, status);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userProfiles'] });
      const statusMessages: Record<string, string> = {
        'ACTIVE': 'activated',
        'INACTIVE': 'deactivated',
        'PENDING_VERIFICATION': 'set to pending',
        'SUSPENDED': 'suspended'
      };
      toast.success(`User ${statusMessages[variables.status] || 'updated'} successfully`);
    },
    onError: (error: unknown) => {
      const errorMessage = (error as any).response?.data?.message || 'Failed to update user status';
      toast.error(errorMessage);
      console.error('Error updating user status:', error);
    },
  });

  const handleStatusChange = (user: User, newStatus: string) => {
    if (user.status === newStatus) return; // No change needed
    
    updateUserStatusMutation.mutate({
      userId: user.id,
      status: newStatus as User['status']
    });
  };

  const handleEdit = (user: User) => {
    const userId = String(user.id).trim();
    console.log('Edit clicked for user ID:', userId);
    navigate(`/edit-profile/${userId}`);
  };

  const handleViewCandidate = (user: User) => {
    setSelectedCandidateId(user.id);
    viewModal.openModal();
  };

  // Helper function to get status display
  const getStatusDisplay = (status: User['status']) => {
    switch (status) {
      case 'ACTIVE':
        return 'Active';
      case 'PENDING_VERIFICATION':
        return 'Pending';
      case 'INACTIVE':
        return 'Inactive';
      case 'SUSPENDED':
        return 'Suspended';
      default:
        return status;
    }
  };

  // Helper function to get status color
  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'PENDING_VERIFICATION':
        return 'bg-orange-100 text-orange-800';
      case 'INACTIVE':
        return 'bg-red-100 text-red-800';
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle error
  useEffect(() => {
    if (error) {
      const errorMessage = (error as any).response?.data?.message || "Failed to fetch users";
      toast.error(errorMessage);
      console.error("Error fetching users:", error);
    }
  }, [error]);

  const handleRefresh = () => {
    refetch();
    toast.success("Users data refreshed!");
  };

  return (
    <>
      <PageMeta
        title="User Profiles | spearwin-admin"
        description="Manage user profiles"
      />
      
      {/* Title Bar */}
      <div className="px-4 sm:px-6 lg:px-30 ">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
          <PageBreadcrumb 
            items={[
              { label: "Dashboard", path: "/" },
              { label: "User Profiles" }
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
              <div className="flex items-center gap-4 flex-1">
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search users by email, name, phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>

                {/* Order Type Dropdown */}
                <div className="relative">
                  <select 
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value as "asc" | "desc")}
                    className="appearance-none rounded-md px-4 py-2 pr-8 text-sm bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <div className="relative">
                  <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="appearance-none rounded-md px-4 py-2 pr-8 text-sm bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                  >
                    <option value="">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="PENDING_VERIFICATION">Pending</option>
                    <option value="INACTIVE">Inactive</option>
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
                onClick={() => navigate("/add-profile")}
                className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Add Profile
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table className="w-full min-w-[700px]">
              <TableHeader>
                <TableRow className="bg-blue-50 mx-4">
                  <TableCell isHeader className="rounded-l-[20px] pl-6 pr-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Email</TableCell>
                  <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Phone</TableCell>
                  <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Role</TableCell>
                  <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Email Verified</TableCell>
                  <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Status</TableCell>
                  <TableCell isHeader className="rounded-r-[20px] pl-3 pr-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Action</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-900"></div>
                        <span className="ml-2 text-gray-600">Loading users...</span>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      {searchTerm ? 'No users found matching your search' : 'No users found'}
                    </td>
                  </tr>
                ) : (
                  users.map((user: User) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="pl-6 pr-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{user.email}</td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">{user.phone || 'N/A'}</td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          user.role === 'ADMIN' 
                            ? 'bg-purple-100 text-purple-800' 
                            : user.role === 'EMPLOYER'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          user.emailVerified 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.emailVerified ? 'Verified' : 'Not Verified'}
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                          {getStatusDisplay(user.status)}
                        </span>
                      </td>
                      <td className="pl-3 pr-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-3">
                          {/* Eye button for candidates */}
                          {user.role === 'CANDIDATE' && (
                            <button 
                              className="p-1 text-blue-600 hover:text-blue-800" 
                              onClick={() => handleViewCandidate(user)}
                              title="View candidate details"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                          )}
                          
                          <button 
                            className="p-1 text-blue-600 hover:text-blue-800" 
                            onClick={() => handleEdit(user)}
                            title="Edit user"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          
                          {/* Status Dropdown */}
                          <div className="relative">
                            <select
                              value={user.status}
                              onChange={(e) => handleStatusChange(user, e.target.value)}
                              disabled={updateUserStatusMutation.isPending}
                              className={`appearance-none rounded-md px-3 py-1.5 pr-7 text-xs font-medium bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer ${
                                user.status === 'ACTIVE' 
                                  ? 'text-green-800 border-green-300' 
                                  : user.status === 'PENDING_VERIFICATION'
                                  ? 'text-orange-800 border-orange-300'
                                  : user.status === 'INACTIVE'
                                  ? 'text-red-800 border-red-300'
                                  : 'text-gray-800'
                              } ${updateUserStatusMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              <option value="ACTIVE">Active</option>
                              <option value="PENDING_VERIFICATION">Pending</option>
                              <option value="INACTIVE">Inactive</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-700">
                  Showing {((currentPage - 1) * rowsPerPage) + 1}-{Math.min(currentPage * rowsPerPage, totalProfiles)} of {totalProfiles}
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Rows per page:</span>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </span>
                <button 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1 || isLoading}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
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
        </div>
      </div>

      {/* Candidate View Dialog */}
      <CandidateViewDialog
        isOpen={viewModal.isOpen}
        onClose={() => {
          viewModal.closeModal();
          setSelectedCandidateId(null);
        }}
        userId={selectedCandidateId}
      />
    </>
  );
}
