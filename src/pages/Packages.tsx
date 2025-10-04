import { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../components/common/PageMeta";
import FilterBar from "../components/ui/filter-bar/FilterBar";
import DataTable from "../components/ui/data-table/DataTable";
import StatusBadge from "../components/ui/status-badge/StatusBadge";

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

  // Define table columns
  const columns = [
    { 
      key: "title", 
      label: "Title", 
      className: "w-1/6"
    },
    { 
      key: "price", 
      label: "Price", 
      className: "w-1/6"
    },
    { 
      key: "noOfDays", 
      label: "No of Days", 
      className: "w-1/6"
    },
    { 
      key: "noOfListings", 
      label: "No of Listings", 
      className: "w-1/6"
    },
    { 
      key: "for", 
      label: "For", 
      className: "w-1/6"
    }
  ];

  // Define filter options
  const filterOptions = [
    {
      label: "Filter By",
      value: filterBy,
      options: [
        { value: "Title", label: "Title" },
        { value: "Price", label: "Price" },
        { value: "No of Days", label: "No of Days" },
        { value: "No of Listings", label: "No of Listings" },
        { value: "For", label: "For" }
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

  const handleEdit = (packageItem: any) => {
    console.log("Edit Package:", packageItem);
    // Navigate to edit page or open modal
    navigate(`/edit-package/${packageItem.id}`);
  };

  const handleDelete = (packageItem: any) => {
    console.log("Delete Package:", packageItem);
    // Show confirmation modal or delete directly
    if (window.confirm(`Are you sure you want to delete this package?`)) {
      // Handle delete logic here
      console.log("Package deleted:", packageItem.id);
    }
  };

  const handleRefresh = () => {
    console.log("Refresh Packages data");
    // Reload data from API
  };

  return (
    <>
      <PageMeta
        title="Packages | Spearwin Admin"
        description="Manage Packages"
      />
      
      {/* Title Bar */}
      <div className="px-30 py-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-900">Packages</h1>
        </div>
      </div>

      <div className="px-30 py-4">
        <FilterBar
          filters={filterOptions}
          onRefresh={handleRefresh}
          actionButton={{
            label: "Add Package",
            onClick: () => navigate("/add-package"),
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
          data={packagesData}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalPackages}
          itemsPerPage={packagesPerPage}
          onPageChange={setCurrentPage}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
}
