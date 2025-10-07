import { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../components/ui/table";

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

  // Filters handled inline below to match standardized layout

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
        title="FAQs | spearwin-admin"
        description="Manage FAQs"
      />
      
      {/* Title Bar */}
      <div className="px-4 sm:px-6 lg:px-30 ">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
          <PageBreadcrumb 
            items={[
              { label: "Dashboard", path: "/" },
              { label: "FAQs" }
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
                    <option>Question</option>
                    <option>Answer</option>
                    <option>Category</option>
                    <option>Status</option>
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
                onClick={() => navigate("/add-faq")}
                className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Add FAQs
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table className="w-full min-w-[700px]">
              <TableHeader>
                <TableRow className="bg-muted/30 bg-gray-100 mx-4">
                  <TableCell isHeader className="rounded-l-[20px] pl-6 pr-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Question</TableCell>
                  <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Answer</TableCell>
                  <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Category</TableCell>
                  <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Status</TableCell>
                  <TableCell isHeader className="rounded-r-[20px] pl-3 pr-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Action</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white divide-y divide-gray-200">
                {faqs.map((faq) => (
                  <tr key={faq.id} className="hover:bg-gray-50">
                    <td className="pl-6 pr-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{faq.question}</td>
                    <td className="px-3 py-3 whitespace-normal text-sm text-gray-500 leading-relaxed">{faq.answer}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">{faq.category}</td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        faq.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : faq.status === 'Pending'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {faq.status}
                      </span>
                    </td>
                    <td className="pl-3 pr-6 py-3 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <button className="p-1 text-blue-600 hover:text-blue-800" onClick={() => handleEdit(faq)}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button className="p-1 text-red-600 hover:text-red-800" onClick={() => handleDelete(faq)}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing 1-{faqsPerPage} of {totalFAQs}
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
