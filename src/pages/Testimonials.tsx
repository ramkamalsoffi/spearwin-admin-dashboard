import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../components/ui/table";
import StatusBadge from "../components/ui/status-badge/StatusBadge";
import { testimonialService } from "../services/testimonialService";
import { useTestimonialMutations } from "../hooks/useTestimonialMutations";
import { Testimonial } from "../services/types";

// Star Rating Component
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

// User Info Component
const UserInfo = ({ name, avatar }: { name: string; avatar: string }) => {
  return (
    <div className="flex items-center gap-3">
      <img
        src={avatar}
        alt={name}
        className="w-8 h-8 rounded-full object-cover"
      />
      <span className="text-sm font-medium text-gray-900">{name}</span>
    </div>
  );
};

export default function Testimonials() {
  const navigate = useNavigate();
  const { deleteTestimonialMutation, toggleTestimonialStatusMutation } = useTestimonialMutations();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterBy, setFilterBy] = useState("User Name");
  const [orderType, setOrderType] = useState("Order Type");
  const [orderStatus, setOrderStatus] = useState("Order Status");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch testimonials data from API
  const { data: testimonialsResponse, isLoading, error, refetch } = useQuery({
    queryKey: ['testimonials', currentPage, filterBy, orderType, orderStatus, searchTerm],
    queryFn: async () => {
      const response = await testimonialService.getTestimonials();
      return response;
    },
  });

  // Extract testimonials from response - handle the specific API structure
  let testimonials: Testimonial[] = [];
  
  if (testimonialsResponse && typeof testimonialsResponse === 'object') {
    const responseObj = testimonialsResponse as any;
    if (responseObj.testimonials && Array.isArray(responseObj.testimonials)) {
      testimonials = responseObj.testimonials;
    } else if (Array.isArray(responseObj.data)) {
      testimonials = responseObj.data;
    } else if (Array.isArray(responseObj)) {
      testimonials = responseObj;
    }
  } else if (Array.isArray(testimonialsResponse)) {
    testimonials = testimonialsResponse;
  }

  // Filter and sort testimonials
  const filteredTestimonials = testimonials
    .filter((testimonial: Testimonial) => {
      if (searchTerm) {
        return testimonial.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               testimonial.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               testimonial.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               testimonial.content?.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return true;
    })
    .filter((testimonial: Testimonial) => {
      if (orderStatus === "Active") return testimonial.isActive === true;
      if (orderStatus === "Inactive") return testimonial.isActive === false;
      return true;
    });

  const totalTestimonials = filteredTestimonials.length;
  const testimonialsPerPage = 10;
  const totalPages = Math.ceil(totalTestimonials / testimonialsPerPage);

  // Get paginated testimonials
  const startIndex = (currentPage - 1) * testimonialsPerPage;
  const endIndex = startIndex + testimonialsPerPage;
  const paginatedTestimonials = filteredTestimonials.slice(startIndex, endIndex);

  // render filters inline to match standardized layout

  const handleEdit = (testimonial: Testimonial) => {
    console.log("Edit Testimonial:", testimonial);
    if (testimonial.id) {
      navigate(`/edit-testimonial/${testimonial.id}`);
    }
  };

  const handleDelete = (testimonial: Testimonial) => {
    console.log("Delete Testimonial:", testimonial);
    if (testimonial.id && window.confirm(`Are you sure you want to delete this testimonial?`)) {
      deleteTestimonialMutation.mutate(testimonial.id);
    }
  };

  const handleRefresh = () => {
    console.log("Refresh Testimonials data");
    refetch();
  };

  return (
    <>
      <PageMeta
        title="Testimonials | spearwin-admin"
        description="Manage Testimonials"
      />
      
      {/* Title Bar */}
      <div className="px-4 sm:px-6 lg:px-30 ">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
          <PageBreadcrumb 
            items={[
              { label: "Dashboard", path: "/" },
              { label: "Testimonials" }
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
                  <input
                    type="text"
                    placeholder="Search testimonials..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
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
                    <option>User Name</option>
                    <option>Role</option>
                    <option>Company</option>
                    <option>Status</option>
                    <option>Rating</option>
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
                onClick={() => navigate("/add-testimonial")}
                className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Add Testimonial
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table className="w-full min-w-[700px]">
              <TableHeader>
                <TableRow className="bg-blue-50 mx-4">
                  <TableCell isHeader className="rounded-l-[20px] pl-6 pr-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">User Name</TableCell>
                  <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Role / Company</TableCell>
                  <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Feedback</TableCell>
                  <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Rating</TableCell>
                  <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Status</TableCell>
                  <TableCell isHeader className="rounded-r-[20px] pl-3 pr-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Action</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
                        <span className="ml-2 text-gray-600">Loading testimonials...</span>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="text-red-600">
                        <p className="text-lg font-medium">Error loading testimonials</p>
                        <p className="text-sm mt-1">Please try again later</p>
                      </div>
                    </td>
                  </tr>
                ) : paginatedTestimonials.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <p className="text-lg font-medium">No testimonials found</p>
                        <p className="text-sm mt-1">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedTestimonials.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="pl-6 pr-3 py-3 whitespace-nowrap text-sm font-medium text-gray-500">
                        <UserInfo name={t.name} avatar={t.imageUrl} />
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          <div className="text-sm font-medium text-gray-500">{t.title}</div>
                          <div className="text-sm text-gray-500">{t.company}</div>
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-normal text-sm text-gray-700 leading-relaxed">{t.content}</td>
                      <td className="px-3 py-3 whitespace-nowrap"><StarRating rating={t.rating} /></td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <StatusBadge status={t.isActive ? "active" : "inactive"} />
                      </td>
                      <td className="pl-3 pr-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <button className="p-1 text-blue-600 hover:text-blue-800" onClick={() => handleEdit(t)}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button className="p-1 text-red-600 hover:text-red-800" onClick={() => handleDelete(t)}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                          {/* Toggle Active (after Delete) */}
                          <label className="relative inline-flex items-center cursor-pointer ml-1">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={!!t.isActive}
                              onChange={() => toggleTestimonialStatusMutation.mutate(String(t.id))}
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
                Showing {startIndex + 1}-{Math.min(endIndex, totalTestimonials)} of {totalTestimonials}
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
