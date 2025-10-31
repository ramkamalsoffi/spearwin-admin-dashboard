import api from '../utils/axios';
import { User } from './types';

export const userService = {
  // Get all users
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/user');
    return response.data;
  },

  // Get active users
  getActiveUsers: async (sortBy: string = 'createdAt', sortOrder: string = 'desc'): Promise<User[]> => {
    console.log('UserService - Calling /user/active with sortBy:', sortBy, 'sortOrder:', sortOrder);
    const response = await api.get<any>(`/user/active?sortBy=${sortBy}&sortOrder=${sortOrder}`);
    console.log('UserService - Active users response:', response);
    console.log('UserService - Active users response.data:', response.data);
    console.log('UserService - Active users response.data type:', typeof response.data);
    console.log('UserService - Active users response.data is array:', Array.isArray(response.data));
    
    // Handle different response structures
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else if (response.data?.users && Array.isArray(response.data.users)) {
      return response.data.users;
    } else if (response.data?.data?.users && Array.isArray(response.data.data.users)) {
      return response.data.data.users;
    }
    
    console.log('UserService - No valid users array found in response');
    return [];
  },

  // Get pending users
  getPendingUsers: async (sortBy: string = 'email', sortOrder: string = 'asc'): Promise<User[]> => {
    console.log('UserService - Calling /user/pending with sortBy:', sortBy, 'sortOrder:', sortOrder);
    const response = await api.get<any>(`/user/pending?sortBy=${sortBy}&sortOrder=${sortOrder}`);
    console.log('UserService - Pending users response:', response);
    console.log('UserService - Pending users response.data:', response.data);
    
    // Handle different response structures
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else if (response.data?.users && Array.isArray(response.data.users)) {
      return response.data.users;
    } else if (response.data?.data?.users && Array.isArray(response.data.data.users)) {
      return response.data.data.users;
    }
    
    return [];
  },

  // Get inactive users
  getInactiveUsers: async (sortBy: string = 'lastLoginAt', sortOrder: string = 'desc'): Promise<User[]> => {
    console.log('UserService - Calling /user/inactive with sortBy:', sortBy, 'sortOrder:', sortOrder);
    const response = await api.get<any>(`/user/inactive?sortBy=${sortBy}&sortOrder=${sortOrder}`);
    console.log('UserService - Inactive users response:', response);
    console.log('UserService - Inactive users response.data:', response.data);
    
    // Handle different response structures
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else if (response.data?.users && Array.isArray(response.data.users)) {
      return response.data.users;
    } else if (response.data?.data?.users && Array.isArray(response.data.data.users)) {
      return response.data.data.users;
    }
    
    return [];
  },

  // Get user by ID (with full profile details)
  getUserById: async (id: string): Promise<any> => {
    const response = await api.get(`/user/${id}`);
    return response.data;
  },

  // Update user with candidate profile
  updateUserWithProfile: async (
    userId: string,
    userData: {
      email?: string;
      phone?: string;
      emailVerified?: boolean;
      phoneVerified?: boolean;
    },
    candidateData?: {
      firstName?: string;
      lastName?: string;
      fatherName?: string;
      dateOfBirth?: string;
      gender?: string;
      maritalStatus?: string;
      bio?: string;
      profileSummary?: string;
      currentTitle?: string;
      currentCompany?: string;
      currentLocation?: string;
      preferredLocation?: string;
      noticePeriod?: string;
      currentSalary?: number;
      expectedSalary?: number;
      profileType?: string;
      experienceYears?: number;
      cityName?: string;
      country?: string;
      state?: string;
      streetAddress?: string;
      mobileNumber?: string;
      jobExperience?: string;
    }
  ): Promise<any> => {
    const payload: any = {
      ...(userData.email && { email: userData.email }),
      ...(userData.phone !== undefined && { phone: userData.phone }),
      ...(userData.emailVerified !== undefined && { emailVerified: userData.emailVerified }),
      ...(userData.phoneVerified !== undefined && { phoneVerified: userData.phoneVerified }),
      ...(candidateData && { candidateData }),
    };

    const response = await api.put(`/user/${userId}/profile`, payload);
    return response.data;
  },

  // Update user status
  updateUserStatus: async (id: string, status: User['status']): Promise<User> => {
    const response = await api.patch<User>(`/user/${id}/status`, { status });
    return response.data;
  },

  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/user/${id}`);
  },

  // Get user profiles with filters and pagination (server-side)
  getUserProfiles: async (params: {
    search?: string;
    status?: 'ACTIVE' | 'PENDING_VERIFICATION' | 'INACTIVE' | 'SUSPENDED';
    role?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    users: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> => {
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    if (params.role) queryParams.append('role', params.role);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    
    const queryString = queryParams.toString();
    const url = `/user/profiles${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(url);
    return response.data;
  },

  // Create user with candidate profile
  createUserWithProfile: async (userData: {
    email: string;
    password: string;
    phone?: string;
    role?: 'CANDIDATE' | 'ADMIN' | 'SUPER_ADMIN' | 'COMPANY';
    emailVerified?: boolean;
    phoneVerified?: boolean;
  }, candidateData?: {
    firstName: string;
    lastName: string;
    fatherName?: string;
    dateOfBirth?: string;
    gender?: string;
    maritalStatus?: string;
    bio?: string;
    profileSummary?: string;
    currentTitle?: string;
    currentCompany?: string;
    currentLocation?: string;
    preferredLocation?: string;
    noticePeriod?: string;
    currentSalary?: number;
    expectedSalary?: number;
    profileType?: string;
    experienceYears?: number;
    cityName?: string;
    country?: string;
    state?: string;
    streetAddress?: string;
    mobileNumber?: string;
    jobExperience?: string;
  }): Promise<any> => {
    // Create user with candidate data in a single request
    const payload = {
      email: userData.email,
      password: userData.password,
      phone: userData.phone || undefined,
      role: userData.role || 'CANDIDATE',
      emailVerified: userData.emailVerified || false,
      phoneVerified: userData.phoneVerified || false,
      ...(candidateData && { candidateData }),
    };

    const response = await api.post('/user', payload);
    return response.data;
  },

};