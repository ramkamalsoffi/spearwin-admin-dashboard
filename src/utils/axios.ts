import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000', 
  // baseURL: import.meta.env.VITE_API_URL || 'https://backend.spearwin.com',// Backend API URL
  // timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - runs before every request
api.interceptors.request.use(
  (config) => {
    // Add auth token to requests if available
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token found and added to request');
    } else {
      console.warn('⚠️ No access token found in localStorage');
      
      // TEMPORARY: For development, add a mock token if no real token exists
      // Remove this when you have proper authentication set up
      if (import.meta.env.DEV) {
        console.log('🔧 DEV MODE: Adding mock token for development');
        config.headers.Authorization = 'Bearer mock-dev-token-12345';
      }
    }
    
    // Add user type to headers if available
    const userType = localStorage.getItem('userType');
    if (userType) {
      config.headers['X-User-Type'] = userType;
    }
    
    console.log('Making request to:', (config.baseURL || '') + (config.url || ''));
    console.log('Request headers:', {
      Authorization: config.headers.Authorization ? 'Bearer [TOKEN]' : 'No token',
      'X-User-Type': config.headers['X-User-Type'] || 'No user type'
    });
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - runs after every response
api.interceptors.response.use(
  (response) => {
    // Handle successful responses
    console.log('Response received:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Response interceptor error:', error);
    
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear auth data and redirect to login
          console.log('🔓 401 Unauthorized - clearing authentication data');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          localStorage.removeItem('userType');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('refreshToken');
          
          // Only redirect if not already on login page
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            console.log('🔄 Redirecting to login page');
            window.location.href = '/login';
          }
          break;
          
        case 403:
          // Forbidden
          console.error('Access forbidden');
          break;
          
        case 404:
          // Not found
          console.error('API endpoint not found. Please check if your backend server is running and the API URL is correct.');
          console.error('Current API URL:', error.config?.baseURL);
          break;
          
        case 500:
          // Server error
          console.error('Internal server error');
          break;
          
        default:
          console.error('API error:', status, data);
      }
      
      // Return a more user-friendly error
      return Promise.reject({
        ...error,
        message: data?.message || `Request failed with status ${status}`,
        status: status,
        data: data
      });
      
    } else if (error.request) {
      // Network error - no response received
      console.error('Network error:', error.request);
      return Promise.reject({
        ...error,
        message: 'Network error. Please check your connection and try again.',
        isNetworkError: true
      });
      
    } else {
      // Something else happened
      console.error('Request setup error:', error.message);
      return Promise.reject({
        ...error,
        message: 'An unexpected error occurred. Please try again.'
      });
    }
  }
);



export default api;
