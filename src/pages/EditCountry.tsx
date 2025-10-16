import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { countryService } from "../services";
import { UpdateCountryRequest } from "../services/types";
import { useCountryMutations } from "../hooks/useCountryMutations";

export default function EditCountry() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    language: "",
    nationality: "",
    isDefault: false,
    isActive: true
  });

  // Fetch country data by ID
  const { data: countryData, isLoading: countryLoading, error: countryError } = useQuery({
    queryKey: ['country', id],
    queryFn: () => countryService.getCountryById(id!),
    enabled: !!id,
  });

  // Use the mutation from the hook
  const { updateCountryMutation } = useCountryMutations();

  // Update form data when country data is loaded
  useEffect(() => {
    if (countryData?.data) {
      setFormData({
        name: countryData.data.name,
        code: countryData.data.code,
        language: countryData.data.language,
        nationality: countryData.data.nationality,
        isDefault: countryData.data.isDefault,
        isActive: countryData.data.isActive
      });
    }
  }, [countryData]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) {
      toast.error("Country ID is missing");
      return;
    }

    // Validate form data
    if (!formData.name || !formData.code || !formData.language || !formData.nationality) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Create update data object
    const updateData: UpdateCountryRequest = {
      id,
      name: formData.name,
      code: formData.code,
      language: formData.language,
      nationality: formData.nationality,
      isDefault: formData.isDefault,
      isActive: formData.isActive
    };

    // Submit the form
    updateCountryMutation.mutate(updateData, {
      onSuccess: () => {
        navigate('/countries');
      }
    });
  };

  // Loading state
  if (countryLoading) {
    return (
      <>
        <PageMeta title="Edit Country | spearwin-admin" description="Edit Country" />
        <div className="px-4 sm:px-6 lg:px-30 py-4">
          <div className="bg-white rounded-[10px] shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-500"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (countryError) {
    return (
      <>
        <PageMeta title="Edit Country | spearwin-admin" description="Edit Country" />
        <div className="px-4 sm:px-6 lg:px-30 py-4">
          <div className="bg-white rounded-[10px] shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col items-center justify-center py-12">
              <svg className="w-16 h-16 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load country</h3>
              <p className="text-gray-500 mb-4">There was an error loading the country data.</p>
              <button 
                onClick={() => navigate('/countries')}
                className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Back to Countries
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title="Edit Country | spearwin-admin"
        description="Edit Country"
      />
      
      {/* Title Bar */}
      <div className="px-4 sm:px-6 lg:px-30 ">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
          <PageBreadcrumb 
            items={[
              { label: "Dashboard", path: "/" },
              { label: "Countries", path: "/countries" },
              { label: "Edit Country" }
            ]}
            showAdmin={true}
          />
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-30 py-4">
        <div className="bg-white rounded-[10px] shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Country Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter country name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Country Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => handleInputChange("code", e.target.value)}
                    placeholder="Enter country code (e.g., US, CA)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Language */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.language}
                    onChange={(e) => handleInputChange("language", e.target.value)}
                    placeholder="Enter language (e.g., English, Spanish)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={updateCountryMutation.isPending}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      updateCountryMutation.isPending
                        ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                        : 'bg-blue-900 hover:bg-blue-800 text-white'
                    }`}
                  >
                    {updateCountryMutation.isPending ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating Country...
                      </div>
                    ) : (
                      'Update Country'
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Nationality */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nationality <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nationality}
                    onChange={(e) => handleInputChange("nationality", e.target.value)}
                    placeholder="Enter nationality (e.g., American, Canadian)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Is Default */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isDefault}
                      onChange={(e) => handleInputChange("isDefault", e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Is Default Country</span>
                  </label>
                </div>

                {/* Active Status */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => handleInputChange("isActive", e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active</span>
                  </label>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}