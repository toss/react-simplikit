import { defineConfig } from 'tsup';

const defaultConfig = {
  // To support React Server Components
  banner: {
    js: '"use client";',
  },
  entry: ['**/index.ts'],
  splitting: false,
  clean: true,
  dts: true,
};

export default defineConfig([
  {
    ...defaultConfig,
    format: 'cjs',
    outDir: 'dist',
  },
  {
    ...defaultConfig,
    format: 'esm',
    outDir: 'esm',
  },
]);
