import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3008', // Backend API URL
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - runs before every request
api.interceptors.request.use(
  (config) => {
    // Add auth token to requests if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add user type to headers if available
    const userType = localStorage.getItem('userType');
    if (userType) {
      config.headers['X-User-Type'] = userType;
    }
    
    console.log('Making request to:', config.baseURL + config.url);
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
          localStorage.removeItem('token');
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('userType');
          localStorage.removeItem('userEmail');
          
          // Only redirect if not already on login page
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
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
