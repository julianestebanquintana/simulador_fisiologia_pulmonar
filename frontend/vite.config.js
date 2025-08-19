import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: './index.html'
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['chart.js', 'react-chartjs-2'],
          bootstrap: ['bootstrap', 'react-bootstrap']
        }
      }
    },
    // Compresión de assets
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  // Optimizaciones de desarrollo
  server: {
    port: 3000,
    host: true
  }
});
