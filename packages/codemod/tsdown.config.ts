import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/cli.ts'],
  clean: true,
  publint: 'ci-only',
  banner: { js: '#!/usr/bin/env node' },
});
