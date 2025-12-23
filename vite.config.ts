import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Use relative paths so it works on github.io/repo-name/
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    // Using default minifier (esbuild) to avoid dependency issues with terser
  },
  server: {
    port: 3000,
    open: true
  }
});