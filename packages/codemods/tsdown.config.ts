import { defineConfig } from 'tsdown';

export default defineConfig([
  {
    entry: ['src/bin/codemods.ts'],
    outDir: 'dist/bin',
    format: 'cjs',
    clean: true,
    publint: 'ci-only',
    banner: { js: '#!/usr/bin/env node' },
  },
  {
    entry: ['src/transforms/*.ts'],
    outDir: 'dist/transforms',
    format: 'cjs',
    clean: true,
    // detect-indent is ESM-only, and the transforms are loaded with require().
    deps: { alwaysBundle: ['detect-indent'] },
  },
]);
