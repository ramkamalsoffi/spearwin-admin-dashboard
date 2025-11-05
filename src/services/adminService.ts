import api from '../utils/axios';
import { ApiResponse, LoginRequest, LoginResponse } from './types';

export interface ApplicationQueryParams {
  status?: string;
  jobTitle?: string;
  companyName?: string;
  candidateName?: string;
  appliedFrom?: string;
  appliedTo?: string;
  page?: string;
  limit?: string;
}

export interface AdminApplication {
  id: number | null;
  jobId: number | null;
  candidateId: number | null;
  resumeId?: number | null;
  resumeFilePath?: string;
  coverLetter?: string;
  status: string;
  appliedAt: Date | string;
  reviewedAt?: Date | string;
  reviewedBy?: string;
  feedback?: string;
  updatedAt: Date | string;
  job: {
    id: number | null;
    title: string;
    slug: string;
    description: string;
    company: {
      id: number | null;
      name: string;
      logo?: string;
    };
    location?: {
      city: {
        id: number;
        name: string;
        state_name?: string;
        country_name?: string;
      };
    };
  };
  candidate: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    profilePicture?: string;
    currentTitle?: string;
    experienceYears?: number;
    userId?: string;
    status?: string;
    city?: {
      id: number;
      name: string;
      state_name?: string;
      country_name?: string;
    };
  };
  resume?: {
    id: number | null;
    title: string;
    fileName: string;
    filePath?: string;
    uploadedAt: Date | string;
  };
}

export interface ApplicationsListResponse {
  applications: AdminApplication[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export const adminService = {
  // Admin login
  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await api.post('/api/admin/login', credentials);
    return response.data;
  },

  // Get all applications with candidate details
  getAllApplications: async (params?: ApplicationQueryParams): Promise<ApplicationsListResponse> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append('status', params.status);
      if (params?.jobTitle) queryParams.append('jobTitle', params.jobTitle);
      if (params?.companyName) queryParams.append('companyName', params.companyName);
      if (params?.candidateName) queryParams.append('candidateName', params.candidateName);
      if (params?.appliedFrom) queryParams.append('appliedFrom', params.appliedFrom);
      if (params?.appliedTo) queryParams.append('appliedTo', params.appliedTo);
      if (params?.page) queryParams.append('page', params.page);
      if (params?.limit) queryParams.append('limit', params.limit);
      
      const queryString = queryParams.toString();
      const url = `/api/admin/applications${queryString ? `?${queryString}` : ''}`;
      console.log('Fetching applications from:', url);
      const response = await api.get(url);
      console.log('Raw API response:', response);
      console.log('Response data:', response.data);
      console.log('Response data type:', typeof response.data);
      console.log('Has applications array?', Array.isArray(response.data?.applications));
      
      // The backend returns ApplicationsListResponseDto directly
      // It should have: { applications: [], total: number, page: number, limit: number, totalPages: number, hasNext: boolean, hasPrev: boolean }
      const data = response.data;
      
      // Ensure we return the correct structure
      if (data && typeof data === 'object') {
        // If it's wrapped in a data property
        if (data.data && data.data.applications) {
          console.log('Returning wrapped data structure');
          return data.data;
        }
        // If applications is directly on response.data
        if (data.applications) {
          console.log('Returning direct data structure');
          return data;
        }
      }
      
      console.warn('Unexpected response structure, returning as-is:', data);
      return data || { applications: [], total: 0, page: 1, limit: 10, totalPages: 0, hasNext: false, hasPrev: false };
    } catch (error: any) {
      console.error('Error in getAllApplications:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  // Update application status
  updateApplicationStatus: async (applicationId: string, status: string): Promise<AdminApplication> => {
    try {
      const response = await api.put(`/api/admin/applications/${applicationId}/status`, { status });
      return response.data;
    } catch (error: any) {
      console.error('Error updating application status:', error);
      throw error;
    }
  },

  // Update user/candidate status
  updateUserStatus: async (userId: string, status: string): Promise<any> => {
    try {
      const response = await api.patch(`/user/${userId}/status`, { status });
      return response.data;
    } catch (error: any) {
      console.error('Error updating user status:', error);
      throw error;
    }
  },

  // Update user profile (firstName, lastName, email, phone, bio, social links, address)
  updateUserProfile: async (userId: string, profileData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    bio?: string;
    linkedinUrl?: string;
    facebookUrl?: string;
    twitterUrl?: string;
    instagramUrl?: string;
    country?: string;
    state?: string;
    cityName?: string;
    address?: string;
    streetAddress?: string;
    cityId?: number;
  }): Promise<any> => {
    try {
      const response = await api.put(`/api/admin/users/${userId}/profile`, profileData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },
};
