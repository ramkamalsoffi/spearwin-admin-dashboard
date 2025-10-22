import { useState } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { companyService } from "../services";
import { CreateCompanyRequest } from "../services/types";

export default function AddCompany() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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


  // TanStack Query mutation for creating company
  const createCompanyMutation = useMutation({
    mutationFn: (companyData: CreateCompanyRequest) => companyService.createCompany(companyData),
    onSuccess: () => {
      toast.success("Company created successfully!");
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      navigate('/companies');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to create company";
      toast.error(errorMessage);
      console.error("Error creating company:", error);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim()) {
      toast.error("Company name is required");
      return;
    }
    
    if (!formData.slug.trim()) {
      toast.error("Company slug is required");
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error("Company description is required");
      return;
    }
    
    if (!formData.website.trim()) {
      toast.error("Company website is required");
      return;
    }
    
    if (!formData.industry) {
      toast.error("Please select an industry");
      return;
    }
    
    if (!formData.employeeCount) {
      toast.error("Please select employee count");
      return;
    }
    
    if (!formData.headquarters.trim()) {
      toast.error("Headquarters is required");
      return;
    }
    
    
    if (!formData.address.trim()) {
      toast.error("Address is required");
      return;
    }
    
    const companyData: CreateCompanyRequest = {
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      description: formData.description.trim(),
      website: formData.website.trim(),
      logo: formData.logo || undefined,
      industry: formData.industry,
      foundedYear: formData.foundedYear,
      employeeCount: formData.employeeCount,
      headquarters: formData.headquarters.trim(),
      address: formData.address.trim(),
      linkedinUrl: formData.linkedinUrl || undefined,
      twitterUrl: formData.twitterUrl || undefined,
      facebookUrl: formData.facebookUrl || undefined,
      isVerified: formData.isVerified,
      isActive: formData.isActive
    };

    console.log('📤 Submitting company data:', companyData);
    createCompanyMutation.mutate(companyData);
  };

  return (
    <>
      <PageMeta
        title="Add Company | spearwin-admin"
        description="Add new company"
      />
      
      {/* Title Bar */}
      <div className="px-4 sm:px-6 lg:px-30 ">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
          <PageBreadcrumb 
            items={[
              { label: "Dashboard", path: "/" },
              { label: "Companies", path: "/companies" },
              { label: "Add Company" }
            ]}
            showAdmin={true}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-30 py-2">
        {/* Form Card */}
        <div className="bg-white rounded-[10px] shadow-sm border border-gray-200">
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter company name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Slug */}
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="company-slug"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter company description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Website */}
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                    Website <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://www.company.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Logo */}
                <div>
                  <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-2">
                    Logo URL
                  </label>
                  <input
                    type="url"
                    id="logo"
                    name="logo"
                    value={formData.logo}
                    onChange={handleInputChange}
                    placeholder="https://cdn.example.com/logo.png"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Industry */}
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                    Industry <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                    required
                  >
                    <option value="">Select industry</option>
                    <option value="Technology">Technology</option>
                    <option value="Software">Software</option>
                    <option value="Research">Research</option>
                    <option value="Consulting">Consulting</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="Analytics">Analytics</option>
                    <option value="Cloud Services">Cloud Services</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Founded Year */}
                <div>
                  <label htmlFor="foundedYear" className="block text-sm font-medium text-gray-700 mb-2">
                    Founded Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="foundedYear"
                    name="foundedYear"
                    value={formData.foundedYear}
                    onChange={handleInputChange}
                    min="1800"
                    max={new Date().getFullYear()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Employee Count */}
                <div>
                  <label htmlFor="employeeCount" className="block text-sm font-medium text-gray-700 mb-2">
                    Employee Count <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="employeeCount"
                    name="employeeCount"
                    value={formData.employeeCount}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                    required
                  >
                    <option value="">Select employee count</option>
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-100">51-100</option>
                    <option value="101-500">101-500</option>
                    <option value="501-1000">501-1000</option>
                    <option value="1000+">1000+</option>
                  </select>
                </div>

                {/* Headquarters */}
                <div>
                  <label htmlFor="headquarters" className="block text-sm font-medium text-gray-700 mb-2">
                    Headquarters <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="headquarters"
                    name="headquarters"
                    value={formData.headquarters}
                    onChange={handleInputChange}
                    placeholder="San Francisco, CA"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>


                {/* Address */}
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Tech Street, Suite 100, San Francisco, CA 94105"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Social Media Links */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">Social Media Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* LinkedIn */}
                    <div>
                      <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700 mb-2">
                        LinkedIn URL
                      </label>
                      <input
                        type="url"
                        id="linkedinUrl"
                        name="linkedinUrl"
                        value={formData.linkedinUrl}
                        onChange={handleInputChange}
                        placeholder="https://linkedin.com/company/company"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Twitter */}
                    <div>
                      <label htmlFor="twitterUrl" className="block text-sm font-medium text-gray-700 mb-2">
                        Twitter URL
                      </label>
                      <input
                        type="url"
                        id="twitterUrl"
                        name="twitterUrl"
                        value={formData.twitterUrl}
                        onChange={handleInputChange}
                        placeholder="https://twitter.com/company"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Facebook */}
                    <div>
                      <label htmlFor="facebookUrl" className="block text-sm font-medium text-gray-700 mb-2">
                        Facebook URL
                      </label>
                      <input
                        type="url"
                        id="facebookUrl"
                        name="facebookUrl"
                        value={formData.facebookUrl}
                        onChange={handleInputChange}
                        placeholder="https://facebook.com/company"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Status Checkboxes */}
                <div className="md:col-span-2">
                  <div className="flex space-x-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isVerified"
                        checked={formData.isVerified}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Verified Company</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Active Company</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={createCompanyMutation.isPending}
                  className="bg-blue-900 hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {createCompanyMutation.isPending ? "Creating Company..." : "Create Company"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
