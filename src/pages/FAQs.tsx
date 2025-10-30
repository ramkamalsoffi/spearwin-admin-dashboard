import { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { faqService } from "../services/faqService";
import { useFaqMutations } from "../hooks/useFaqMutations";
import { FAQ } from "../services/types";

export default function FAQs() {
  const navigate = useNavigate();
  const { deleteFaqMutation, updateFaqMutation } = useFaqMutations();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterBy, setFilterBy] = useState("Question");
  const [orderType, setOrderType] = useState("Order Type");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFaq, setSelectedFaq] = useState<FAQ | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFaqLoading, setIsFaqLoading] = useState(false);
  const [faqLoadError, setFaqLoadError] = useState<string | null>(null);
  const faqsPerPage = 10;

  // Fetch FAQs data from API
  const { data: faqsResponse, isLoading, error, refetch } = useQuery({
    queryKey: ['faqs', currentPage, filterBy, orderType, searchTerm],
    queryFn: async () => {
      const response = await faqService.getFAQs();
      return response;
    },
  });

  // Extract FAQs from response - handle the specific API structure
  let faqs: FAQ[] = [];
  
  if (faqsResponse && typeof faqsResponse === 'object') {
    const responseObj = faqsResponse as any;
    if (responseObj.faqs && Array.isArray(responseObj.faqs)) {
      faqs = responseObj.faqs;
    }
  } else if (Array.isArray(faqsResponse)) {
    faqs = faqsResponse;
  }

  const totalFAQs = faqs.length;
  const totalPages = Math.ceil(totalFAQs / faqsPerPage);

  // Filter and sort FAQs
  const filteredFAQs = faqs
    .filter((faq: FAQ) => {
      if (searchTerm) {
        return faq.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               faq.answer?.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return true;
    })
    .sort((a: FAQ, b: FAQ) => {
      if (filterBy === "Question") {
        const aValue = a.question?.toLowerCase() || '';
        const bValue = b.question?.toLowerCase() || '';
        return orderType === "Ascending" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      if (filterBy === "Answer") {
        const aValue = a.answer?.toLowerCase() || '';
        const bValue = b.answer?.toLowerCase() || '';
        return orderType === "Ascending" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      return 0;
    });

  const paginatedFAQs = filteredFAQs.slice(
    (currentPage - 1) * faqsPerPage,
    currentPage * faqsPerPage
  );

  const handleView = async (faq: FAQ) => {
    setIsViewModalOpen(true);
    setIsFaqLoading(true);
    setFaqLoadError(null);
    try {
      const response = await faqService.getFAQById(String(faq.id));
      const resp: any = response;
      const detailed: FAQ = resp?.data || resp?.faq || resp;
      setSelectedFaq(detailed || faq);
    } catch (e: any) {
      console.error('Error loading FAQ details:', e);
      setFaqLoadError(e?.message || 'Failed to load FAQ details');
      setSelectedFaq(faq);
    } finally {
      setIsFaqLoading(false);
    }
  };

  const handleEdit = (faq: FAQ) => {
    console.log("Edit FAQ:", faq);
    navigate(`/edit-faq/${faq.id}`);
  };

  const handleDelete = (faq: FAQ) => {
    if (window.confirm(`Are you sure you want to delete "${faq.question}"?`)) {
      deleteFaqMutation.mutate(faq.id.toString());
    }
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setSelectedFaq(null);
  };

  const handleRefresh = () => {
    refetch();
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
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Filter By</span>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  {/* Search Input */}
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Search FAQs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 pl-10 rounded-[20px] bg-white/30 border border-white/40 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/30"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <select 
                      value={filterBy}
                      onChange={(e) => setFilterBy(e.target.value)}
                      className="appearance-none rounded-[20px] px-4 py-2 pr-8 text-sm bg-white/30 border border-white/40 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
                    >
                      <option>Question</option>
                      <option>Answer</option>
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

                  <button className="p-2 text-gray-400 hover:text-gray-600" onClick={handleRefresh}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <button 
                onClick={() => navigate("/add-faq")}
                className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Add FAQ
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-gray-600">Loading FAQs...</span>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Failed to load FAQs</h3>
                  <p className="mt-1 text-sm text-gray-500">Please try refreshing the page</p>
                </div>
              </div>
            ) : paginatedFAQs.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No FAQs found</h3>
                  <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters</p>
                </div>
              </div>
            ) : (
              <Table className="w-full min-w-[700px]">
                <TableHeader>
                  <TableRow className="bg-blue-50 mx-4">
                    <TableCell isHeader className="rounded-l-[20px] pl-6 pr-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Question</TableCell>
                    <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Answer</TableCell>
                    <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Status</TableCell>
                    <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Created</TableCell>
                    <TableCell isHeader className="rounded-r-[20px] pl-3 pr-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Action</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white divide-y divide-gray-200">
                  {paginatedFAQs.map((faq: FAQ) => (
                    <tr key={faq.id} className="hover:bg-gray-50">
                      <td className="pl-6 pr-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{faq.question}</td>
                      <td className="px-3 py-3 whitespace-normal text-sm text-gray-500 leading-relaxed max-w-xs">{faq.answer}</td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          faq.active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {faq.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                        {new Date(faq.createdAt).toLocaleDateString()}
                      </td>
                      <td className="pl-3 pr-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <button className="p-1 text-green-600 hover:text-green-800" onClick={() => handleView(faq)} title="View FAQ">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button className="p-1 text-blue-600 hover:text-blue-800" onClick={() => handleEdit(faq)} title="Edit FAQ">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button className="p-1 text-red-600 hover:text-red-800" onClick={() => handleDelete(faq)} title="Delete FAQ">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                          {/* Toggle Active (after Delete) */}
                          <label className="relative inline-flex items-center cursor-pointer ml-1">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={!!faq.active}
                              onChange={() => updateFaqMutation.mutate({ id: String(faq.id), active: !faq.active })}
                            />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </td>
                    </tr>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Pagination */}
          {!isLoading && !error && filteredFAQs.length > 0 && (
            <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {((currentPage - 1) * faqsPerPage) + 1}-{Math.min(currentPage * faqsPerPage, filteredFAQs.length)} of {filteredFAQs.length}
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
          )}
        </div>
      </div>

      {/* View FAQ Modal */}
      {isViewModalOpen && selectedFaq && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={handleCloseModal}
            ></div>
            
            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">FAQ Details</h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {isFaqLoading && (
                  <div className="flex items-center justify-center py-10 text-gray-600">
                    <svg className="animate-spin h-5 w-5 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading FAQ details...
                  </div>
                )}
                {faqLoadError && !isFaqLoading && (
                  <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded">
                    {faqLoadError}
                  </div>
                )}
                {/* Question */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-900 leading-relaxed">{selectedFaq?.question || '—'}</p>
                  </div>
                </div>

                {/* Answer */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Answer</label>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">{selectedFaq?.answer || '—'}</p>
                  </div>
                </div>

                {/* Status and Created Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <div className="flex items-center">
                      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                        selectedFaq?.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedFaq?.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Created Date</label>
                    <div className="text-gray-900">
                      {selectedFaq?.createdAt ? new Date(selectedFaq.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : '—'}
                    </div>
                  </div>
                </div>

                {/* Updated Date if available */}
                {selectedFaq?.updatedAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Updated</label>
                    <div className="text-gray-900">
                      {new Date(selectedFaq.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
                
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
