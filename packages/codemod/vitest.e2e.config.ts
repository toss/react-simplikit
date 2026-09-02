import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.e2e.test.ts'],
    // Each test spawns the built bin through yarn; the 5s default leaves no margin on CI.
    testTimeout: 60_000,
  },
});
