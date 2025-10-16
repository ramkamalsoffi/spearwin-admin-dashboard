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
    }
    
    // Log request in development
    if (import.meta.env.DEV) {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
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
      // const { status, data } = error.response;
      
      // switch (status) {
      //   case 401:
      //     // Unauthorized - redirect to login
      //     localStorage.removeItem('authToken');
      //     window.location.href = '/login';
      //     break;
      //   case 403:
      //     console.error('Forbidden: Access denied');
      //     break;
      //   case 404:
      //     console.error('Not Found: Resource not found');
      //     break;
      //   case 500:
      //     console.error('Server Error: Internal server error');
      //     break;
      //   default:
      //     console.error('API Error:', data?.message || 'Unknown error');
      // }
    } else if (error.request) {
      console.error('Network Error: No response received');
    } else {
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
