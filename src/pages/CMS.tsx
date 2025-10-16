import { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../components/ui/table";

export default function CMS() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"cms" | "translated">("cms");
  const [filterBy, setFilterBy] = useState("Date");
  const [orderType, setOrderType] = useState("Order Type");
  const [orderStatus, setOrderStatus] = useState("Order Status");

  const handleRefresh = () => {
    // Refresh logic here
    console.log("Refreshing CMS data...");
  };

  const handleAddCMS = () => {
    if (activeTab === "translated") {
      navigate("/add-translated-page");
    } else {
      navigate("/add-cms");
    }
  };

  const handleEdit = (pageId: string) => {
    console.log("Edit page:", pageId);
    // Navigate to edit page
  };

  const handleDelete = (pageId: string) => {
    console.log("Delete page:", pageId);
    // Delete confirmation logic
  };

  // Sample data - replace with actual API data
  const cmsData = [
    { id: "23432", slug: "Terms-of-Use", topMenu: "Yes", footerMenu: "Yes" },
    { id: "23433", slug: "Privacy-Policy", topMenu: "Yes", footerMenu: "No" },
    { id: "23434", slug: "About-Us", topMenu: "No", footerMenu: "Yes" },
    { id: "23435", slug: "Contact-Us", topMenu: "Yes", footerMenu: "Yes" },
    { id: "23436", slug: "Help-Center", topMenu: "No", footerMenu: "Yes" },
    { id: "23437", slug: "FAQ", topMenu: "Yes", footerMenu: "No" },
    { id: "23438", slug: "Blog", topMenu: "No", footerMenu: "Yes" },
    { id: "23439", slug: "News", topMenu: "Yes", footerMenu: "Yes" },
    { id: "23440", slug: "Careers", topMenu: "No", footerMenu: "Yes" },
  ];

  // Sample translated pages data
  const translatedPages = [
    { id: "23432", cmsPage: "Terms-of-Use", pageTitle: "Terms & Condition", language: "English" },
    { id: "23433", cmsPage: "Privacy-Policy", pageTitle: "Privacy Policy", language: "English" },
    { id: "23434", cmsPage: "About-Us", pageTitle: "About Us", language: "English" },
    { id: "23435", cmsPage: "Contact-Us", pageTitle: "Contact Us", language: "English" },
    { id: "23436", cmsPage: "Help-Center", pageTitle: "Help Center", language: "English" },
    { id: "23437", cmsPage: "FAQ", pageTitle: "FAQ", language: "English" },
    { id: "23438", cmsPage: "Blog", pageTitle: "Blog", language: "English" },
    { id: "23439", cmsPage: "News", pageTitle: "News", language: "English" },
    { id: "23440", cmsPage: "Careers", pageTitle: "Careers", language: "English" },
  ];


  return (
    <>
      <PageMeta
        title="CMS | spearwin-admin"
        description="Content Management System"
      />
      
      {/* Title Bar */}
      <div className="px-4 sm:px-6 lg:px-30 ">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
          <PageBreadcrumb 
            items={[
              { label: "Dashboard", path: "/" },
              { label: "CMS" }
            ]}
            showAdmin={true}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-30 py-4">
        
        {/* CMS Table */}
        <div className="bg-white rounded-[10px] shadow-sm border border-gray-200">
          {/* CMS Tabs */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab("cms")}
                  className={`pb-2 text-sm font-medium ${
                    activeTab === "cms"
                      ? "text-blue-900 border-b-2 border-blue-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  CMS
                </button>
                <button
                  onClick={() => setActiveTab("translated")}
                  className={`pb-2 text-sm font-medium ${
                    activeTab === "translated"
                      ? "text-blue-900 border-b-2 border-blue-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Translated Pages
                </button>
            </div>
          </div>
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
                    <option>Date</option>
                    <option>Page Slug</option>
                    <option>Top Menu</option>
                    <option>Footer Menu</option>
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
                onClick={handleAddCMS}
                className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {activeTab === "translated" ? "Add Page" : "Add CMS"}
              </button>
            </div>
          </div>
        
          <div className="overflow-x-auto">
            {activeTab === "cms" ? (
              <Table className="w-full min-w-[700px]">
                <TableHeader>
                  <TableRow className="bg-blue-50 mx-4">
                    <TableCell isHeader className="rounded-l-[20px] pl-8 pr-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        CMS
                      </div>
                    </TableCell>
                    <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Page Slug</TableCell>
                    <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Top Menu</TableCell>
                    <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Footer Menu</TableCell>
                    <TableCell isHeader className="rounded-r-[20px] pl-3 pr-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Action</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white divide-y divide-gray-200">
                  {cmsData.map((page) => (
                    <tr key={page.id} className="hover:bg-gray-50">
                      <td className="pl-6 pr-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{page.id}</td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">{page.slug}</td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          page.topMenu === 'Yes' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {page.topMenu}
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          page.footerMenu === 'Yes' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {page.footerMenu}
                        </span>
                      </td>
                      <td className="pl-3 pr-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleEdit(page.id)}
                            className="p-1 text-blue-600 hover:text-blue-800"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleDelete(page.id)}
                            className="p-1 text-red-600 hover:text-red-800"
                          >
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
            ) : (
              <Table className="w-full min-w-[700px]">
                <TableHeader>
                  <TableRow className="bg-blue-50 mx-4">
                    <TableCell isHeader className="rounded-l-[20px] pl-8 pr-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Translated Pages
                      </div>
                    </TableCell>
                    <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">CMS Page</TableCell>
                    <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Page Title</TableCell>
                    <TableCell isHeader className="px-3 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Language</TableCell>
                    <TableCell isHeader className="rounded-r-[20px] pl-3 pr-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wide">Action</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white divide-y divide-gray-200">
                  {translatedPages.map((page) => (
                    <tr key={page.id} className="hover:bg-gray-50">
                      <td className="pl-6 pr-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{page.id}</td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">{page.cmsPage}</td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">{page.pageTitle}</td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">{page.language}</td>
                      <td className="pl-3 pr-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleEdit(page.id)}
                            className="p-1 text-blue-600 hover:text-blue-800"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleDelete(page.id)}
                            className="p-1 text-red-600 hover:text-red-800"
                          >
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
            )}
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing 1-09 of 78
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
