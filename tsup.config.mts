import { defineConfig, Options } from 'tsup';

const defaultConfig: Options = {
  entry: ['**/index.ts'],
  splitting: false,
  clean: true,
  dts: true,
  minify: true,
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
