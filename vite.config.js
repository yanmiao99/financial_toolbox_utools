import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import utools from 'vite-plugin-utools';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    utools({
      external: 'uTools',
      preload: {
        path: './src/preload.js',
        watch: true,
        name: 'window.preload',
      },
      buildUpx: false,
    }),
  ],

  base: './',
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
