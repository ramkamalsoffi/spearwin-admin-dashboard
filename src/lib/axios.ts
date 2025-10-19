import axios from 'axios';
import { config } from './config';

// Create multiple axios instances for different API endpoints
const createApiInstance = (baseURL: string) => {
  return axios.create({
    baseURL,
    timeout: config.api.timeout,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// Create API instances for all configured endpoints
const apiInstances = config.api.baseURLs.map(url => createApiInstance(url));

// Primary API instance (first in the list)
const primaryApi = apiInstances[0];

// Helper function to try requests on multiple API endpoints
const tryRequestOnMultipleApis = async (requestConfig: any, maxRetries = apiInstances.length) => {
  let lastError: any;

  for (let i = 0; i < Math.min(maxRetries, apiInstances.length); i++) {
    try {
      const response = await apiInstances[i].request(requestConfig);
      return response;
    } catch (error) {
      lastError = error;
      console.warn(`API request failed on ${config.api.baseURLs[i]}, trying next endpoint...`);

      // If it's a network error or server error, try the next endpoint
      if ((error as any).code === 'NETWORK_ERROR' || (error as any).response?.status >= 500) {
        continue;
      }

      // For client errors (4xx), don't retry on other endpoints
      throw error;
    }
  }

  throw lastError;
};

// Main API instance that uses multiple endpoints
const api = {
  ...primaryApi,

  // Override the request method to try multiple endpoints
  async request(config: any) {
    return tryRequestOnMultipleApis(config);
  },

  // Convenience methods for common HTTP verbs
  async get(url: string, config?: any) {
    return this.request({ ...config, method: 'GET', url });
  },

  async post(url: string, data?: any, config?: any) {
    return this.request({ ...config, method: 'POST', url, data });
  },

  async put(url: string, data?: any, config?: any) {
    return this.request({ ...config, method: 'PUT', url, data });
  },

  async delete(url: string, config?: any) {
    return this.request({ ...config, method: 'DELETE', url });
  },

  async patch(url: string, data?: any, config?: any) {
    return this.request({ ...config, method: 'PATCH', url, data });
  },

  // Expose individual API instances for direct access if needed
  instances: apiInstances,
  primary: primaryApi,
};

// Apply interceptors to all API instances
apiInstances.forEach((apiInstance, index) => {
  // Request interceptor for each API instance
  apiInstance.interceptors.request.use(
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
        console.log(`API Request [${index + 1}]:`, {
          method: config.method?.toUpperCase(),
          url: config.url,
          baseURL: config.baseURL,
          hasToken: !!token,
          tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token',
          data: config.data,
          params: config.params,
        });
      }

      return config;
    },
    (error) => {
      console.error(`Request Error [${index + 1}]:`, error);
      return Promise.reject(error);
    }
  );

  // Response interceptor for each API instance
  apiInstance.interceptors.response.use(
    (response) => {
      // Log response in development
      if (import.meta.env.DEV) {
        console.log(`API Response [${index + 1}]:`, {
          status: response.status,
          url: response.config.url,
          baseURL: response.config.baseURL,
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
});

export default api;
