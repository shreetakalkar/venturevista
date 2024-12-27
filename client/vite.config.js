// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/listings': 'http://localhost:8080', // Only proxy API requests to the backend
      // other routes like /listings can also be added if needed
    },
    port: 3000, // React development server will run on port 3000
  },
});
