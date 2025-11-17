import api from '../utils/axios';
import { ApiResponse } from './types';

// Candidate/CV Search Query Parameters
export interface CVSearchQueryParams {
  search?: string;
  company?: string;
  jobCode?: string;
  email?: string;
  skills?: string;
  experience?: string;
  salary?: string;
  currentCompany?: string;
  currentLocation?: string;
  noticePeriod?: string;
  profileType?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Candidate Profile Response
export interface CandidateProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  currentTitle?: string;
  currentCompany?: string;
  currentLocation?: string;
  preferredLocation?: string;
  noticePeriod?: string;
  currentSalary?: number;
  expectedSalary?: number;
  experienceYears?: number;
  profileType?: string;
  skills?: Array<{
    id: string;
    skill: string;
    proficiency?: string;
  }>;
  education?: Array<{
    id: string;
    degree: string;
    institution: string;
    fieldOfStudy?: string;
    startYear?: number;
    endYear?: number;
  }>;
  experience?: Array<{
    id: string;
    title: string;
    company: string;
    location?: string;
    startDate?: Date;
    endDate?: Date;
    isCurrent?: boolean;
  }>;
  resumes?: Array<{
    id: string;
    fileName: string;
    filePath: string; // Changed from fileUrl to filePath to match backend schema
    fileUrl?: string; // Keep for backward compatibility
    uploadedAt: Date;
  }>;
  city?: {
    id: number;
    name: string;
    state?: {
      id: number;
      name: string;
      country?: {
        id: number;
        name: string;
      };
    };
  };
  status: string;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// CV Search Response
export interface CVSearchResponse {
  candidates: CandidateProfile[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  statistics?: {
    totalCandidates: number;
    activeCandidates: number;
    inactiveCandidates: number;
    pendingCandidates: number;
  };
}

export const candidateService = {
  // Search CVs/Candidates
  searchCandidates: async (params: CVSearchQueryParams): Promise<CVSearchResponse> => {
    const queryParams = new URLSearchParams();
    
    // Build query string
    if (params.search) queryParams.append('search', params.search);
    if (params.email) queryParams.append('email', params.email);
    if (params.currentCompany) queryParams.append('currentCompany', params.currentCompany);
    if (params.currentLocation) queryParams.append('currentLocation', params.currentLocation);
    if (params.profileType) queryParams.append('profileType', params.profileType);
    if (params.skills) {
      // Add skills to search term if not already in search
      if (params.search && !params.search.includes(params.skills)) {
        queryParams.set('search', `${params.search} ${params.skills}`);
      } else if (!params.search) {
        queryParams.append('search', params.skills);
      }
    }
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    
    // Always filter for CANDIDATE role
    queryParams.append('role', 'CANDIDATE');
    
    const queryString = queryParams.toString();
    const url = `/user/profiles${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(url);
    
    // Transform the response to match our CVSearchResponse interface
    const data = response.data;
    
    // Transform users array: flatten user and candidate data
    const candidates = (data.users || []).map((user: any) => {
      const candidate = user.candidate || {};
      return {
        id: user.id,
        userId: user.id,
        email: user.email,
        phone: user.phone || undefined,
        status: user.status,
        firstName: candidate.firstName || '',
        lastName: candidate.lastName || '',
        currentTitle: candidate.currentTitle || undefined,
        currentCompany: candidate.currentCompany || undefined,
        currentLocation: candidate.currentLocation || undefined,
        preferredLocation: candidate.preferredLocation || undefined,
        noticePeriod: candidate.noticePeriod || undefined,
        currentSalary: candidate.currentSalary ? Number(candidate.currentSalary) : undefined,
        expectedSalary: candidate.expectedSalary ? Number(candidate.expectedSalary) : undefined,
        experienceYears: candidate.experienceYears || undefined,
        profileType: candidate.profileType || undefined,
        skills: candidate.skills || [],
        education: candidate.education || [],
        experience: candidate.experience || [],
        resumes: candidate.resumes || [],
        city: candidate.city || undefined,
        lastLoginAt: user.lastLoginAt || undefined,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    });
    
    return {
      candidates,
      total: data.total || 0,
      page: data.page || 1,
      limit: data.limit || 10,
      totalPages: data.totalPages || 0,
      statistics: data.statistics,
    };
  },

  // Get candidate by ID
  getCandidateById: async (id: string): Promise<ApiResponse<CandidateProfile>> => {
    const response = await api.get(`/user/${id}`);
    return response.data;
  },

  // Get candidate complete profile
  getCandidateProfile: async (userId: string): Promise<ApiResponse<CandidateProfile>> => {
    const response = await api.get(`/candidate/profile/${userId}`);
    return response.data;
  },

  // Get candidates list for dropdown (name and email)
  getCandidatesForDropdown: async (search?: string): Promise<Array<{ value: string; label: string }>> => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('role', 'CANDIDATE');
      queryParams.append('limit', '100'); // Get more for dropdown
      if (search) {
        queryParams.append('search', search);
      }
      
      const url = `/user/profiles?${queryParams.toString()}`;
      console.log('Fetching candidates dropdown from:', url);
      const response = await api.get(url);
      console.log('Candidates dropdown response:', response.data);
      
      const users = response.data?.users || response.data?.data?.users || [];
      console.log('Users array length:', users.length);
      
      const options = users
        .filter((user: any) => user.candidate)
        .map((user: any) => {
          const candidate = user.candidate;
          const fullName = `${candidate.firstName || ''} ${candidate.lastName || ''}`.trim();
          const label = fullName ? `${fullName} (${user.email})` : user.email || 'Unknown';
          return {
            value: user.email || user.id,
            label: label,
          };
        });
      
      console.log('Transformed dropdown options count:', options.length);
      return options;
    } catch (error) {
      console.error('Error fetching candidates dropdown:', error);
      return [];
    }
  },

  // Get candidate emails for dropdown
  getCandidateEmails: async (search?: string): Promise<Array<{ value: string; label: string }>> => {
    const queryParams = new URLSearchParams();
    queryParams.append('role', 'CANDIDATE');
    queryParams.append('limit', '100');
    if (search) {
      queryParams.append('search', search);
    }
    
    const response = await api.get(`/user/profiles?${queryParams.toString()}`);
    const users = response.data?.users || [];
    
      return users
        .filter((user: any) => user.email)
        .map((user: any) => ({
          value: user.email,
          label: user.email,
        }));
  },

  // Update application status using candidate API
  updateApplicationStatus: async (applicationId: string, status: string): Promise<any> => {
    try {
      const response = await api.put(`/candidate/applications/${applicationId}`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating application status via candidate API:', error);
      throw error;
    }
  },
};

