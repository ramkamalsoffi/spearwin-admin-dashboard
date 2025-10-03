import { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../components/common/PageMeta";
import PageHeader from "../components/common/PageHeader";
import FilterBar from "../components/ui/filter-bar/FilterBar";
import DataTable from "../components/ui/data-table/DataTable";

export default function Companies() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterBy, setFilterBy] = useState("Company Name");
  const [orderType, setOrderType] = useState("Order Type");
  const [orderStatus, setOrderStatus] = useState("Order Status");

  // Sample data - you can replace this with real data
  const companies = [
    {
      id: 1,
      companyName: "Spearwin Pvt. Ltd.",
      industry: "Technology",
      location: "Bangalore, IN",
      website: "www.spearwin.com",
      contactPerson: "John Doe",
      email: "contact@spearwin.com",
      phone: "+91 9876543210",
      status: "Active"
    },
    {
      id: 2,
      companyName: "TechCorp Solutions",
      industry: "Software",
      location: "Mumbai, IN",
      website: "www.techcorp.com",
      contactPerson: "Jane Smith",
      email: "info@techcorp.com",
      phone: "+91 9876543211",
      status: "Pending"
    },
    {
      id: 3,
      companyName: "Innovate Labs",
      industry: "Research",
      location: "Delhi, IN",
      website: "www.innovatelabs.com",
      contactPerson: "Mike Johnson",
      email: "hello@innovatelabs.com",
      phone: "+91 9876543212",
      status: "Active"
    },
    {
      id: 4,
      companyName: "Global Systems",
      industry: "Consulting",
      location: "Chennai, IN",
      website: "www.globalsys.com",
      contactPerson: "Sarah Wilson",
      email: "contact@globalsys.com",
      phone: "+91 9876543213",
      status: "Inactive"
    },
    {
      id: 5,
      companyName: "Future Tech",
      industry: "AI/ML",
      location: "Hyderabad, IN",
      website: "www.futuretech.com",
      contactPerson: "David Brown",
      email: "info@futuretech.com",
      phone: "+91 9876543214",
      status: "Active"
    },
    {
      id: 6,
      companyName: "Data Dynamics",
      industry: "Analytics",
      location: "Pune, IN",
      website: "www.datadynamics.com",
      contactPerson: "Lisa Davis",
      email: "contact@datadynamics.com",
      phone: "+91 9876543215",
      status: "Active"
    },
    {
      id: 7,
      companyName: "Cloud Masters",
      industry: "Cloud Services",
      location: "Kolkata, IN",
      website: "www.cloudmasters.com",
      contactPerson: "Tom Wilson",
      email: "info@cloudmasters.com",
      phone: "+91 9876543216",
      status: "Pending"
    },
    {
      id: 8,
      companyName: "Digital Solutions",
      industry: "Digital Marketing",
      location: "Ahmedabad, IN",
      website: "www.digitalsolutions.com",
      contactPerson: "Emma Taylor",
      email: "hello@digitalsolutions.com",
      phone: "+91 9876543217",
      status: "Active"
    },
    {
      id: 9,
      companyName: "Secure Systems",
      industry: "Cybersecurity",
      location: "Jaipur, IN",
      website: "www.securesys.com",
      contactPerson: "Alex Johnson",
      email: "contact@securesys.com",
      phone: "+91 9876543218",
      status: "Active"
    }
  ];

  const totalCompanies = 45;
  const companiesPerPage = 10;
  const totalPages = Math.ceil(totalCompanies / companiesPerPage);

  // Define table columns
  const columns = [
    { key: "companyName", label: "Company Name" },
    { key: "industry", label: "Industry" },
    { key: "location", label: "Location" },
    { key: "contactPerson", label: "Contact Person" },
    { key: "email", label: "Email" },
    { key: "status", label: "Status" }
  ];

  // Define filter options
  const filterOptions = [
    {
      label: "Filter By",
      value: filterBy,
      options: [
        { value: "Company Name", label: "Company Name" },
        { value: "Industry", label: "Industry" },
        { value: "Location", label: "Location" },
        { value: "Status", label: "Status" }
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

  const handleEdit = (company: any) => {
    console.log("Edit company:", company);
    // Navigate to edit page or open modal
    navigate(`/edit-company/${company.id}`);
  };

  const handleDelete = (company: any) => {
    console.log("Delete company:", company);
    // Show confirmation modal or delete directly
    if (window.confirm(`Are you sure you want to delete ${company.companyName}?`)) {
      // Handle delete logic here
      console.log("Company deleted:", company.id);
    }
  };

  const handleView = (company: any) => {
    console.log("View company:", company);
    // Navigate to company details page
    navigate(`/company/${company.id}`);
  };

  const handleRefresh = () => {
    console.log("Refresh companies data");
    // Reload data from API
  };

  return (
    <>
      <PageMeta
        title="Companies | Spearwin Admin"
        description="Manage companies"
      />
      
      {/* Title Bar */}
      <div className="px-30 py-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-900">Companies</h1>
        </div>
      </div>

      <div className="px-30 py-4">
        <FilterBar
          filters={filterOptions}
          onRefresh={handleRefresh}
          actionButton={{
            label: "Add Company",
            onClick: () => navigate("/add-company"),
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
          data={companies}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalCompanies}
          itemsPerPage={companiesPerPage}
          onPageChange={setCurrentPage}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
}
