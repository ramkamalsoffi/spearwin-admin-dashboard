import { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../components/ui/table";

export default function Packages() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterBy, setFilterBy] = useState("Title");
  const [orderType, setOrderType] = useState("Order Type");
  const [orderStatus, setOrderStatus] = useState("Order Status");

  // Sample Packages data matching the image
  const packagesData = [
    {
      id: 1,
      title: "Premium",
      price: "199.00",
      noOfDays: "90",
      noOfListings: "30",
      for: "job_seeker"
    },
    {
      id: 2,
      title: "Premium",
      price: "199.00",
      noOfDays: "90",
      noOfListings: "30",
      for: "job_seeker"
    },
    {
      id: 3,
      title: "Premium",
      price: "199.00",
      noOfDays: "90",
      noOfListings: "30",
      for: "job_seeker"
    },
    {
      id: 4,
      title: "Premium",
      price: "199.00",
      noOfDays: "90",
      noOfListings: "30",
      for: "job_seeker"
    },
    {
      id: 5,
      title: "Premium",
      price: "199.00",
      noOfDays: "90",
      noOfListings: "30",
      for: "job_seeker"
    },
    {
      id: 6,
      title: "Premium",
      price: "199.00",
      noOfDays: "90",
      noOfListings: "30",
      for: "job_seeker"
    },
    {
      id: 7,
      title: "Premium",
      price: "199.00",
      noOfDays: "90",
      noOfListings: "30",
      for: "job_seeker"
    },
    {
      id: 8,
      title: "Premium",
      price: "199.00",
      noOfDays: "90",
      noOfListings: "30",
      for: "job_seeker"
    },
    {
      id: 9,
      title: "Premium",
      price: "199.00",
      noOfDays: "90",
      noOfListings: "30",
      for: "job_seeker"
    }
  ];

  const totalPackages = 78;
  const packagesPerPage = 10;
  const totalPages = Math.ceil(totalPackages / packagesPerPage);

  // filters will be rendered inline in the card header


  const handleRefresh = () => {
    console.log("Refresh Packages data");
    // Reload data from API
  };

  return (
    <>
      <PageMeta
        title="Packages | spearwin-admin"
        description="Manage Packages"
      />
      
      {/* Title Bar */}
      <div className="px-4 sm:px-6 lg:px-30 ">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
          <PageBreadcrumb 
            items={[
              { label: "Dashboard", path: "/" },
              { label: "Packages" }
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

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <div className="relative">
                    <select 
                      value={filterBy}
                      onChange={(e) => setFilterBy(e.target.value)}
                      className="w-full sm:w-auto appearance-none rounded-[20px] px-4 py-2 pr-8 text-sm bg-white/30 border border-white/40 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer min-w-[120px]"
                    >
                      <option>Title</option>
                      <option>Price</option>
                      <option>No of Days</option>
                      <option>No of Listings</option>
                      <option>For</option>
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
                      className="w-full sm:w-auto appearance-none rounded-[20px] px-4 py-2 pr-8 text-sm bg-white/30 border border-white/40 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer min-w-[120px]"
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
                      className="w-full sm:w-auto appearance-none rounded-[20px] px-4 py-2 pr-8 text-sm bg-white/30 border border-white/40 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer min-w-[120px]"
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
                </div>

                <button className="p-2 text-gray-400 hover:text-gray-600" onClick={handleRefresh}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>

              <button 
                onClick={() => navigate("/add-package")}
                className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Add Package
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table className="w-full min-w-[700px]">
              <TableHeader>
                <TableRow className="bg-blue-50 mx-4">
                  <TableCell isHeader className="rounded-l-[20px] pl-6 pr-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Title</TableCell>
                  <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Price</TableCell>
                  <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">No of Days</TableCell>
                  <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">No of Listings</TableCell>
                  <TableCell isHeader className="rounded-r-[20px] pl-3 pr-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">For</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white divide-y divide-gray-200">
                {packagesData.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="pl-6 pr-3 py-3 whitespace-nowrap text-sm text-gray-500">{row.title}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">{row.price}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">{row.noOfDays}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">{row.noOfListings}</td>
                    <td className="pl-3 pr-6 py-3 whitespace-nowrap text-sm text-gray-500">{row.for}</td>
                  </tr>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing 1-{packagesPerPage} of {totalPackages}
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
