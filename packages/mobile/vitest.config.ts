import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    sequence: {
      concurrent: false,
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json'],
      extension: ['.ts', '.tsx'],
      include: ['src/**/*.ts?(x)'],
      exclude: ['src/**/index.ts', 'src/**/*.spec.ts?(x)'],
    },
  },
});
