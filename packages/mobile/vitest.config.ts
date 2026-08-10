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
      exclude: ['src/**/index.ts', 'src/**/*.{spec,test}.ts?(x)', 'src/test/**'],
      thresholds: { statements: 100, branches: 100, functions: 100, lines: 100 },
    },
  },
});
