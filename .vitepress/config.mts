import { defineConfig } from 'vitepress';
import { en } from './en.mts';
import { ko } from './ko.mts';

export default defineConfig({
  title: 'reactive-kit',
  locales: {
    root: { label: 'English', ...en },
    ko: { label: '한국어', ...ko },
  },
  srcDir: 'src',
  rewrites: {
    'docs/ko/:document.md': 'ko/:document.md',
    'docs/en/:document.md': ':document.md',
    'components/:implementation/ko/:implementation.md': 'ko/components/:implementation.md',
    'components/:implementation/:implementation.md': 'components/:implementation.md',
    'hooks/:implementation/ko/:implementation.md': 'ko/hooks/:implementation.md',
    'hooks/:implementation/:implementation.md': 'hooks/:implementation.md',
    'utils/:implementation/ko/:implementation.md': 'ko/utils/:implementation.md',
    'utils/:implementation/:implementation.md': 'utils/:implementation.md',
  },
});
