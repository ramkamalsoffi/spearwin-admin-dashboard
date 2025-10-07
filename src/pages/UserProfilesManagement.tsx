import { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../components/ui/table";

export default function UserProfilesManagement() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterBy, setFilterBy] = useState("Name");
  const [orderType, setOrderType] = useState("Order Type");
  const [orderStatus, setOrderStatus] = useState("Order Status");

  // Sample data - you can replace this with real data
  const userProfiles = [
    {
      id: 1,
      profileId: "23432",
      name: "Vijayakumar",
      location: "Bangalore, IN",
      contactNumber: "+91 9876543210",
      email: "sample@gmail.com",
      status: "Active"
    },
    {
      id: 2,
      profileId: "23433",
      name: "Rajesh Kumar",
      location: "Mumbai, IN",
      contactNumber: "+91 9876543211",
      email: "rajesh@gmail.com",
      status: "Active"
    },
    {
      id: 3,
      profileId: "23434",
      name: "Priya Sharma",
      location: "Delhi, IN",
      contactNumber: "+91 9876543212",
      email: "priya@gmail.com",
      status: "Active"
    },
    {
      id: 4,
      profileId: "23435",
      name: "Amit Patel",
      location: "Chennai, IN",
      contactNumber: "+91 9876543213",
      email: "amit@gmail.com",
      status: "Inactive"
    },
    {
      id: 5,
      profileId: "23436",
      name: "Sneha Reddy",
      location: "Hyderabad, IN",
      contactNumber: "+91 9876543214",
      email: "sneha@gmail.com",
      status: "Active"
    },
    {
      id: 6,
      profileId: "23437",
      name: "Kiran Singh",
      location: "Pune, IN",
      contactNumber: "+91 9876543215",
      email: "kiran@gmail.com",
      status: "Active"
    },
    {
      id: 7,
      profileId: "23438",
      name: "Deepak Verma",
      location: "Kolkata, IN",
      contactNumber: "+91 9876543216",
      email: "deepak@gmail.com",
      status: "Active"
    },
    {
      id: 8,
      profileId: "23439",
      name: "Anita Joshi",
      location: "Ahmedabad, IN",
      contactNumber: "+91 9876543217",
      email: "anita@gmail.com",
      status: "Active"
    },
    {
      id: 9,
      profileId: "23440",
      name: "Ravi Kumar",
      location: "Jaipur, IN",
      contactNumber: "+91 9876543218",
      email: "ravi@gmail.com",
      status: "Active"
    }
  ];

  const totalProfiles = 78;
  const profilesPerPage = 10;
  const totalPages = Math.ceil(totalProfiles / profilesPerPage);

  // no external filter config; we render inline controls to match layout

  const handleEdit = (profile: any) => {
    console.log("Edit profile:", profile);
    // Navigate to edit page or open modal
    navigate(`/edit-profile/${profile.id}`);
  };

  const handleDelete = (profile: any) => {
    console.log("Delete profile:", profile);
    // Show confirmation modal or delete directly
    if (window.confirm(`Are you sure you want to delete ${profile.name}?`)) {
      // Handle delete logic here
      console.log("Profile deleted:", profile.id);
    }
  };

  const handleRefresh = () => {
    console.log("Refresh profiles data");
    // Reload data from API
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
                </div>

                <div className="relative">
                  <select 
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value)}
                    className="appearance-none rounded-[20px] px-4 py-2 pr-8 text-sm bg-white/30 border border-white/40 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
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
                    className="appearance-none rounded-[20px] px-4 py-2 pr-8 text-sm bg-white/30 border border-white/40 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
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
                <TableRow className="bg-muted/30 bg-gray-100 mx-4">
                  <TableCell isHeader className="rounded-l-[20px] pl-6 pr-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Profile ID</TableCell>
                  <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Name</TableCell>
                  <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Location</TableCell>
                  <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Contact Number</TableCell>
                  <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Email</TableCell>
                  <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Status</TableCell>
                  <TableCell isHeader className="rounded-r-[20px] pl-3 pr-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Action</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white divide-y divide-gray-200">
                {userProfiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-gray-50">
                    <td className="pl-6 pr-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{profile.profileId}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">{profile.name}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">{profile.location}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">{profile.contactNumber}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">{profile.email}</td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        profile.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : profile.status === 'Pending'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {profile.status}
                      </span>
                    </td>
                    <td className="pl-3 pr-6 py-3 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <button className="p-1 text-blue-600 hover:text-blue-800" onClick={() => handleEdit(profile)}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button className="p-1 text-red-600 hover:text-red-800" onClick={() => handleDelete(profile)}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing 1-{profilesPerPage} of {totalProfiles}
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
