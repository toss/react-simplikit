import path from 'path';
import { defineConfig } from 'vitepress';

export const docsRoot = path.resolve(import.meta.dirname, '..', '..', 'src');

export const shared = defineConfig({
  title: 'reactie',
});
