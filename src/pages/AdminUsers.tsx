import { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../components/common/PageMeta";

export default function AdminUsers() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterBy, setFilterBy] = useState("Date");
  const [orderType, setOrderType] = useState("Order Type");
  const [orderStatus, setOrderStatus] = useState("Order Status");

  // Sample data - you can replace this with real data
  const adminUsers = [
    {
      id: 1,
      name: "Alfredo Vetrovs",
      email: "sample@gmail.com",
      phone: "+91 9876543210",
      role: "Admin",
      lastLogin: "12.09.2025",
      status: "Active",
      avatar: "/images/user/user-01.jpg"
    },
    {
      id: 2,
      name: "Charlie Ekstrom",
      email: "sample@gmail.com",
      phone: "+91 9876543210",
      role: "Super Admin",
      lastLogin: "12.09.2025",
      status: "Pending",
      avatar: "/images/user/user-02.jpg"
    },
    {
      id: 3,
      name: "Carla Westervelt",
      email: "sample@gmail.com",
      phone: "+91 9876543210",
      role: "Admin",
      lastLogin: "12.09.2025",
      status: "Active",
      avatar: "/images/user/user-03.jpg"
    },
    {
      id: 4,
      name: "Carla Westervelt",
      email: "sample@gmail.com",
      phone: "+91 9876543210",
      role: "Admin",
      lastLogin: "12.09.2025",
      status: "Active",
      avatar: "/images/user/user-04.jpg"
    },
    {
      id: 5,
      name: "Carla Westervelt",
      email: "sample@gmail.com",
      phone: "+91 9876543210",
      role: "Admin",
      lastLogin: "12.09.2025",
      status: "Active",
      avatar: "/images/user/user-05.jpg"
    },
    {
      id: 6,
      name: "Carla Westervelt",
      email: "sample@gmail.com",
      phone: "+91 9876543210",
      role: "Admin",
      lastLogin: "12.09.2025",
      status: "Active",
      avatar: "/images/user/user-06.jpg"
    },
    {
      id: 7,
      name: "Carla Westervelt",
      email: "sample@gmail.com",
      phone: "+91 9876543210",
      role: "Admin",
      lastLogin: "12.09.2025",
      status: "Active",
      avatar: "/images/user/user-07.jpg"
    },
    {
      id: 8,
      name: "Carla Westervelt",
      email: "sample@gmail.com",
      phone: "+91 9876543210",
      role: "Admin",
      lastLogin: "12.09.2025",
      status: "Active",
      avatar: "/images/user/user-08.jpg"
    },
    {
      id: 9,
      name: "Carla Westervelt",
      email: "sample@gmail.com",
      phone: "+91 9876543210",
      role: "Admin",
      lastLogin: "12.09.2025",
      status: "Active",
      avatar: "/images/user/user-09.jpg"
    },
    {
      id: 10,
      name: "Carla Westervelt",
      email: "sample@gmail.com",
      phone: "+91 9876543210",
      role: "Admin",
      lastLogin: "12.09.2025",
      status: "Active",
      avatar: "/images/user/user-10.jpg"
    }
  ];

  const totalUsers = 78;
  const usersPerPage = 10;
  const totalPages = Math.ceil(totalUsers / usersPerPage);

  return (
    <>
      <PageMeta
        title="Admin Users | Spearwin Admin"
        description="Manage admin users"
      />
      
      {/* Title Bar */}
      <div className="px-30 py-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-900">Admin Users</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-30 py-4">
        
        {/* Filters and Add Button */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Filter By</span>
                </div>
                
                <select 
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>Date</option>
                  <option>Name</option>
                  <option>Role</option>
                </select>
                
                <select 
                  value={orderType}
                  onChange={(e) => setOrderType(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>Order Type</option>
                  <option>Ascending</option>
                  <option>Descending</option>
                </select>
                
                <select 
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>Order Status</option>
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Inactive</option>
                </select>

                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
              
              <button 
                onClick={() => navigate("/add-admin-users")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Add Admin
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {adminUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                          <img 
                            src={user.avatar} 
                            alt={user.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23e5e7eb'/%3E%3Ctext x='20' y='25' text-anchor='middle' fill='%236b7280' font-size='14'%3E" + user.name.charAt(0) + "%3C/text%3E%3C/svg%3E";
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastLogin}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        user.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <button className="p-1 text-blue-600 hover:text-blue-800">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button className="p-1 text-red-600 hover:text-red-800">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing 1-{usersPerPage} of {totalUsers}
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
        </div>

      </div>
    </>
  );
}
