import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { countryService } from "../services/countryService";
import { UpdateCountryRequest } from "../services/types";

export default function EditCountry() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    name: "",
    iso2: "",
    iso3: "",
    numeric_code: "",
    phonecode: "",
    capital: "",
    currency: "",
    currency_name: "",
    currency_symbol: "",
    tld: "",
    native: "",
    region: "",
    region_id: null as number | null,
    subregion: "",
    subregion_id: null as number | null,
    nationality: "",
    latitude: "",
    longitude: "",
    isActive: true
  });

  // Fetch country data by ID
  const { data: countryData, isLoading: countryLoading, error: countryError } = useQuery({
    queryKey: ['country', id],
    queryFn: () => countryService.getCountryById(id!),
    enabled: !!id,
  });

  // Update country mutation
  const updateCountryMutation = useMutation({
    mutationFn: (updateData: UpdateCountryRequest) => countryService.updateCountry(updateData),
    onSuccess: () => {
      toast.success("Country updated successfully!");
      queryClient.invalidateQueries({ queryKey: ['countries'] });
      queryClient.invalidateQueries({ queryKey: ['country', id] });
      navigate('/countries');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to update country";
      toast.error(errorMessage);
      console.error("Error updating country:", error);
    }
  });

  // Update form data when country data is loaded
  useEffect(() => {
    if (countryData?.data) {
      setFormData({
        name: countryData.data.name || "",
        iso2: countryData.data.iso2 || "",
        iso3: countryData.data.iso3 || "",
        numeric_code: countryData.data.numeric_code || "",
        phonecode: countryData.data.phonecode || "",
        capital: countryData.data.capital || "",
        currency: countryData.data.currency || "",
        currency_name: countryData.data.currency_name || "",
        currency_symbol: countryData.data.currency_symbol || "",
        tld: countryData.data.tld || "",
        native: countryData.data.native || "",
        region: countryData.data.region || "",
        region_id: countryData.data.region_id || null,
        subregion: countryData.data.subregion || "",
        subregion_id: countryData.data.subregion_id || null,
        nationality: countryData.data.nationality || "",
        latitude: countryData.data.latitude || "",
        longitude: countryData.data.longitude || "",
        isActive: countryData.data.isActive
      });
    }
  }, [countryData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? (value === '' ? null : Number(value)) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) {
      toast.error("Country ID is missing");
      return;
    }

    // Validate required fields
    if (!formData.name.trim()) {
      toast.error("Country name is required");
      return;
    }

    if (!formData.iso2.trim()) {
      toast.error("ISO2 code is required");
      return;
    }

    if (!formData.iso3.trim()) {
      toast.error("ISO3 code is required");
      return;
    }

    if (!formData.region.trim()) {
      toast.error("Region is required");
      return;
    }

    const updateData: UpdateCountryRequest = {
      id: Number(id),
      name: formData.name.trim(),
      iso2: formData.iso2.trim(),
      iso3: formData.iso3.trim(),
      numeric_code: formData.numeric_code.trim(),
      phonecode: formData.phonecode.trim(),
      capital: formData.capital.trim(),
      currency: formData.currency.trim(),
      currency_name: formData.currency_name.trim(),
      currency_symbol: formData.currency_symbol.trim(),
      tld: formData.tld.trim(),
      native: formData.native.trim(),
      region: formData.region.trim(),
      region_id: formData.region_id,
      subregion: formData.subregion.trim(),
      subregion_id: formData.subregion_id,
      nationality: formData.nationality.trim(),
      latitude: formData.latitude.trim(),
      longitude: formData.longitude.trim(),
      isActive: formData.isActive
    };

    // Use the mutation to update the country
    updateCountryMutation.mutate(updateData);
  };

  // Loading state
  if (countryLoading) {
    return (
      <>
        <PageMeta title="Edit Country | Spearwin Admin Dashboard" description="Edit Country" />
        <div className="px-4 sm:px-6 lg:px-30 py-4">
          <div className="bg-white rounded-[10px] shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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
        <PageMeta title="Edit Country | Spearwin Admin Dashboard" description="Edit Country" />
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
        title="Edit Country | Spearwin Admin Dashboard"
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
            <div className="space-y-6">
              <h1 className="text-xl font-semibold text-gray-900 mb-6">Edit Country</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                </div>

                {/* Country Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter country name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Native Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Native Name
                  </label>
                  <input
                    type="text"
                    name="native"
                    value={formData.native}
                    onChange={handleInputChange}
                    placeholder="Enter native name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* ISO Codes */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">ISO Codes</h3>
                </div>

                {/* ISO2 Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ISO2 Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="iso2"
                    value={formData.iso2}
                    onChange={handleInputChange}
                    placeholder="e.g., US, CA, GB"
                    maxLength={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* ISO3 Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ISO3 Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="iso3"
                    value={formData.iso3}
                    onChange={handleInputChange}
                    placeholder="e.g., USA, CAN, GBR"
                    maxLength={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Numeric Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numeric Code
                  </label>
                  <input
                    type="text"
                    name="numeric_code"
                    value={formData.numeric_code}
                    onChange={handleInputChange}
                    placeholder="e.g., 840, 124, 826"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Phone Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Code
                  </label>
                  <input
                    type="text"
                    name="phonecode"
                    value={formData.phonecode}
                    onChange={handleInputChange}
                    placeholder="e.g., +1, +44, +86"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Location Information */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Location Information</h3>
                </div>

                {/* Region */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Region <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    placeholder="e.g., North America, Europe, Asia"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Subregion */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subregion
                  </label>
                  <input
                    type="text"
                    name="subregion"
                    value={formData.subregion}
                    onChange={handleInputChange}
                    placeholder="e.g., Northern America, Western Europe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Capital */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capital
                  </label>
                  <input
                    type="text"
                    name="capital"
                    value={formData.capital}
                    onChange={handleInputChange}
                    placeholder="e.g., Washington D.C., Ottawa"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Nationality */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nationality
                  </label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    placeholder="e.g., American, Canadian, British"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Currency Information */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Currency Information</h3>
                </div>

                {/* Currency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency Code
                  </label>
                  <input
                    type="text"
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    placeholder="e.g., USD, CAD, EUR"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Currency Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency Name
                  </label>
                  <input
                    type="text"
                    name="currency_name"
                    value={formData.currency_name}
                    onChange={handleInputChange}
                    placeholder="e.g., US Dollar, Canadian Dollar"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Currency Symbol */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency Symbol
                  </label>
                  <input
                    type="text"
                    name="currency_symbol"
                    value={formData.currency_symbol}
                    onChange={handleInputChange}
                    placeholder="e.g., $, C$, €"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* TLD */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Top Level Domain
                  </label>
                  <input
                    type="text"
                    name="tld"
                    value={formData.tld}
                    onChange={handleInputChange}
                    placeholder="e.g., .us, .ca, .uk"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Coordinates */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Geographic Coordinates</h3>
                </div>

                {/* Latitude */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude
                  </label>
                  <input
                    type="text"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    placeholder="e.g., 39.8283"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Longitude */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude
                  </label>
                  <input
                    type="text"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    placeholder="e.g., -98.5795"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Status */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Status</h3>
                </div>

                {/* Active Status */}
                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active Country</span>
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
                  disabled={updateCountryMutation.isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateCountryMutation.isPending ? 'Updating...' : 'Update Country'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
