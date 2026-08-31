import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/cli.ts'],
  // CLI-only: `bin` needs one ESM entry. No CJS, no per-module output.
  format: ['esm'],
  platform: 'node',
  // Nothing here is imported as a library, so declarations would ship dead weight.
  dts: false,
  clean: true,
  banner: { js: '#!/usr/bin/env node' },
});
