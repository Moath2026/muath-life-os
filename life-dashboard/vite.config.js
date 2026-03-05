import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for the Life Dashboard app
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
