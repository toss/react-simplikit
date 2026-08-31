import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/cli.ts'],
  format: ['esm'],
  platform: 'node',
  dts: false,
  clean: true,
  banner: { js: '#!/usr/bin/env node' },
});
