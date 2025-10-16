import React, { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";

export default function AddTranslatedPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    language: "",
    pageTitle: "",
    cmsPage: "",
    pageContent: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Translated Page Form Data:", formData);
    // Handle form submission here
    navigate("/cms");
  };


  // Sample CMS pages for dropdown
  const cmsPages = [
    { value: "terms-of-use", label: "Terms of Use" },
    { value: "privacy-policy", label: "Privacy Policy" },
    { value: "about-us", label: "About Us" },
    { value: "contact-us", label: "Contact Us" },
    { value: "help-center", label: "Help Center" },
    { value: "faq", label: "FAQ" },
    { value: "blog", label: "Blog" },
    { value: "news", label: "News" },
    { value: "careers", label: "Careers" }
  ];

  return (
    <>
      <PageMeta
        title="Add Pages | spearwin-admin"
        description="Add new translated page"
      />
      
      {/* Title Bar */}
      <div className="px-4 sm:px-6 lg:px-30 ">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
          <PageBreadcrumb 
            items={[
              { label: "Dashboard", path: "/" },
              { label: "CMS", path: "/cms" },
              { label: "Add Pages" }
            ]}
            showAdmin={true}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-30 py-4">
        <div className="bg-white rounded-[10px] shadow-sm border border-gray-200">
          {/* Header with Title */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-900">Add Pages</h1>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Language */}
                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <input
                    type="text"
                    id="language"
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter company name"
                    required
                  />
                </div>

                {/* Page Title */}
                <div>
                  <label htmlFor="pageTitle" className="block text-sm font-medium text-gray-700 mb-2">
                    Page Title
                  </label>
                  <input
                    type="text"
                    id="pageTitle"
                    name="pageTitle"
                    value={formData.pageTitle}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter tittle"
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Submit
                  </button>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* CMS Page */}
                <div>
                  <label htmlFor="cmsPage" className="block text-sm font-medium text-gray-700 mb-2">
                    CMS Page
                  </label>
                  <select
                    id="cmsPage"
                    name="cmsPage"
                    value={formData.cmsPage}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select page</option>
                    {cmsPages.map((page) => (
                      <option key={page.value} value={page.value}>
                        {page.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Page Content */}
                <div>
                  <label htmlFor="pageContent" className="block text-sm font-medium text-gray-700 mb-2">
                    Page Content
                  </label>
                  <textarea
                    id="pageContent"
                    name="pageContent"
                    value={formData.pageContent}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter Content"
                    required
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
