import { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { useCountryMutations } from "../hooks/useCountryMutations";
import { CreateCountryRequest } from "../services/types";

export default function AddCountry() {
  const navigate = useNavigate();
  const { createCountryMutation } = useCountryMutations();
  const [formData, setFormData] = useState<CreateCountryRequest>({
    name: "",
    iso3: "",
    iso2: "",
    numeric_code: "",
    phonecode: "",
    capital: "",
    currency: "",
    currency_name: "",
    currency_symbol: "",
    tld: "",
    native: "",
    region: "",
    region_id: null,
    subregion: "",
    subregion_id: null,
    nationality: "",
    latitude: "",
    longitude: "",
    isActive: true
  });

  const handleInputChange = (field: keyof CreateCountryRequest, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name) {
      alert('Please enter a country name');
      return;
    }

    const countryData: CreateCountryRequest = {
      name: formData.name,
      iso3: "",
      iso2: "",
      numeric_code: "",
      phonecode: "",
      region: "",
      nationality: "",
      isActive: formData.isActive
    };

    console.log('Country Data:', countryData);
    createCountryMutation.mutate(countryData, {
      onSuccess: () => {
        navigate('/countries');
      }
    });
  };

  return (
    <>
      <PageMeta
        title="Add Country | spearwin-admin"
        description="Add new country"
      />
      
      {/* Title Bar */}
      <div className="px-4 sm:px-6 lg:px-30 ">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
          <PageBreadcrumb 
            items={[
              { label: "Dashboard", path: "/" },
              { label: "Countries", path: "/countries" },
              { label: "Add Country" }
            ]}
            showAdmin={true}
          />
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-30 py-4">
        <div className="bg-white rounded-[10px] shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              <h1 className="text-xl font-semibold text-gray-900 mb-6">Add New Country</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Country Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter country name"
                  />
                </div>

                {/* Active Status */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange("isActive", e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    Active
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/countries')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createCountryMutation.isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {createCountryMutation.isPending ? 'Adding...' : 'Add Country'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}