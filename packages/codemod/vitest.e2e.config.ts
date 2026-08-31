import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['test/**/*.e2e.test.ts'],
    // Every case spawns the built bin as a child process through Yarn's PnP loader.
    testTimeout: 60_000,
    hookTimeout: 60_000,
  },
});
