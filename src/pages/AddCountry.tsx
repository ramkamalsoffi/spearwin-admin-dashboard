import { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { useCountryMutations } from "../hooks/useCountryMutations";
import { CreateCountryRequest } from "../services/types";


export default function AddCountry() {
  const navigate = useNavigate();
  const { createCountryMutation } = useCountryMutations();
  const [formData, setFormData] = useState({
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
    region_id: 0,
    subregion: "",
    subregion_id: 0,
    nationality: "",
    latitude: "",
    longitude: "",
    isActive: true
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const countryData: CreateCountryRequest = {
      name: formData.name,
      iso3: formData.iso3,
      iso2: formData.iso2,
      numeric_code: formData.numeric_code,
      phonecode: formData.phonecode,
      capital: formData.capital,
      currency: formData.currency,
      currency_name: formData.currency_name,
      currency_symbol: formData.currency_symbol,
      tld: formData.tld,
      native: formData.native,
      region: formData.region,
      region_id: formData.region_id,
      subregion: formData.subregion,
      subregion_id: formData.subregion_id,
      nationality: formData.nationality,
      latitude: formData.latitude,
      longitude: formData.longitude,
      isActive: formData.isActive,
    };

    createCountryMutation.mutate(countryData);
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
                {/* Basic Information */}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nationality *
                  </label>
                  <input
                    type="text"
                    value={formData.nationality}
                    onChange={(e) => handleInputChange("nationality", e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter nationality (e.g., Afghan, American)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Region *
                  </label>
                  <input
                    type="text"
                    value={formData.region}
                    onChange={(e) => handleInputChange("region", e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter region (e.g., Asia, Europe, Africa)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subregion
                  </label>
                  <input
                    type="text"
                    value={formData.subregion}
                    onChange={(e) => handleInputChange("subregion", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter subregion (e.g., Southern Asia)"
                  />
                </div>

                {/* ISO Codes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ISO2 Code *
                  </label>
                  <input
                    type="text"
                    value={formData.iso2}
                    onChange={(e) => handleInputChange("iso2", e.target.value)}
                    required
                    maxLength={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., AF, US, IN"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ISO3 Code *
                  </label>
                  <input
                    type="text"
                    value={formData.iso3}
                    onChange={(e) => handleInputChange("iso3", e.target.value)}
                    required
                    maxLength={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., AFG, USA, IND"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numeric Code
                  </label>
                  <input
                    type="text"
                    value={formData.numeric_code}
                    onChange={(e) => handleInputChange("numeric_code", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 004, 840, 356"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Code
                  </label>
                  <input
                    type="text"
                    value={formData.phonecode}
                    onChange={(e) => handleInputChange("phonecode", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 93, 1, 91"
                  />
                </div>

                {/* Capital and Currency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capital
                  </label>
                  <input
                    type="text"
                    value={formData.capital}
                    onChange={(e) => handleInputChange("capital", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Kabul, Washington D.C."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <input
                    type="text"
                    value={formData.currency}
                    onChange={(e) => handleInputChange("currency", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., AFN, USD, INR"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency Name
                  </label>
                  <input
                    type="text"
                    value={formData.currency_name}
                    onChange={(e) => handleInputChange("currency_name", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Afghan afghani, US Dollar"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency Symbol
                  </label>
                  <input
                    type="text"
                    value={formData.currency_symbol}
                    onChange={(e) => handleInputChange("currency_symbol", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., ؋, $, ₹"
                  />
                </div>

                {/* Additional Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Top Level Domain
                  </label>
                  <input
                    type="text"
                    value={formData.tld}
                    onChange={(e) => handleInputChange("tld", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., .af, .us, .in"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Native Name
                  </label>
                  <input
                    type="text"
                    value={formData.native}
                    onChange={(e) => handleInputChange("native", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Native name in local language"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude
                  </label>
                  <input
                    type="text"
                    value={formData.latitude}
                    onChange={(e) => handleInputChange("latitude", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 33.00000000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude
                  </label>
                  <input
                    type="text"
                    value={formData.longitude}
                    onChange={(e) => handleInputChange("longitude", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 65.00000000"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange("isActive", e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Active Country
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate("/countries")}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createCountryMutation.isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {createCountryMutation.isPending ? "Creating..." : "Create Country"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

