import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // You can set the Vite development server to run on a specific port (e.g., 3000)
    proxy: {
      '/api': 'http://localhost:8080', // This can be useful if you need to proxy API requests to your backend
    },
  },
});
