import React, { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";

export default function AddCMS() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  const [formData, setFormData] = useState({
    pageSlug: "",
    topMenu: "",
    footerMenu: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    otherSeoTags: ""
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
    console.log("CMS Form Data:", formData);
    // Handle form submission here
    navigate("/cms");
  };


  return (
    <>
      <PageMeta
        title="Add CMS | spearwin-admin"
        description="Add new CMS page"
      />
      
      {/* Title Bar */}
      <div className="px-4 sm:px-6 lg:px-30 ">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
          <PageBreadcrumb 
            items={[
              { label: "Dashboard", path: "/" },
              { label: "CMS", path: "/cms" },
              { label: "Add CMS" }
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
            <h1 className="text-xl font-semibold text-gray-900">Add CMS</h1>
          </div>

          {/* Tabs */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab("details")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "details"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab("seo")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "seo"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                SEO
              </button>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6">
            {activeTab === "details" && (
              <div className="space-y-6">
                {/* Page Slug */}
                <div>
                  <label htmlFor="pageSlug" className="block text-sm font-medium text-gray-700 mb-2">
                    Page Slug
                  </label>
                  <input
                    type="text"
                    id="pageSlug"
                    name="pageSlug"
                    value={formData.pageSlug}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter company name"
                  />
                </div>

                {/* Show in top Menu */}
                <div>
                  <label htmlFor="topMenu" className="block text-sm font-medium text-gray-700 mb-2">
                    Show in top Menu
                  </label>
                  <select
                    id="topMenu"
                    name="topMenu"
                    value={formData.topMenu}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Yes or No</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                {/* Show in footer Menu */}
                <div>
                  <label htmlFor="footerMenu" className="block text-sm font-medium text-gray-700 mb-2">
                    Show in footer Menu
                  </label>
                  <select
                    id="footerMenu"
                    name="footerMenu"
                    value={formData.footerMenu}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Yes or No</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}

            {activeTab === "seo" && (
              <div className="space-y-6">
                {/* SEO Title */}
                <div>
                  <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    id="seoTitle"
                    name="seoTitle"
                    value={formData.seoTitle}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="SEO Title"
                  />
                </div>

                {/* SEO Description */}
                <div>
                  <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Description
                  </label>
                  <textarea
                    id="seoDescription"
                    name="seoDescription"
                    value={formData.seoDescription}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="SEO Description"
                  />
                </div>

                {/* SEO Keywords */}
                <div>
                  <label htmlFor="seoKeywords" className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Keywords
                  </label>
                  <textarea
                    id="seoKeywords"
                    name="seoKeywords"
                    value={formData.seoKeywords}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="SEO Keywords"
                  />
                </div>

                {/* Other SEO Tags */}
                <div>
                  <label htmlFor="otherSeoTags" className="block text-sm font-medium text-gray-700 mb-2">
                    Other SEO Tags
                  </label>
                  <textarea
                    id="otherSeoTags"
                    name="otherSeoTags"
                    value={formData.otherSeoTags}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Other SEO Tags"
                  />
                </div>

                {/* Update Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Update
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
