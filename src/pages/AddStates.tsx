import { useState } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import PageMeta from "../components/common/PageMeta";
import { statesService } from "../services";
import { CreateStateRequest } from "../services/types";
import { useCountryQueries } from "../hooks/useCountryQueries";

// Dropdown Input Component
const DropdownInput = ({ 
  placeholder, 
  value, 
  onChange, 
  options 
}: { 
  placeholder: string; 
  value: string; 
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default function AddStates() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { useCountries } = useCountryQueries();
  const { data: countriesResponse, isLoading: isCountriesLoading, isError: isCountriesError } = useCountries();
  
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    countryId: "",
    isActive: true
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // TanStack Query mutation for creating state
  const createStateMutation = useMutation({
    mutationFn: (stateData: CreateStateRequest) => statesService.createState(stateData),
    onSuccess: () => {
      toast.success("State created successfully!");
      queryClient.invalidateQueries({ queryKey: ['states'] });
      navigate('/states');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to create state";
      toast.error(errorMessage);
      console.error("Error creating state:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const stateData: CreateStateRequest = {
      name: formData.name,
      code: formData.code,
      countryId: parseInt(formData.countryId) || Number(formData.countryId),
      isActive: formData.isActive,
    };

    createStateMutation.mutate(stateData);
  };

  // Dropdown options - fetched from API
  const countryOptions = (() => {
    if (isCountriesLoading) {
      return [{ value: "", label: "Loading countries..." }];
    }
    if (isCountriesError) {
      return [{ value: "", label: "Failed to load countries" }];
    }
    // API returns array directly, not wrapped in data property
    const countries = Array.isArray(countriesResponse) ? countriesResponse : countriesResponse?.data ?? [];
    return countries.map((country: any) => ({ value: country.id, label: country.name }));
  })();

  const statusOptions = [
    { value: "true", label: "Active" },
    { value: "false", label: "Inactive" }
  ];

  return (
    <>
      <PageMeta
        title="Add States | spearwin-admin"
        description="Add new States"
      />
      
      {/* Title Bar */}
      <div className="px-4 sm:px-6 lg:px-30 ">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
          <h1 className="text-lg font-semibold text-gray-900">Add States</h1>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-30 py-4">
        <div className="bg-white rounded-[10px] shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* State Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter state name"
                  />
                </div>

                {/* State Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State Code *
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => handleInputChange("code", e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter state code (e.g., TN, KA)"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={createStateMutation.isPending}
                    className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {createStateMutation.isPending ? "Creating..." : "Create State"}
                  </button>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <DropdownInput
                    placeholder="Select Country"
                    value={formData.countryId}
                    onChange={(value) => handleInputChange("countryId", value)}
                    options={countryOptions}
                  />
                </div>

                {/* Active Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <DropdownInput
                    placeholder="Select status"
                    value={formData.isActive.toString()}
                    onChange={(value) => handleInputChange("isActive", value === "true")}
                    options={statusOptions}
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
