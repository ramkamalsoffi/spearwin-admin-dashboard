import api from '../lib/axios';
import { User } from './types';

export const userService = {
  // Get all users
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/user');
    return response.data;
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
  }
};