// Application configuration
export const config = {
  api: {
    baseURLs: [
      import.meta.env.VITE_API_BASE_URL || 'https://backend.spearwin.com',
      import.meta.env.VITE_API_SECONDARY_URL || 'http://localhost:5000'
    ],
    primaryURL: import.meta.env.VITE_API_BASE_URL || 'https://backend.spearwin.com',
    secondaryURL: import.meta.env.VITE_API_SECONDARY_URL || 'http://localhost:5000',
    timeout: 10000,
  },
  app: {
    name: 'Spearwin Admin Dashboard',
    version: '1.0.0',
  },
};
