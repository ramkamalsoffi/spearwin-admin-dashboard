// Auth service that provides authentication methods
// This service wraps the AuthContext functionality

import { adminService } from './adminService';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthServiceType {
  isAuthenticated(): boolean;
  login(credentials: LoginCredentials): Promise<void>;
  logout(): void;
  getCurrentUser(): any | null;
}

class AuthService implements AuthServiceType {
  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }

  async login(credentials: LoginCredentials): Promise<void> {
    const { email, password } = credentials;

    try {
      // Use the existing adminService login method
      const response = await adminService.login({ email, password });

      if (response.success && response.data) {
        const { accessToken, refreshToken, user } = response.data;

        // Store tokens and user data
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));

        return;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');

    // Redirect to login page
    window.location.href = '/login';
  }

  getCurrentUser(): any | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}

// Export a singleton instance
export const authService = new AuthService();
