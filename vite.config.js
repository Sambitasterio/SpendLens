import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Default base '/' works for Vercel deployment.
export default defineConfig({
  plugins: [react()],
});
