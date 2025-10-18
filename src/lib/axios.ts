import axios from 'axios';
import { config } from './config';

// Create axios instance with default config
const api = axios.create({
  baseURL: config.api.baseURL,
  // timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('accessToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // For POST/PUT/DELETE requests, we need authentication
      if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(config.method?.toUpperCase() || '')) {
        console.warn('Authentication required for this request. Please login first.');
        // Don't add mock token - let the request fail with 401/403
      }
    }
    
    // Log request in development
    if (import.meta.env.DEV) {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        hasToken: !!token,
        tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token',
        data: config.data,
        params: config.params,
      });
    }
    
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log('API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    
    return response;
  },
  (error) => {
    // Handle common error cases
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          console.warn('Authentication required. Redirecting to login.');
          // Uncomment the next line to auto-redirect to login
          // window.location.href = '/login';
          break;
        case 403:
          console.error('Forbidden: Access denied', data);
          // Show user-friendly error message
          if (typeof window !== 'undefined') {
            const errorMsg = data?.message || 'Access denied. You may not have permission to perform this action.';
            console.error('403 Error Details:', errorMsg);
          }
          break;
        case 404:
          console.error('Not Found: Resource not found');
          break;
        case 500:
          console.error('Server Error: Internal server error');
          break;
        default:
          console.error('API Error:', data?.message || 'Unknown error');
      }
    } else if (error.request) {
      console.error('Network Error: No response received');
    } else {
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
