import { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../components/common/PageMeta";
import FilterBar from "../components/ui/filter-bar/FilterBar";
import DataTable from "../components/ui/data-table/DataTable";
import StatusBadge from "../components/ui/status-badge/StatusBadge";

export default function Languages() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterBy, setFilterBy] = useState("Language");
  const [orderType, setOrderType] = useState("Order Type");
  const [orderStatus, setOrderStatus] = useState("Order Status");

  // Sample languages data matching the image
  const languagesData = [
    {
      id: 1,
      language: "English",
      native: "English",
      isoCode: "en",
      isRTL: true,
      isDefault: true,
      status: "Active"
    },
    {
      id: 2,
      language: "English",
      native: "English",
      isoCode: "en",
      isRTL: true,
      isDefault: true,
      status: "Inactive"
    },
    {
      id: 3,
      language: "English",
      native: "English",
      isoCode: "en",
      isRTL: true,
      isDefault: true,
      status: "Active"
    },
    {
      id: 4,
      language: "English",
      native: "English",
      isoCode: "en",
      isRTL: true,
      isDefault: true,
      status: "Active"
    },
    {
      id: 5,
      language: "English",
      native: "English",
      isoCode: "en",
      isRTL: true,
      isDefault: true,
      status: "Active"
    },
    {
      id: 6,
      language: "English",
      native: "English",
      isoCode: "en",
      isRTL: true,
      isDefault: true,
      status: "Active"
    },
    {
      id: 7,
      language: "English",
      native: "English",
      isoCode: "en",
      isRTL: true,
      isDefault: true,
      status: "Active"
    },
    {
      id: 8,
      language: "English",
      native: "English",
      isoCode: "en",
      isRTL: true,
      isDefault: true,
      status: "Active"
    },
    {
      id: 9,
      language: "English",
      native: "English",
      isoCode: "en",
      isRTL: true,
      isDefault: true,
      status: "Active"
    }
  ];

  const totalLanguages = 78;
  const languagesPerPage = 10;
  const totalPages = Math.ceil(totalLanguages / languagesPerPage);

  // Define table columns
  const columns = [
    { 
      key: "language", 
      label: "Language", 
      className: "w-1/7"
    },
    { 
      key: "native", 
      label: "Native", 
      className: "w-1/7"
    },
    { 
      key: "isoCode", 
      label: "ISO Code", 
      className: "w-1/7"
    },
    { 
      key: "isRTL", 
      label: "Is RTL", 
      className: "w-1/7",
      render: (value: boolean) => (
        <span className="text-sm text-gray-900">
          {value ? "Yes" : "No"}
        </span>
      )
    },
    { 
      key: "isDefault", 
      label: "Is Default", 
      className: "w-1/7",
      render: (value: boolean) => (
        <span className="text-sm text-gray-900">
          {value ? "Yes" : "No"}
        </span>
      )
    },
    { 
      key: "status", 
      label: "Status", 
      className: "w-1/7",
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
        { value: "Native", label: "Native" },
        { value: "ISO Code", label: "ISO Code" },
        { value: "Is RTL", label: "Is RTL" },
        { value: "Is Default", label: "Is Default" },
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

  const handleEdit = (language: any) => {
    console.log("Edit Language:", language);
    // Navigate to edit page or open modal
    navigate(`/edit-language/${language.id}`);
  };

  const handleDelete = (language: any) => {
    console.log("Delete Language:", language);
    // Show confirmation modal or delete directly
    if (window.confirm(`Are you sure you want to delete this language?`)) {
      // Handle delete logic here
      console.log("Language deleted:", language.id);
    }
  };

  const handleRefresh = () => {
    console.log("Refresh Languages data");
    // Reload data from API
  };

  return (
    <>
      <PageMeta
        title="Languages | Spearwin Admin"
        description="Manage Languages"
      />
      
      {/* Title Bar */}
      <div className="px-30 py-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-900">Languages</h1>
        </div>
      </div>

      <div className="px-30 py-4">
        <FilterBar
          filters={filterOptions}
          onRefresh={handleRefresh}
          actionButton={{
            label: "Add Languages",
            onClick: () => navigate("/add-language"),
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
          data={languagesData}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalLanguages}
          itemsPerPage={languagesPerPage}
          onPageChange={setCurrentPage}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
}
