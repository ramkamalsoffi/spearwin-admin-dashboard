import { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../components/common/PageMeta";
import FilterBar from "../components/ui/filter-bar/FilterBar";
import DataTable from "../components/ui/data-table/DataTable";
import StatusBadge from "../components/ui/status-badge/StatusBadge";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [filterBy, setFilterBy] = useState("User Name");
  const [orderType, setOrderType] = useState("Order Type");
  const [orderStatus, setOrderStatus] = useState("Order Status");

  // Sample testimonial data matching the image
  const testimonials = [
    {
      id: 1,
      userName: "Alfredo Vetrovs",
      userAvatar: "/images/user/user-01.jpg",
      role: "Job Seeker",
      company: "Tech Corp",
      feedback: "I got my dream job within 2 weeks of using this platform. The process was smooth and the support team was incredibly helpful throughout my journey.",
      rating: 5,
      status: "Active"
    },
    {
      id: 2,
      userName: "Charlie Ekstrom",
      userAvatar: "/images/user/user-02.jpg",
      role: "Job Seeker",
      company: "Design Studio",
      feedback: "I got my dream job within 2 weeks of using this platform. The process was smooth and the support team was incredibly helpful throughout my journey.",
      rating: 5,
      status: "Inactive"
    },
    {
      id: 3,
      userName: "Carla Westervelt",
      userAvatar: "/images/user/user-03.jpg",
      role: "Job Seeker",
      company: "Marketing Agency",
      feedback: "I got my dream job within 2 weeks of using this platform. The process was smooth and the support team was incredibly helpful throughout my journey.",
      rating: 5,
      status: "Active"
    },
    {
      id: 4,
      userName: "Sarah Johnson",
      userAvatar: "/images/user/user-04.jpg",
      role: "Job Seeker",
      company: "Finance Corp",
      feedback: "I got my dream job within 2 weeks of using this platform. The process was smooth and the support team was incredibly helpful throughout my journey.",
      rating: 5,
      status: "Active"
    },
    {
      id: 5,
      userName: "Michael Brown",
      userAvatar: "/images/user/user-05.jpg",
      role: "Job Seeker",
      company: "Tech Solutions",
      feedback: "I got my dream job within 2 weeks of using this platform. The process was smooth and the support team was incredibly helpful throughout my journey.",
      rating: 5,
      status: "Active"
    },
    {
      id: 6,
      userName: "Emily Davis",
      userAvatar: "/images/user/user-06.jpg",
      role: "Job Seeker",
      company: "Creative Agency",
      feedback: "I got my dream job within 2 weeks of using this platform. The process was smooth and the support team was incredibly helpful throughout my journey.",
      rating: 5,
      status: "Active"
    },
    {
      id: 7,
      userName: "David Wilson",
      userAvatar: "/images/user/user-07.jpg",
      role: "Job Seeker",
      company: "Consulting Firm",
      feedback: "I got my dream job within 2 weeks of using this platform. The process was smooth and the support team was incredibly helpful throughout my journey.",
      rating: 5,
      status: "Active"
    },
    {
      id: 8,
      userName: "Lisa Anderson",
      userAvatar: "/images/user/user-08.jpg",
      role: "Job Seeker",
      company: "Healthcare Corp",
      feedback: "I got my dream job within 2 weeks of using this platform. The process was smooth and the support team was incredibly helpful throughout my journey.",
      rating: 5,
      status: "Active"
    },
    {
      id: 9,
      userName: "James Taylor",
      userAvatar: "/images/user/user-09.jpg",
      role: "Job Seeker",
      company: "Engineering Co",
      feedback: "I got my dream job within 2 weeks of using this platform. The process was smooth and the support team was incredibly helpful throughout my journey.",
      rating: 5,
      status: "Active"
    }
  ];

  const totalTestimonials = 78;
  const testimonialsPerPage = 10;
  const totalPages = Math.ceil(totalTestimonials / testimonialsPerPage);

  // Define table columns
  const columns = [
    { 
      key: "userName", 
      label: "User Name", 
      className: "w-1/6",
      render: (value: string, row: any) => (
        <UserInfo name={value} avatar={row.userAvatar} />
      )
    },
    { 
      key: "role", 
      label: "Role / Company", 
      className: "w-1/6",
      render: (value: string, row: any) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.company}</div>
        </div>
      )
    },
    { 
      key: "feedback", 
      label: "Feedback", 
      className: "w-2/6",
      render: (value: string) => (
        <div className="text-sm text-gray-700 max-w-xs truncate">
          {value}
        </div>
      )
    },
    { 
      key: "rating", 
      label: "Rating", 
      className: "w-1/6",
      render: (value: number) => <StarRating rating={value} />
    },
    { 
      key: "status", 
      label: "Status", 
      className: "w-1/6",
      render: (value: string) => (
        <StatusBadge 
          status={value.toLowerCase() as "active" | "inactive"} 
        />
      )
    }
  ];

  // Define filter options
  const filterOptions = [
    {
      label: "Filter By",
      value: filterBy,
      options: [
        { value: "User Name", label: "User Name" },
        { value: "Role", label: "Role" },
        { value: "Company", label: "Company" },
        { value: "Status", label: "Status" },
        { value: "Rating", label: "Rating" }
      ],
      onChange: setFilterBy
    },
    {
      label: "Date",
      value: "Date",
      options: [
        { value: "Date", label: "Date" },
        { value: "Today", label: "Today" },
        { value: "This Week", label: "This Week" },
        { value: "This Month", label: "This Month" }
      ],
      onChange: (value: string) => console.log("Date filter:", value)
    },
    {
      label: "Order Type",
      value: orderType,
      options: [
        { value: "Order Type", label: "Order Type" },
        { value: "Ascending", label: "Ascending" },
        { value: "Descending", label: "Descending" }
      ],
      onChange: setOrderType
    },
    {
      label: "Order Status",
      value: orderStatus,
      options: [
        { value: "Order Status", label: "Order Status" },
        { value: "Active", label: "Active" },
        { value: "Pending", label: "Pending" },
        { value: "Inactive", label: "Inactive" }
      ],
      onChange: setOrderStatus
    }
  ];

  const handleEdit = (testimonial: any) => {
    console.log("Edit Testimonial:", testimonial);
    // Navigate to edit page or open modal
    navigate(`/edit-testimonial/${testimonial.id}`);
  };

  const handleDelete = (testimonial: any) => {
    console.log("Delete Testimonial:", testimonial);
    // Show confirmation modal or delete directly
    if (window.confirm(`Are you sure you want to delete this testimonial?`)) {
      // Handle delete logic here
      console.log("Testimonial deleted:", testimonial.id);
    }
  };

  const handleRefresh = () => {
    console.log("Refresh Testimonials data");
    // Reload data from API
  };

  return (
    <>
      <PageMeta
        title="Testimonials | Spearwin Admin"
        description="Manage Testimonials"
      />
      
      {/* Title Bar */}
      <div className="px-30 py-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-900">Testimonial</h1>
        </div>
      </div>

      <div className="px-30 py-4">
        <FilterBar
          filters={filterOptions}
          onRefresh={handleRefresh}
          actionButton={{
            label: "Add Testimonial",
            onClick: () => navigate("/add-testimonial"),
            icon: (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            )
          }}
          className="mb-6"
        />

        <DataTable
          columns={columns}
          data={testimonials}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalTestimonials}
          itemsPerPage={testimonialsPerPage}
          onPageChange={setCurrentPage}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
}
