// Application configuration
export const config = {
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001',
    timeout: 10000,
  },
  app: {
    name: 'Spearwin Admin Dashboard',
    version: '1.0.0',
  },
};
