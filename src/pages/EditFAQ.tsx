import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { useFaqMutations } from "../hooks/useFaqMutations";
import { faqService } from "../services/faqService";
import { UpdateFAQRequest } from "../services/types";
import { useQuery } from "@tanstack/react-query";

export default function EditFAQ() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { updateFaqMutation } = useFaqMutations();
  const [formData, setFormData] = useState({
    question: "",
    answer: ""
  });

  // Fetch FAQ data by ID
  const { data: faqResponse, isLoading: faqLoading, error: faqError } = useQuery({
    queryKey: ['faq', id],
    queryFn: async () => {
      if (!id) throw new Error('FAQ ID is required');
      const response = await faqService.getFAQById(id);
      return response;
    },
    enabled: !!id,
  });

  // Extract FAQ data from response
  let faq = null;
  if (faqResponse && typeof faqResponse === 'object') {
    const responseObj = faqResponse as any;
    if (responseObj.faq) {
      faq = responseObj.faq;
    } else if (responseObj.data) {
      faq = responseObj.data;
    } else {
      faq = responseObj;
    }
  }

  // Update form data when FAQ is loaded
  useEffect(() => {
    if (faq) {
      setFormData({
        question: faq.question || "",
        answer: faq.answer || ""
      });
    }
  }, [faq]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent duplicate submissions
    if (updateFaqMutation.isPending) {
      return;
    }
    
    if (!id) {
      alert("FAQ ID is missing");
      return;
    }

    // Validate form data
    if (!formData.question || !formData.answer) {
      alert("Please fill in all required fields");
      return;
    }

    // Create update data object
    const updateData: UpdateFAQRequest = {
      id,
      question: formData.question,
      answer: formData.answer
    };

    // Use the mutation to update the FAQ
    updateFaqMutation.mutate(updateData);
  };

  if (faqLoading) {
    return (
      <>
        <PageMeta
          title="Edit FAQ | spearwin-admin"
          description="Edit FAQ"
        />
        
        <div className="px-4 sm:px-6 lg:px-30 py-4">
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-gray-600">Loading FAQ...</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (faqError) {
    return (
      <>
        <PageMeta
          title="Edit FAQ | spearwin-admin"
          description="Edit FAQ"
        />
        
        <div className="px-4 sm:px-6 lg:px-30 py-4">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Failed to load FAQ</h3>
              <p className="mt-1 text-sm text-gray-500">Please try refreshing the page</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title="Edit FAQ | spearwin-admin"
        description="Edit FAQ"
      />
      
      {/* Title Bar */}
      <div className="px-4 sm:px-6 lg:px-30 ">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
          <PageBreadcrumb 
            items={[
              { label: "Dashboard", path: "/" },
              { label: "FAQs", path: "/faqs" },
              { label: "Edit FAQ" }
            ]}
            showAdmin={true}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-30 py-4">
        {/* Form Card */}
        <div className="bg-white rounded-[10px] shadow-sm border border-gray-200">
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6">
                {/* Question */}
                <div>
                  <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
                    Question
                  </label>
                  <input
                    type="text"
                    id="question"
                    name="question"
                    value={formData.question}
                    onChange={handleInputChange}
                    placeholder="Enter question"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Answer */}
                <div>
                  <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
                    Answer
                  </label>
                  <textarea
                    id="answer"
                    name="answer"
                    value={formData.answer}
                    onChange={handleInputChange}
                    placeholder="Enter detailed answer"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8 flex items-center gap-4">
                <button
                  type="submit"
                  disabled={updateFaqMutation.isPending}
                  className="bg-blue-900 hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                >
                  {updateFaqMutation.isPending ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    'Update FAQ'
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate("/faqs")}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
