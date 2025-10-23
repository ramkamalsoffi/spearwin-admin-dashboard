import { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";

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

export default function AddPackage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    packageTitle: "",
    packageDays: "",
    packageFor: "",
    packagePrice: "",
    packageListings: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Package form submitted:", formData);
    // Handle form submission logic here
    // For now, just navigate back to Packages page
    navigate("/packages");
  };

  // Dropdown options
  const packageForOptions = [
    { value: "job_seeker", label: "Job Seeker" },
    { value: "employer", label: "Employer" },
    { value: "both", label: "Both" }
  ];

  return (
    <>
      <PageMeta
        title="Add Package | spearwin-admin"
        description="Add new Package"
      />
      
      {/* Title Bar */}
      <div className="px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
          <PageBreadcrumb 
            items={[
              { label: "Dashboard", path: "/" },
              { label: "Packages", path: "/packages" },
              { label: "Add Package" }
            ]}
            showAdmin={true}
          />
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="bg-white rounded-[10px] shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Package Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Package Title
                  </label>
                  <input
                    type="text"
                    value={formData.packageTitle}
                    onChange={(e) => handleInputChange("packageTitle", e.target.value)}
                    placeholder="Enter Tittle"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Package Days */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Package Days
                  </label>
                  <input
                    type="number"
                    value={formData.packageDays}
                    onChange={(e) => handleInputChange("packageDays", e.target.value)}
                    placeholder="Enter days"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Package for? */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Package for?
                  </label>
                  <DropdownInput
                    placeholder="Select status"
                    value={formData.packageFor}
                    onChange={(value) => handleInputChange("packageFor", value)}
                    options={packageForOptions}
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                <button
                  type="submit"
                  className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Submit
                </button>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Package Price (In USD) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Package Price (In USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.packagePrice}
                    onChange={(e) => handleInputChange("packagePrice", e.target.value)}
                    placeholder="Enter price"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Package Listings */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Package Listings
                  </label>
                  <input
                    type="number"
                    value={formData.packageListings}
                    onChange={(e) => handleInputChange("packageListings", e.target.value)}
                    placeholder="Enter listings"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
