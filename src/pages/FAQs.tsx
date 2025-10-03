import { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../components/common/PageMeta";
import FilterBar from "../components/ui/filter-bar/FilterBar";
import DataTable from "../components/ui/data-table/DataTable";

export default function FAQs() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterBy, setFilterBy] = useState("Question");
  const [orderType, setOrderType] = useState("Order Type");
  const [orderStatus, setOrderStatus] = useState("Order Status");

  // Sample data - you can replace this with real data
  const faqs = [
    {
      id: 1,
      question: "Can I edit my profile after applying?",
      answer: "Yes, but updates won't change past applications.",
      category: "User Profile",
      status: "Active"
    },
    {
      id: 2,
      question: "How do I reset my password?",
      answer: "Click on 'Forgot Password' on the login page and follow the instructions.",
      category: "Account",
      status: "Active"
    },
    {
      id: 3,
      question: "What is the application deadline?",
      answer: "Application deadlines vary by position. Check the job posting for specific dates.",
      category: "Application",
      status: "Active"
    },
    {
      id: 4,
      question: "Can I apply for multiple positions?",
      answer: "Yes, you can apply for multiple positions that match your qualifications.",
      category: "Application",
      status: "Inactive"
    },
    {
      id: 5,
      question: "How do I update my contact information?",
      answer: "Go to your profile settings and update your contact details.",
      category: "Profile",
      status: "Active"
    },
    {
      id: 6,
      question: "What documents do I need to upload?",
      answer: "Typically, you'll need your resume, cover letter, and any relevant certificates.",
      category: "Documents",
      status: "Active"
    },
    {
      id: 7,
      question: "How long does the application process take?",
      answer: "The process typically takes 2-4 weeks from application to final decision.",
      category: "Process",
      status: "Active"
    },
    {
      id: 8,
      question: "Can I withdraw my application?",
      answer: "Yes, you can withdraw your application before the deadline.",
      category: "Application",
      status: "Active"
    },
    {
      id: 9,
      question: "What if I forget my username?",
      answer: "Use your email address to log in, or contact support for assistance.",
      category: "Account",
      status: "Active"
    }
  ];

  const totalFAQs = 78;
  const faqsPerPage = 10;
  const totalPages = Math.ceil(totalFAQs / faqsPerPage);

  // Define table columns
  const columns = [
    { key: "question", label: "Question", className: "w-1/5 min-w-0 max-w-0 break-words whitespace-normal leading-relaxed" },
    { key: "answer", label: "Answer", className: "w-2/5 min-w-0 max-w-0 break-words whitespace-normal leading-relaxed" },
    { key: "category", label: "Category", className: "w-1/5" },
    { key: "status", label: "Status", className: "w-1/5" }
  ];

  // Define filter options
  const filterOptions = [
    {
      label: "Filter By",
      value: filterBy,
      options: [
        { value: "Question", label: "Question" },
        { value: "Answer", label: "Answer" },
        { value: "Category", label: "Category" },
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

  const handleEdit = (faq: any) => {
    console.log("Edit FAQ:", faq);
    // Navigate to edit page or open modal
    navigate(`/edit-faq/${faq.id}`);
  };

  const handleDelete = (faq: any) => {
    console.log("Delete FAQ:", faq);
    // Show confirmation modal or delete directly
    if (window.confirm(`Are you sure you want to delete this FAQ?`)) {
      // Handle delete logic here
      console.log("FAQ deleted:", faq.id);
    }
  };

  const handleRefresh = () => {
    console.log("Refresh FAQs data");
    // Reload data from API
  };

  return (
    <>
      <PageMeta
        title="FAQs | Spearwin Admin"
        description="Manage FAQs"
      />
      
      {/* Title Bar */}
      <div className="px-30 py-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-900">FAQs</h1>
        </div>
      </div>

      <div className="px-30 py-4">
        <FilterBar
          filters={filterOptions}
          onRefresh={handleRefresh}
          actionButton={{
            label: "Add FAQs",
            onClick: () => navigate("/add-faq"),
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
          data={faqs}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalFAQs}
          itemsPerPage={faqsPerPage}
          onPageChange={setCurrentPage}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
}
