import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../components/ui/table";
import { userService } from "../services/userService";
import { User } from "../services/types";

export default function UserProfilesManagement() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("Name");
  const [orderType, setOrderType] = useState("asc");
  const [orderStatus, setOrderStatus] = useState("All");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [userLoadError, setUserLoadError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when order status, order type, or search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [orderStatus, orderType, debouncedSearchTerm]);

  // Fetch users from API based on order status
  const { data: allUsers = [], isLoading, error, refetch } = useQuery({
    queryKey: ['users', orderStatus, orderType],
    queryFn: async () => {
      console.log('🔍 UserProfilesManagement - Making API call with orderStatus:', orderStatus, 'orderType:', orderType);
      
      let result;
      if (orderStatus === "Active") {
        console.log('Calling API for ACTIVE users');
        result = await userService.getActiveUsers('createdAt', orderType);
      } else if (orderStatus === "Pending") {
        console.log('Calling API for PENDING users');
        result = await userService.getPendingUsers('email', orderType);
      } else if (orderStatus === "Inactive") {
        console.log('Calling API for INACTIVE users');
        result = await userService.getInactiveUsers('lastLoginAt', orderType);
      } else {
        console.log('Calling API for ALL users');
        result = await userService.getAllUsers();
      }
      
      console.log('🔍 UserProfilesManagement - API Response:', result);
      console.log('🔍 UserProfilesManagement - Number of users returned:', result?.length || 0);
      
      return result;
    },
  });

  // Client-side filtering and search
  const filteredUsers = allUsers.filter((user: User) => {
    // Search filter
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      const matchesSearch = 
        user.email.toLowerCase().includes(searchLower) ||
        (user.candidate?.firstName && user.candidate.firstName.toLowerCase().includes(searchLower)) ||
        (user.candidate?.lastName && user.candidate.lastName.toLowerCase().includes(searchLower)) ||
        (user.phone && user.phone.includes(searchLower));
      
      if (!matchesSearch) return false;
    }
    
    return true;
  });

  // Pagination
  const profilesPerPage = 10;
  const totalProfiles = filteredUsers.length;
  const totalPages = Math.ceil(totalProfiles / profilesPerPage);
  const startIndex = (currentPage - 1) * profilesPerPage;
  const endIndex = startIndex + profilesPerPage;
  const users = filteredUsers.slice(startIndex, endIndex);
  
  // Toggle ACTIVE/INACTIVE status
  const updateUserStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: User['status'] }) => userService.updateUserStatus(id, status),
    onSuccess: () => {
      refetch();
    },
  });

  // Debug logging
  console.log('All users from API:', allUsers);
  console.log('Filtered users:', filteredUsers);
  console.log('Paginated users:', users);
  console.log('Users length:', users.length);
  console.log('Total profiles:', totalProfiles);
  console.log('Total pages:', totalPages);
  console.log('Current page:', currentPage);
  console.log('Search term:', debouncedSearchTerm);
  console.log('Is loading:', isLoading);
  console.log('Error:', error);

  // no external filter config; we render inline controls to match layout

  const handleEdit = (user: User) => {
    console.log("Edit user:", user);
    // Navigate to edit page or open modal
    navigate(`/edit-profile/${user.id}`);
  };

  const handleDelete = (user: User) => {
    console.log("Delete user:", user);
    // Show confirmation modal or delete directly
    if (window.confirm(`Are you sure you want to delete user ${user.email}?`)) {
      // Handle delete logic here
      console.log("User deleted:", user.id);
    }
  };

  const handleView = async (user: User) => {
    setIsViewModalOpen(true);
    setIsUserLoading(true);
    setUserLoadError(null);
    try {
      const detailed = await userService.getUserById(String(user.id));
      setSelectedUser(detailed || user);
    } catch (e: any) {
      console.error('Error loading user details:', e);
      setUserLoadError(e?.message || 'Failed to load user details');
      setSelectedUser(user);
    } finally {
      setIsUserLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setSelectedUser(null);
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
  if (error) {
    const errorMessage = (error as any).response?.data?.message || "Failed to fetch users";
    console.error("Error fetching users:", error);
  }

  const handleRefresh = async () => {
    console.log("Refresh profiles data - using specific API endpoints");
    try {
      // Force refresh using the appropriate endpoint based on current order status
      let result;
      if (orderStatus === "Active") {
        console.log('Refreshing ACTIVE users');
        result = await userService.getActiveUsers('createdAt', orderType);
      } else if (orderStatus === "Pending") {
        console.log('Refreshing PENDING users');
        result = await userService.getPendingUsers('email', orderType);
      } else if (orderStatus === "Inactive") {
        console.log('Refreshing INACTIVE users');
        result = await userService.getInactiveUsers('lastLoginAt', orderType);
      } else {
        console.log('Refreshing ALL users');
        result = await userService.getAllUsers();
      }
      
      console.log('Refresh API Response:', result);
      // Invalidate and refetch the query to update the UI
      refetch();
    } catch (error) {
      console.error('Error refreshing users:', error);
    }
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
                    placeholder="Search users..."
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
                    <option>Location</option>
                    <option>Email</option>
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
                    <option value="All">All Users</option>
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Inactive">Inactive</option>
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
                        <div className="flex items-center gap-2">
                          <button className="p-1 text-green-600 hover:text-green-800" onClick={() => handleView(user)} title="View user">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button className="p-1 text-blue-600 hover:text-blue-800" onClick={() => handleEdit(user)}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button className="p-1 text-red-600 hover:text-red-800" onClick={() => handleDelete(user)}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                          {/* Toggle Active (after Delete) */}
                          <label className="relative inline-flex items-center cursor-pointer ml-1" title="Toggle Active">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={user.status === 'ACTIVE'}
                              onChange={() => updateUserStatusMutation.mutate({ id: String(user.id), status: user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' })}
                            />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
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
                Showing {startIndex + 1}-{Math.min(endIndex, totalProfiles)} of {totalProfiles}
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

      {/* View User Modal */}
      {isViewModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={handleCloseModal}
            ></div>
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">User Details</h3>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6 space-y-6">
                {isUserLoading && (
                  <div className="flex items-center justify-center py-10 text-gray-600">
                    <svg className="animate-spin h-5 w-5 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading user details...
                  </div>
                )}
                {userLoadError && !isUserLoading && (
                  <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded">
                    {userLoadError}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-900 leading-relaxed">{selectedUser?.email || '—'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">{selectedUser?.phone || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">{selectedUser?.role || '—'}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Verified</label>
                    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${selectedUser?.emailVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {selectedUser?.emailVerified ? 'Verified' : 'Not Verified'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                      selectedUser?.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      selectedUser?.status === 'PENDING_VERIFICATION' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedUser ? getStatusDisplay(selectedUser.status) : '—'}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Login</label>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">{selectedUser?.lastLoginAt ? new Date(selectedUser.lastLoginAt).toLocaleString() : '—'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Created</label>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">{selectedUser?.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : '—'}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">{selectedUser?.candidate?.firstName || '—'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">{selectedUser?.candidate?.lastName || '—'}</div>
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
