// Application configuration
export const config = {
  api: {
    baseURLs: [
      import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
      import.meta.env.VITE_API_SECONDARY_URL || 'https://backend.spearwin.com'
    ],
    primaryURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
    secondaryURL: import.meta.env.VITE_API_SECONDARY_URL || 'https://backend.spearwin.com',
    timeout: 10000,
  },
  app: {
    name: 'Spearwin Admin Dashboard',
    version: '1.0.0',
  },
};
