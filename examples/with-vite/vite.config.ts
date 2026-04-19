import path from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Use source directly so the example app can run without prebuilding workspace packages.
      '@react-simplikit/mobile': path.resolve(__dirname, '../../packages/mobile/src/index.ts'),
    },
  },
});
