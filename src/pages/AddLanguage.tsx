import { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../components/common/PageMeta";

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

export default function AddLanguage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    language: "",
    native: "",
    isoCode: "",
    isDefault: "",
    active: "",
    rtl: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Language form submitted:", formData);
    // Handle form submission logic here
    // For now, just navigate back to languages page
    navigate("/languages");
  };

  // Dropdown options
  const languageOptions = [
    { value: "english", label: "English" },
    { value: "spanish", label: "Spanish" },
    { value: "french", label: "French" },
    { value: "german", label: "German" },
    { value: "arabic", label: "Arabic" },
    { value: "chinese", label: "Chinese" }
  ];

  const isoCodeOptions = [
    { value: "en", label: "en" },
    { value: "es", label: "es" },
    { value: "fr", label: "fr" },
    { value: "de", label: "de" },
    { value: "ar", label: "ar" },
    { value: "zh", label: "zh" }
  ];

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "pending", label: "Pending" }
  ];

  const yesNoOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" }
  ];

  return (
    <>
      <PageMeta
        title="Add Languages | Spearwin Admin"
        description="Add new language"
      />
      
      {/* Title Bar */}
      <div className="px-30 py-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-900">Add Languages</h1>
        </div>
      </div>

      <div className="px-30 py-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Language */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <DropdownInput
                    placeholder="Select language"
                    value={formData.language}
                    onChange={(value) => handleInputChange("language", value)}
                    options={languageOptions}
                  />
                </div>

                {/* ISO Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ISO Code
                  </label>
                  <DropdownInput
                    placeholder="Select role"
                    value={formData.isoCode}
                    onChange={(value) => handleInputChange("isoCode", value)}
                    options={isoCodeOptions}
                  />
                </div>

                {/* Active */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Active
                  </label>
                  <DropdownInput
                    placeholder="Select status"
                    value={formData.active}
                    onChange={(value) => handleInputChange("active", value)}
                    options={statusOptions}
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
                  >
                    Submit
                  </button>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Native */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Native
                  </label>
                  <input
                    type="text"
                    value={formData.native}
                    onChange={(e) => handleInputChange("native", e.target.value)}
                    placeholder="Enter cv status"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Is Default? */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Is Default?
                  </label>
                  <DropdownInput
                    placeholder="Select Yes or No"
                    value={formData.isDefault}
                    onChange={(value) => handleInputChange("isDefault", value)}
                    options={yesNoOptions}
                  />
                </div>

                {/* RTL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    RTL
                  </label>
                  <DropdownInput
                    placeholder="Select Yes or No"
                    value={formData.rtl}
                    onChange={(value) => handleInputChange("rtl", value)}
                    options={yesNoOptions}
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
