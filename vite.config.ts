
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Mendefinisikan secara spesifik untuk menghindari error 'process is not defined'
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
  },
  server: {
    port: 3000,
  },
});
