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

  // Get user by ID
  getUserById: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/user/${id}`);
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

};