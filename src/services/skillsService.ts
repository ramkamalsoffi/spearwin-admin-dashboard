import api from '../utils/axios';

export interface SkillOption {
  value: string;
  label: string;
}

export const skillsService = {
  // Get all skills from job attributes (category: skills)
  getSkills: async (search?: string): Promise<SkillOption[]> => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('isActive', 'true');
      queryParams.append('limit', '100');
      if (search) {
        queryParams.append('search', search);
      }
      
      const response = await api.get(`/job-attributes?${queryParams.toString()}`);
      const data = response.data?.data || response.data || [];
      
      // Filter for skills category or get all attributes
      // Assuming job attributes contain skills
      return data
        .filter((attr: any) => {
          // If it's a skill attribute, or if category name contains 'skill'
          const categoryName = attr.category?.name?.toLowerCase() || '';
          const attributeName = attr.name?.toLowerCase() || '';
          return categoryName.includes('skill') || attributeName.includes('skill') || !attr.categoryId;
        })
        .map((attr: any) => ({
          value: attr.name || attr.id,
          label: attr.name || 'Unknown',
        }))
        .filter((opt: SkillOption) => opt.label !== 'Unknown');
    } catch (error) {
      console.error('Error fetching skills:', error);
      return [];
    }
  },
};

