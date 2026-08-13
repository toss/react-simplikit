import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  // Per-module output lets a consumer's bundler drop whole files it never imports,
  // instead of relying on it to prove top-level statements in one flat bundle are removable.
  unbundle: true,
  dts: true,
  clean: true,
  sourcemap: true,
  // To support React Server Components
  banner: { js: '"use client";' },
});
