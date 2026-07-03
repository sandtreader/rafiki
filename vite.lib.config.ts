// Vite config for building the publishable library (dist/).
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
  // Don't copy the example app's public/ assets into the published dist/
  publicDir: false,
  plugins: [
    react(),
    dts({
      rollupTypes: true,
      tsconfigPath: './tsconfig.json',
      include: ['src/rafiki.ts', 'src/lib'],
    }),
  ],
  build: {
    lib: {
      entry: 'src/rafiki.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'rafiki.js' : 'rafiki.cjs'),
    },
    rollupOptions: {
      // Peer dependencies (and their subpath imports) stay external
      external: [
        /^react($|\/)/,
        /^react-dom($|\/)/,
        /^@mui\//,
        /^@emotion\//,
      ],
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
