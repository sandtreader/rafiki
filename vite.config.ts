/// <reference types="vitest/config" />
// Vite config for the example app dev server and the test runner.
// The library build uses vite.lib.config.ts.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // Keep the example app build away from the library's dist/
    outDir: 'build',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
  },
});
