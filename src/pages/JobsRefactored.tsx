import { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../components/common/PageMeta";
import PageHeader from "../components/common/PageHeader";
import FilterBar from "../components/ui/filter-bar/FilterBar";
import DataTable from "../components/ui/data-table/DataTable";

export default function JobsRefactored() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterBy, setFilterBy] = useState("Date");
  const [orderType, setOrderType] = useState("Order Type");
  const [orderStatus, setOrderStatus] = useState("Order Status");

  // Sample data - you can replace this with real data
  const jobs = [
    {
      id: 1,
      jobTitle: "UI/UX Designer",
      companyName: "Spearwin Pvt. Ltd.",
      location: "Bangalore, IN",
      jobType: "Full - Time",
      jobDescription: "We are looking for a senior",
      status: "Active"
    },
    {
      id: 2,
      jobTitle: "UI/UX Designer",
      companyName: "Spearwin Pvt. Ltd.",
      location: "Bangalore, IN",
      jobType: "Full - Time",
      jobDescription: "We are looking for a senior",
      status: "Pending"
    },
    {
      id: 3,
      jobTitle: "UI/UX Designer",
      companyName: "Spearwin Pvt. Ltd.",
      location: "Bangalore, IN",
      jobType: "Full - Time",
      jobDescription: "We are looking for a senior",
      status: "Active"
    },
    // ... more data
  ];

  const totalJobs = 78;
  const jobsPerPage = 10;
  const totalPages = Math.ceil(totalJobs / jobsPerPage);

  // Define table columns
  const columns = [
    { key: "jobTitle", label: "Job Title" },
    { key: "companyName", label: "Company Name" },
    { key: "location", label: "Location" },
    { key: "jobType", label: "Job Type" },
    { key: "jobDescription", label: "Job Description" },
    { key: "status", label: "Status" }
  ];

  // Define filter options
  const filterOptions = [
    {
      label: "Filter By",
      value: filterBy,
      options: [
        { value: "Date", label: "Date" },
        { value: "Job Title", label: "Job Title" },
        { value: "Company", label: "Company" }
      ],
      onChange: setFilterBy
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

  const handleEdit = (job: any) => {
    console.log("Edit job:", job);
    // Navigate to edit page or open modal
  };

  const handleDelete = (job: any) => {
    console.log("Delete job:", job);
    // Show confirmation modal or delete directly
  };

  const handleRefresh = () => {
    console.log("Refresh data");
    // Reload data
  };

  return (
    <>
      <PageMeta
        title="Jobs | spearwin-admin"
        description="Manage jobs"
      />
      
      <PageHeader
        title="Jobs"
        actionButton={{
          label: "Add Job",
          onClick: () => navigate("/add-job"),
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          )
        }}
      />

      <div className="px-30 py-4">
        <FilterBar
          filters={filterOptions}
          onRefresh={handleRefresh}
          className="mb-6"
        />

        <DataTable
          columns={columns}
          data={jobs}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalJobs}
          itemsPerPage={jobsPerPage}
          onPageChange={setCurrentPage}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
}
