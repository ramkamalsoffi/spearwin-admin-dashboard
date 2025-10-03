import { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../components/common/PageMeta";
import PageHeader from "../components/common/PageHeader";
import FilterBar from "../components/ui/filter-bar/FilterBar";
import DataTable from "../components/ui/data-table/DataTable";

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

  // Define table columns
  const columns = [
    { key: "profileId", label: "Profile ID" },
    { key: "name", label: "Name" },
    { key: "location", label: "Location" },
    { key: "contactNumber", label: "Contact Number" },
    { key: "email", label: "Email" },
    { key: "status", label: "Status" }
  ];

  // Define filter options
  const filterOptions = [
    {
      label: "Filter By",
      value: filterBy,
      options: [
        { value: "Name", label: "Name" },
        { value: "Location", label: "Location" },
        { value: "Email", label: "Email" },
        { value: "Status", label: "Status" }
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
        title="User Profile | Spearwin Admin"
        description="Manage user profiles"
      />
      
      {/* Title Bar */}
      <div className="px-30 py-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-900">User Profile</h1>
        </div>
      </div>

      <div className="px-30 py-4">
        <FilterBar
          filters={filterOptions}
          onRefresh={handleRefresh}
          actionButton={{
            label: "Add Profile",
            onClick: () => navigate("/add-profile"),
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
          data={userProfiles}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalProfiles}
          itemsPerPage={profilesPerPage}
          onPageChange={setCurrentPage}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
}
