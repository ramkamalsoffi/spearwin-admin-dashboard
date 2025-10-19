// Application configuration
export const config = {
  api: {
    baseURLs: [
      import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
      import.meta.env.VITE_API_SECONDARY_URL || 'http://100.24.209.100:5000'
    ],
    primaryURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
    secondaryURL: import.meta.env.VITE_API_SECONDARY_URL || 'http://100.24.209.100:5000',
    timeout: 10000,
  },
  app: {
    name: 'Spearwin Admin Dashboard',
    version: '1.0.0',
  },
};
