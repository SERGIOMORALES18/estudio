import { defineConfig } from 'vite';
import path from 'path';

// Simple configuration that treats `frontend` as root. When building,
// output goes to `frontend/dist`, which can be served by the backend or
// deployed statically.
export default defineConfig({
  root: path.resolve(__dirname, 'frontend'),
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'frontend', 'index.html'),
        login: path.resolve(__dirname, 'frontend', 'login.html'),
        profile: path.resolve(__dirname, 'frontend', 'profile.html'),
        admin: path.resolve(__dirname, 'frontend', 'admin.html'),
      },
    },
  },
  server: {
    open: '/index.html',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
