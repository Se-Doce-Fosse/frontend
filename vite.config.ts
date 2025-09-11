import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import envCompatible from 'vite-plugin-env-compatible';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), envCompatible()],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/components/index.ts'),
      '@pages': path.resolve(__dirname, './src/pages/index.ts'),
    },
  },
});
