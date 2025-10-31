import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import api from "../utils/axios";

// Job Attribute Card Component
const JobAttributeCard = ({ 
  title, 
  options, 
  onAddNew,
  showPopup,
  onClosePopup,
  onSaveAttribute,
  onToggleAttribute
}: { 
  title: string; 
  options: { id: string; name: string; checked: boolean }[]; 
  onAddNew: () => void;
  showPopup: boolean;
  onClosePopup: () => void;
  onSaveAttribute: (name: string, isActive: boolean) => void;
  onToggleAttribute: (attributeId: string, isActive: boolean) => void;
}) => {
  const [name, setName] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (name.trim() && !saving) {
      setSaving(true);
      try {
        await onSaveAttribute(name.trim(), isActive);
        setName('');
        setIsActive(true);
        onClosePopup();
      } catch (error) {
        console.error('Error saving attribute:', error);
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-[10px] shadow-sm border border-gray-200 p-6 relative">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      <div className="space-y-3 mb-6">
        {options.length === 0 ? (
          <p className="text-sm text-gray-500 italic text-center py-4">No attributes added yet</p>
        ) : (
          options.map((option) => (
            <div key={option.id} className="flex items-center">
              <input
                type="checkbox"
                id={`${title}-${option.id}`}
                checked={option.checked}
                onChange={(e) => onToggleAttribute(option.id, e.target.checked)}
                className="h-4 w-4 text-blue-800 focus:ring-blue-800 border-gray-300 rounded accent-blue-800 cursor-pointer"
              />
              <label 
                htmlFor={`${title}-${option.id}`}
                className="ml-2 text-sm text-gray-700 cursor-pointer"
              >
                {option.name}
              </label>
            </div>
          ))
        )}
      </div>
      
      <div className="relative">
        <div
          onClick={onAddNew}
          className="text-blue-900 hover:text-blue-800 cursor-pointer text-sm font-medium transition-colors"
        >
          + Add New
        </div>
        
        {/* Popup */}
        {showPopup && (
          <div className="absolute bottom-full left-0 mb-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg p-4 z-10">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Attribute Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter name"
                  autoFocus
                  disabled={saving}
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`active-${title}`}
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={saving}
                />
                <label htmlFor={`active-${title}`} className="ml-2 text-xs text-gray-700">
                  Active
                </label>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={onClosePopup}
                  className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !name.trim()}
                  className="px-2 py-1 text-xs bg-blue-900 text-white rounded hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Adding...' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Types for API response
interface Attribute {
  id: string;
  name: string;
  categoryId: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  displayName: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  attributes: Attribute[];
  _count: {
    attributes: number;
  };
}

interface CategoriesResponse {
  success: boolean;
  message: string;
  data: Category[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function JobAttributes() {
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<CategoriesResponse>('/job-attributes/categories');
      setCategories(response.data.data);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      setError(error.response?.data?.message || 'Failed to fetch categories');
      toast.error('Failed to load job attributes');
    } finally {
      setLoading(false);
    }
  };

  // Load categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Helper function to get attributes for a specific category
  const getAttributesForCategory = (categoryName: string) => {
    const category = categories.find(cat => cat.displayName === categoryName);
    if (!category) return [];
    
    return category.attributes.map(attr => ({
      id: String(attr.id).trim(), // Ensure it's a string and trim whitespace
      name: attr.name,
      checked: attr.isActive
    }));
  };

  const languageLevels = getAttributesForCategory("Language Level");
  const careerLevels = getAttributesForCategory("Career Level");
  const functionalAreas = getAttributesForCategory("Functional Area");
  const genders = getAttributesForCategory("Gender");
  const industries = getAttributesForCategory("Industry");
  const jobExperience = getAttributesForCategory("Job Experience");
  const jobSkills = getAttributesForCategory("Job Skill");
  const jobTypes = getAttributesForCategory("Job Type");
  const jobShifts = getAttributesForCategory("Job Shift");
  const degreeLevels = getAttributesForCategory("Degree Level");
  const degreeTypes = getAttributesForCategory("Degree Type");
  const majorSubjects = getAttributesForCategory("Major Subject");

  // Category name to category ID mapping
  const categoryMap: {[key: string]: string} = {
    "Language Level": "LANGUAGE_LEVEL",
    "Career Level": "CAREER_LEVEL", 
    "Functional Area": "FUNCTIONAL_AREA",
    "Gender": "GENDER",
    "Industry": "INDUSTRY",
    "Job Experience": "JOB_EXPERIENCE",
    "Job Skill": "JOB_SKILL",
    "Job Type": "JOB_TYPE",
    "Job Shift": "JOB_SHIFT",
    "Degree Level": "DEGREE_LEVEL",
    "Degree Type": "DEGREE_TYPE",
    "Major Subject": "MAJOR_SUBJECT"
  };

  // Add Attribute Function
  const addAttribute = async (attributeName: string, categoryName: string) => {
    try {
      // Map category name to category ID
      const categoryId = categoryMap[categoryName];
      if (!categoryId) {
        throw new Error(`Invalid category: ${categoryName}`);
      }

      // Find the category from our current state
      const category = categories.find(cat => cat.name === categoryId);
      
      if (!category) {
        throw new Error(`Category not found: ${categoryId}`);
      }

      // Call POST /job-attributes with proper payload
      const payload = {
        name: attributeName,
        categoryId: category.id,
        isActive: true,
        sortOrder: category.attributes.length
      };

      const response = await api.post('/job-attributes', payload);
      
      toast.success(`Successfully added "${attributeName}" to ${categoryName}`);
      console.log('Attribute added successfully:', response.data);
      
      // Refresh categories data to show the new attribute
      await fetchCategories();
      
      return response.data;
    } catch (error: any) {
      console.error('Error adding attribute:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add attribute';
      toast.error(errorMessage);
      throw error;
    }
  };

  // Toggle Attribute Function
  const toggleAttribute = async (attributeId: string, isActive: boolean) => {
    try {
      // Find the attribute in our categories
      let targetAttribute: Attribute | null = null;
      
      for (const category of categories) {
        const attribute = category.attributes.find(attr => attr.id === attributeId);
        if (attribute) {
          targetAttribute = attribute;
          break;
        }
      }

      if (!targetAttribute) {
        throw new Error('Attribute not found');
      }

      // Use the exact UUID from the found attribute (ensure it's a string)
      const uuid = String(targetAttribute.id);
      console.log('Toggling attribute with UUID:', uuid);
      console.log('UUID type:', typeof uuid);
      console.log('UUID length:', uuid.length);

      // Call PATCH /job-attributes/{id} to update the attribute
      const response = await api.patch(`/job-attributes/${uuid}`, {
        isActive: isActive
      });
      
      toast.success(`Successfully ${isActive ? 'activated' : 'deactivated'} "${targetAttribute.name}"`);
      console.log('Attribute updated successfully:', response.data);
      
      // Refresh categories data to show the updated attribute
      await fetchCategories();
      
      return response.data;
    } catch (error: any) {
      console.error('Error toggling attribute:', error);
      console.error('Attribute ID received:', attributeId);
      console.error('Attribute ID type:', typeof attributeId);
      const errorMessage = error.response?.data?.message || 'Failed to update attribute';
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleAddNew = (category: string) => {
    setActivePopup(category);
  };

  const handleClosePopup = () => {
    setActivePopup(null);
  };

  const handleSaveAttribute = async (name: string, isActive: boolean) => {
    if (activePopup) {
      await addAttribute(name, activePopup);
    }
  };

  return (
    <>
      <PageMeta
        title="Job Attributes | spearwin-admin"
        description="Manage Job Attributes"
      />
      
      {/* Title Bar */}
      <div className="px-4 sm:px-6 lg:px-30 ">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
          <PageBreadcrumb 
            items={[
              { label: "Dashboard", path: "/" },
              { label: "Job Attributes" }
            ]}
            showAdmin={true}
          />
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-30 py-4">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
            <span className="ml-2 text-gray-600">Loading job attributes...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading job attributes</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={fetchCategories}
                    className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Row 1 */}
          <JobAttributeCard
            title="Language Level"
            options={languageLevels}
            onAddNew={() => handleAddNew("Language Level")}
            showPopup={activePopup === "Language Level"}
            onClosePopup={handleClosePopup}
            onSaveAttribute={handleSaveAttribute}
            onToggleAttribute={toggleAttribute}
          />
          
          <JobAttributeCard
            title="Career Level"
            options={careerLevels}
            onAddNew={() => handleAddNew("Career Level")}
            showPopup={activePopup === "Career Level"}
            onClosePopup={handleClosePopup}
            onSaveAttribute={handleSaveAttribute}
            onToggleAttribute={toggleAttribute}
          />
          
          <JobAttributeCard
            title="Functional Area"
            options={functionalAreas}
            onAddNew={() => handleAddNew("Functional Area")}
            showPopup={activePopup === "Functional Area"}
            onClosePopup={handleClosePopup}
            onSaveAttribute={handleSaveAttribute}
            onToggleAttribute={toggleAttribute}
          />
          
          <JobAttributeCard
            title="Gender"
            options={genders}
            onAddNew={() => handleAddNew("Gender")}
            showPopup={activePopup === "Gender"}
            onClosePopup={handleClosePopup}
            onSaveAttribute={handleSaveAttribute}
            onToggleAttribute={toggleAttribute}
          />

          {/* Row 2 */}
          <JobAttributeCard
            title="Industry"
            options={industries}
            onAddNew={() => handleAddNew("Industry")}
            showPopup={activePopup === "Industry"}
            onClosePopup={handleClosePopup}
            onSaveAttribute={handleSaveAttribute}
            onToggleAttribute={toggleAttribute}
          />
          
          <JobAttributeCard
            title="Job Experience"
            options={jobExperience}
            onAddNew={() => handleAddNew("Job Experience")}
            showPopup={activePopup === "Job Experience"}
            onClosePopup={handleClosePopup}
            onSaveAttribute={handleSaveAttribute}
            onToggleAttribute={toggleAttribute}
          />
          
          <JobAttributeCard
            title="Job Skill"
            options={jobSkills}
            onAddNew={() => handleAddNew("Job Skill")}
            showPopup={activePopup === "Job Skill"}
            onClosePopup={handleClosePopup}
            onSaveAttribute={handleSaveAttribute}
            onToggleAttribute={toggleAttribute}
          />
          
          <JobAttributeCard
            title="Job Type"
            options={jobTypes}
            onAddNew={() => handleAddNew("Job Type")}
            showPopup={activePopup === "Job Type"}
            onClosePopup={handleClosePopup}
            onSaveAttribute={handleSaveAttribute}
            onToggleAttribute={toggleAttribute}
          />

          {/* Row 3 */}
          <JobAttributeCard
            title="Job Shift"
            options={jobShifts}
            onAddNew={() => handleAddNew("Job Shift")}
            showPopup={activePopup === "Job Shift"}
            onClosePopup={handleClosePopup}
            onSaveAttribute={handleSaveAttribute}
            onToggleAttribute={toggleAttribute}
          />
          
          <JobAttributeCard
            title="Degree Level"
            options={degreeLevels}
            onAddNew={() => handleAddNew("Degree Level")}
            showPopup={activePopup === "Degree Level"}
            onClosePopup={handleClosePopup}
            onSaveAttribute={handleSaveAttribute}
            onToggleAttribute={toggleAttribute}
          />
          
          <JobAttributeCard
            title="Degree Type"
            options={degreeTypes}
            onAddNew={() => handleAddNew("Degree Type")}
            showPopup={activePopup === "Degree Type"}
            onClosePopup={handleClosePopup}
            onSaveAttribute={handleSaveAttribute}
            onToggleAttribute={toggleAttribute}
          />
          
          <JobAttributeCard
            title="Major Subject"
            options={majorSubjects}
            onAddNew={() => handleAddNew("Major Subject")}
            showPopup={activePopup === "Major Subject"}
            onClosePopup={handleClosePopup}
            onSaveAttribute={handleSaveAttribute}
            onToggleAttribute={toggleAttribute}
          />
          </div>
        )}
      </div>
    </>
  );
}
