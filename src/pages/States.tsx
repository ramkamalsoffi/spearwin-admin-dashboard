import { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../components/common/PageMeta";
import FilterBar from "../components/ui/filter-bar/FilterBar";
import DataTable from "../components/ui/data-table/DataTable";
import StatusBadge from "../components/ui/status-badge/StatusBadge";

export default function States() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterBy, setFilterBy] = useState("Language");
  const [orderType, setOrderType] = useState("Order Type");
  const [orderStatus, setOrderStatus] = useState("Order Status");

  // Sample States data matching the image
  const statesData = [
    {
      id: 1,
      language: "English",
      country: "English",
      state: "Tamilnadu",
      isDefault: true,
      status: "Active"
    },
    {
      id: 2,
      language: "English",
      country: "English",
      state: "Tamilnadu",
      isDefault: true,
      status: "Inactive"
    },
    {
      id: 3,
      language: "English",
      country: "English",
      state: "Tamilnadu",
      isDefault: true,
      status: "Active"
    },
    {
      id: 4,
      language: "English",
      country: "English",
      state: "Tamilnadu",
      isDefault: true,
      status: "Active"
    },
    {
      id: 5,
      language: "English",
      country: "English",
      state: "Tamilnadu",
      isDefault: true,
      status: "Active"
    },
    {
      id: 6,
      language: "English",
      country: "English",
      state: "Tamilnadu",
      isDefault: true,
      status: "Active"
    },
    {
      id: 7,
      language: "English",
      country: "English",
      state: "Tamilnadu",
      isDefault: true,
      status: "Active"
    },
    {
      id: 8,
      language: "English",
      country: "English",
      state: "Tamilnadu",
      isDefault: true,
      status: "Active"
    },
    {
      id: 9,
      language: "English",
      country: "English",
      state: "Tamilnadu",
      isDefault: true,
      status: "Active"
    }
  ];

  const totalStates = 78;
  const statesPerPage = 10;
  const totalPages = Math.ceil(totalStates / statesPerPage);

  // Define table columns
  const columns = [
    { 
      key: "language", 
      label: "Language", 
      className: "w-1/6"
    },
    { 
      key: "country", 
      label: "Country", 
      className: "w-1/6"
    },
    { 
      key: "state", 
      label: "State", 
      className: "w-1/6"
    },
    { 
      key: "isDefault", 
      label: "Default", 
      className: "w-1/6",
      render: (value: boolean) => (
        <span className="text-sm text-gray-900">
          {value ? "Yes" : "No"}
        </span>
      )
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
        { value: "Language", label: "Language" },
        { value: "Country", label: "Country" },
        { value: "State", label: "State" },
        { value: "Default", label: "Default" },
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

  const handleEdit = (state: any) => {
    console.log("Edit State:", state);
    // Navigate to edit page or open modal
    navigate(`/edit-state/${state.id}`);
  };

  const handleDelete = (state: any) => {
    console.log("Delete State:", state);
    // Show confirmation modal or delete directly
    if (window.confirm(`Are you sure you want to delete this state?`)) {
      // Handle delete logic here
      console.log("State deleted:", state.id);
    }
  };

  const handleRefresh = () => {
    console.log("Refresh States data");
    // Reload data from API
  };

  return (
    <>
      <PageMeta
        title="States | Spearwin Admin"
        description="Manage States"
      />
      
      {/* Title Bar */}
      <div className="px-30 py-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-900">States</h1>
        </div>
      </div>

      <div className="px-30 py-4">
        <FilterBar
          filters={filterOptions}
          onRefresh={handleRefresh}
          actionButton={{
            label: "Add States",
            onClick: () => navigate("/add-states"),
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
          data={statesData}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalStates}
          itemsPerPage={statesPerPage}
          onPageChange={setCurrentPage}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
}
