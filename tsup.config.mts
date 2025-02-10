import { defineConfig } from 'tsup';

const defaultConfig = {
  entry: ['**/index.ts'],
  splitting: false,
  clean: true,
  dts: false,
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
