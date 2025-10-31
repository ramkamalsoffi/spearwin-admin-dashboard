import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../components/ui/table";
import { useQuery } from "@tanstack/react-query";
import api from "../utils/axios";

export default function AdminUsers() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterBy, setFilterBy] = useState("Date");
  const [orderType, setOrderType] = useState("Order Type");
  const [orderStatus, setOrderStatus] = useState("Order Status");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch admin users data from API
  const { data: adminUsersResponse, isLoading, error } = useQuery({
    queryKey: ['adminUsers', currentPage, filterBy, orderType, orderStatus, searchTerm],
    queryFn: async () => {
      const response = await api.get('/api/admin/admins');
      return response.data;
    },
  });

  // Handle different response structures
  let adminUsers: any[] = [];
  
  // Check if response is directly an array
  if (Array.isArray(adminUsersResponse)) {
    adminUsers = adminUsersResponse;
  }
  // Check if response has data property
  else if (adminUsersResponse?.data) {
    // If data is an array, use it directly
    if (Array.isArray(adminUsersResponse.data)) {
      adminUsers = adminUsersResponse.data;
    }
    // If data has a nested array (e.g., { data: { users: [...] } })
    else if ((adminUsersResponse.data as any).users && Array.isArray((adminUsersResponse.data as any).users)) {
      adminUsers = (adminUsersResponse.data as any).users;
    }
    // If data has a results array
    else if ((adminUsersResponse.data as any).results && Array.isArray((adminUsersResponse.data as any).results)) {
      adminUsers = (adminUsersResponse.data as any).results;
    }
    // Check for admins array
    else if ((adminUsersResponse.data as any).admins && Array.isArray((adminUsersResponse.data as any).admins)) {
      adminUsers = (adminUsersResponse.data as any).admins;
    }
    // Check for adminUsers array
    else if ((adminUsersResponse.data as any).adminUsers && Array.isArray((adminUsersResponse.data as any).adminUsers)) {
      adminUsers = (adminUsersResponse.data as any).adminUsers;
    }
    // Check for any array property in data
    else {
      // Try to find any array property
      const dataObj = adminUsersResponse.data as any;
      for (const key in dataObj) {
        if (Array.isArray(dataObj[key])) {
          adminUsers = dataObj[key];
          break;
        }
      }
    }
  }
  // If no data property, check if response itself has array properties
  else {
    const responseObj = adminUsersResponse as any;
    for (const key in responseObj) {
      if (Array.isArray(responseObj[key])) {
        adminUsers = responseObj[key];
        break;
      }
    }
  }

  const usersPerPage = 10;
  const totalUsers = adminUsers.length;
  const totalPages = Math.ceil(totalUsers / usersPerPage);

  // Filter and sort data
  const filteredUsers = adminUsers
    .filter((user: any) => {
      if (searchTerm) {
        return user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               user.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return true;
    })
    .filter((user: any) => {
      if (orderStatus === "Active") return user.user?.status === "ACTIVE";
      if (orderStatus === "Pending") return user.user?.status === "PENDING";
      if (orderStatus === "Inactive") return user.user?.status === "INACTIVE";
      return true;
    })
    .sort((a: any, b: any) => {
      if (filterBy === "Name") {
        const aName = `${a.firstName} ${a.lastName}`.toLowerCase();
        const bName = `${b.firstName} ${b.lastName}`.toLowerCase();
        return orderType === "Ascending" ? aName.localeCompare(bName) : bName.localeCompare(aName);
      }
      if (filterBy === "Role") {
        return orderType === "Ascending" ? 
          (a.user?.role || '').localeCompare(b.user?.role || '') : 
          (b.user?.role || '').localeCompare(a.user?.role || '');
      }
      if (filterBy === "Date") {
        return orderType === "Ascending" ? 
          new Date(a.user?.lastLoginAt || 0).getTime() - new Date(b.user?.lastLoginAt || 0).getTime() :
          new Date(b.user?.lastLoginAt || 0).getTime() - new Date(a.user?.lastLoginAt || 0).getTime();
      }
      return 0;
    });

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  return (
    <>
      <PageMeta
        title="Admin Users | spearwin-admin"
        description="Manage admin users"
      />
      
      {/* Title Bar */}
      <div className="px-4 sm:px-6 lg:px-30 ">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
          <PageBreadcrumb 
            items={[
              { label: "Dashboard", path: "/" },
              { label: "Admin Users" }
            ]}
            showAdmin={true}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-30 py-4">
        
        {/* Filters and Add Button */}
        <div className="bg-white rounded-[10px] shadow-sm border border-gray-200 mb-4">
          <div className="px-6 py-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
                {/* Search Input */}
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
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
                      className="appearance-none rounded-md px-3 py-2 pr-8 text-sm bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                    >
                      <option>Date</option>
                      <option>Name</option>
                      <option>Role</option>
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
                      className="appearance-none rounded-md px-3 py-2 pr-8 text-sm bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
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
                      className="appearance-none rounded-md px-3 py-2 pr-8 text-sm bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
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

                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <button 
                onClick={() => navigate("/add-admin-users")}
                className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Add Admin
              </button>
            </div>
          </div>
        
          <div className="overflow-x-auto">
            <Table className="w-full min-w-[700px]">
              <TableHeader>
                <TableRow className="bg-blue-50 mx-4">
                  <TableCell isHeader className="rounded-l-[20px] pl-8 pr-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">
                     User Name
                  </TableCell>
                  <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Email</TableCell>
                  <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Phone</TableCell>
                  <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Role</TableCell>
                  <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Last Login</TableCell>
                  <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Status</TableCell>
                  <TableCell isHeader className="rounded-r-[20px] pl-3 pr-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Action</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
                        <span className="ml-2 text-gray-500">Loading users...</span>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center">
                      <div className="text-red-500">
                        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <p className="text-lg font-medium">Error loading users</p>
                        <p className="text-sm text-gray-500">Please try again later</p>
                      </div>
                    </td>
                  </tr>
                ) : paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center">
                      <div className="text-gray-500">
                        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p className="text-lg font-medium">No users found</p>
                        <p className="text-sm">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((user: any) => {
                    // Use the correct nested structure from API
                    const userEmail = user.user?.email || 'N/A';
                    const userPhone = user.user?.phone || 'N/A';
                    const userRole = user.user?.role || 'N/A';
                    
                    return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="pl-6 pr-3 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden mr-2 sm:mr-3">
                            <img 
                              src={user.avatar || "/images/user/default-avatar.jpg"} 
                              alt={`${user.firstName} ${user.lastName}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23e5e7eb'/%3E%3Ctext x='20' y='25' text-anchor='middle' fill='%236b7280' font-size='14'%3E" + (user.firstName?.charAt(0) || 'U') + "%3C/text%3E%3C/svg%3E";
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-500">{user.firstName} {user.lastName}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                        {userEmail}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                        {userPhone}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                        {userRole}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                        {user.user?.lastLoginAt ? new Date(user.user.lastLoginAt).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          user.user?.status === 'ACTIVE' 
                            ? 'bg-green-100 text-green-800' 
                            : user.user?.status === 'PENDING'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.user?.status || 'N/A'}
                        </span>
                      </td>
                      <td className="pl-3 pr-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <button 
                            className="p-1 text-blue-600 hover:text-blue-800"
                            onClick={() => navigate(`/edit-admin-user/${user.id}`)}
                            title="Edit admin user"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {filteredUsers.length > 0 ? (currentPage - 1) * usersPerPage + 1 : 0}-{Math.min(currentPage * usersPerPage, filteredUsers.length)} of {filteredUsers.length} users
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
                  Page {currentPage} of {Math.ceil(filteredUsers.length / usersPerPage) || 1}
                </span>
                <button 
                  onClick={() => setCurrentPage(Math.min(Math.ceil(filteredUsers.length / usersPerPage), currentPage + 1))}
                  disabled={currentPage >= Math.ceil(filteredUsers.length / usersPerPage)}
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

      </div>
    </>
  );
}
