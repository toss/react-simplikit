import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json'],
      extension: ['.ts'],
      include: ['src/**/*.ts'],
      // cli.ts is covered by the built-bin e2e suite, which runs in a child process
      // where v8 coverage cannot attribute lines back to this run.
      exclude: ['src/cli.ts', 'src/constants.ts', 'src/types.ts', 'src/**/*.test.ts'],
      thresholds: { statements: 100, branches: 100, functions: 100, lines: 100 },
    },
  },
});
