import { defineConfig } from 'vitepress';
import { shared } from './shared.mts';
import { ko } from './ko.mts';
import { en } from './en.mts';

export default defineConfig({
  ...shared,
  locales: {
    root: { label: 'English', ...en },
    ko: { label: '한국어', ...ko },
  },
});
