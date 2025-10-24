import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { statesService, countryService } from "../services";
import { useStateMutations } from "../hooks/useStateMutations";
import { UpdateStateRequest } from "../services/types";

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

export default function EditState() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { updateStateMutation } = useStateMutations();
  const [formData, setFormData] = useState({
    name: "",
    countryId: "",
    isActive: true
  });

  // Fetch state data by ID
  const { data: stateResponse, isLoading: stateLoading, error: stateError } = useQuery({
    queryKey: ['state', id],
    queryFn: async () => {
      if (!id) throw new Error('State ID is required');
      const response = await statesService.getStateById(id);
      return response;
    },
    enabled: !!id,
  });

  // Extract state data from response
  let state = null;
  if (stateResponse && typeof stateResponse === 'object') {
    const responseObj = stateResponse as any;
    if (responseObj.state) {
      state = responseObj.state;
    } else if (responseObj.data) {
      state = responseObj.data;
    } else {
      state = responseObj;
    }
  }

  // Fetch countries for dropdown
  const { data: countriesData, isLoading: countriesLoading } = useQuery({
    queryKey: ['countries'],
    queryFn: () => countryService.getCountries(),
  });

  // Update form data when state data is loaded
  useEffect(() => {
    if (state) {
      setFormData({
        name: state.name || "",
        countryId: state.countryId || "",
        isActive: state.isActive || false
      });
    }
  }, [state]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) {
      toast.error("State ID is missing");
      return;
    }

    // Validate form data
    if (!formData.name || !formData.countryId) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Create update data object
    const updateData: UpdateStateRequest = {
      id,
      name: formData.name,
      countryId: parseInt(formData.countryId) || Number(formData.countryId),
      isActive: formData.isActive
    };

    // Submit the form
    updateStateMutation.mutate(updateData);
  };

  // Prepare countries options for dropdown
  const countryOptions = Array.isArray(countriesData?.data) 
    ? countriesData.data.map(country => ({
        value: String(country.id),
        label: country.name
      }))
    : [];

  const statusOptions = [
    { value: "true", label: "Active" },
    { value: "false", label: "Inactive" }
  ];

  // Loading state
  if (stateLoading || countriesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-gray-600">Loading state...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (stateError) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Failed to load state</h3>
          <p className="mt-1 text-sm text-gray-500">{(stateError as any).message || "An unknown error occurred."}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Edit State | spearwin-admin"
        description="Edit State"
      />
      
      {/* Title Bar */}
      <div className="px-4 sm:px-6 lg:px-30 ">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
          <PageBreadcrumb 
            items={[
              { label: "Dashboard", path: "/" },
              { label: "States", path: "/states" },
              { label: "Edit State" }
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
                {/* State Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter state name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>


                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={updateStateMutation.isPending}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      updateStateMutation.isPending
                        ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                        : 'bg-blue-900 hover:bg-blue-800 text-white'
                    }`}
                  >
                    {updateStateMutation.isPending ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating State...
                      </div>
                    ) : (
                      'Update State'
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country <span className="text-red-500">*</span>
                  </label>
                  {countriesLoading ? (
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                      Loading countries...
                    </div>
                  ) : (
                    <DropdownInput
                      placeholder="Select Country"
                      value={formData.countryId}
                      onChange={(value) => handleInputChange("countryId", value)}
                      options={countryOptions}
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
