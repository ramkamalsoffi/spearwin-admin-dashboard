import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { companyService } from "../services";
import { UpdateCompanyRequest } from "../services/types";

export default function EditCompany() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    website: "",
    logo: "",
    industry: "",
    foundedYear: new Date().getFullYear(),
    employeeCount: "",
    headquarters: "",
    address: "",
    linkedinUrl: "",
    twitterUrl: "",
    facebookUrl: "",
    isVerified: false,
    isActive: true
  });

  // Fetch company data by ID
  const { data: companyResponse, isLoading: companyLoading, error: companyError } = useQuery({
    queryKey: ['company', id],
    queryFn: async () => {
      if (!id) throw new Error('Company ID is required');
      const response = await companyService.getCompanyById(id);
      return response;
    },
    enabled: !!id,
  });

  // Extract company data from response
  let company = null;
  if (companyResponse && typeof companyResponse === 'object') {
    const responseObj = companyResponse as any;
    if (responseObj.company) {
      company = responseObj.company;
    } else if (responseObj.data) {
      company = responseObj.data;
    } else {
      company = responseObj;
    }
  }

  // Update form data when company data is loaded
  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || "",
        slug: company.slug || "",
        description: company.description || "",
        website: company.website || "",
        logo: company.logo || "",
        industry: company.industry || "",
        foundedYear: company.foundedYear || new Date().getFullYear(),
        employeeCount: company.employeeCount || "",
        headquarters: company.headquarters || "",
        address: company.address || "",
        linkedinUrl: company.linkedinUrl || "",
        twitterUrl: company.twitterUrl || "",
        facebookUrl: company.facebookUrl || "",
        isVerified: company.isVerified || false,
        isActive: company.isActive || false
      });
    }
  }, [company]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) {
      toast.error("Company ID is missing");
      return;
    }

    // Validate required fields
    if (!formData.name.trim()) {
      toast.error("Company name is required");
      return;
    }

    if (!formData.industry.trim()) {
      toast.error("Industry is required");
      return;
    }

    const updateData: UpdateCompanyRequest = {
      id: id,
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      description: formData.description.trim(),
      website: formData.website.trim(),
      logo: formData.logo.trim(),
      industry: formData.industry.trim(),
      foundedYear: formData.foundedYear,
      employeeCount: formData.employeeCount.trim(),
      headquarters: formData.headquarters.trim(),
      address: formData.address.trim(),
      linkedinUrl: formData.linkedinUrl.trim(),
      twitterUrl: formData.twitterUrl.trim(),
      facebookUrl: formData.facebookUrl.trim(),
      isVerified: formData.isVerified,
      isActive: formData.isActive
    };

    // Call the update API
    companyService.updateCompany(updateData)
      .then(() => {
        toast.success("Company updated successfully!");
        navigate('/companies');
      })
      .catch((error: any) => {
        const errorMessage = error.response?.data?.message || "Failed to update company";
        toast.error(errorMessage);
        console.error("Error updating company:", error);
      });
  };

  // Loading state
  if (companyLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-gray-600">Loading company...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (companyError) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Failed to load company</h3>
          <p className="mt-1 text-sm text-gray-500">{(companyError as any).message || "An unknown error occurred."}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Edit Company | Spearwin Admin Dashboard"
        description="Edit Company"
      />
      
      {/* Title Bar */}
      <div className="px-4 sm:px-6 lg:px-30 ">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
          <PageBreadcrumb 
            items={[
              { label: "Dashboard", path: "/" },
              { label: "Companies", path: "/companies" },
              { label: "Edit Company" }
            ]}
            showAdmin={true}
          />
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-30 py-4">
        <div className="bg-white rounded-[10px] shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              <h1 className="text-xl font-semibold text-gray-900 mb-6">Edit Company</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter company name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Industry */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    placeholder="Enter industry"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Website */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Founded Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Founded Year
                  </label>
                  <input
                    type="number"
                    name="foundedYear"
                    value={formData.foundedYear}
                    onChange={handleInputChange}
                    min="1800"
                    max={new Date().getFullYear()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Employee Count */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee Count
                  </label>
                  <input
                    type="text"
                    name="employeeCount"
                    value={formData.employeeCount}
                    onChange={handleInputChange}
                    placeholder="e.g., 1-10, 11-50, 51-200"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Headquarters */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Headquarters
                  </label>
                  <input
                    type="text"
                    name="headquarters"
                    value={formData.headquarters}
                    onChange={handleInputChange}
                    placeholder="Enter headquarters location"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter company address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* LinkedIn URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/company/example"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Twitter URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Twitter URL
                  </label>
                  <input
                    type="url"
                    name="twitterUrl"
                    value={formData.twitterUrl}
                    onChange={handleInputChange}
                    placeholder="https://twitter.com/example"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Facebook URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    name="facebookUrl"
                    value={formData.facebookUrl}
                    onChange={handleInputChange}
                    placeholder="https://facebook.com/example"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Enter company description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Status Checkboxes */}
                <div className="md:col-span-2 flex gap-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isVerified"
                      checked={formData.isVerified}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">Verified Company</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">Active Company</label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate("/companies")}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Update Company
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
