import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    // Vite dev server will proxy API requests to the Express backend running on port 3001
    proxy: {
      '/tareas': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
