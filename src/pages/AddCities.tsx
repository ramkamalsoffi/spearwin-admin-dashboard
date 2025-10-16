import { useState } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { citiesService, statesService } from "../services";
import { CreateCityRequest } from "../services/types";

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

export default function AddCities() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    stateId: "",
    isActive: true
  });

  // Fetch states for dropdown
  const { data: statesData, isLoading: statesLoading } = useQuery({
    queryKey: ['states'],
    queryFn: () => statesService.getStates(),
  });

  // TanStack Query mutation for creating city
  const createCityMutation = useMutation({
    mutationFn: (cityData: CreateCityRequest) => citiesService.createCity(cityData),
    onSuccess: () => {
      toast.success("City created successfully!");
      navigate('/cities');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to create city";
      toast.error(errorMessage);
      console.error("Error creating city:", error);
    },
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.name || !formData.code || !formData.stateId) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Create city data object
    const cityData: CreateCityRequest = {
      name: formData.name,
      code: formData.code,
      stateId: formData.stateId,
      isActive: formData.isActive
    };

    // Submit the form
    createCityMutation.mutate(cityData);
  };

  // Prepare states options for dropdown
  const stateOptions = statesData?.data?.map(state => ({
    value: state.id,
    label: state.name
  })) || [];

  const statusOptions = [
    { value: "true", label: "Active" },
    { value: "false", label: "Inactive" }
  ];

  return (
    <>
      <PageMeta
        title="Add Cities | spearwin-admin"
        description="Add new Cities"
      />
      
      {/* Title Bar */}
      <div className="px-4 sm:px-6 lg:px-30 ">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
          <PageBreadcrumb 
            items={[
              { label: "Dashboard", path: "/" },
              { label: "Cities", path: "/cities" },
              { label: "Add Cities" }
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
                {/* City Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter city name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* City Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => handleInputChange("code", e.target.value)}
                    placeholder="Enter city code (e.g., NYC, LA)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={createCityMutation.isPending}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      createCityMutation.isPending
                        ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                        : 'bg-blue-900 hover:bg-blue-800 text-white'
                    }`}
                  >
                    {createCityMutation.isPending ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating City...
                      </div>
                    ) : (
                      'Submit'
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* State */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  {statesLoading ? (
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                      Loading states...
                    </div>
                  ) : (
                    <DropdownInput
                      placeholder="Select State"
                      value={formData.stateId}
                      onChange={(value) => handleInputChange("stateId", value)}
                      options={stateOptions}
                    />
                  )}
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
