import { defineConfig, HeadConfig } from 'vitepress';
import { en } from './en.mts';
import { ko, search as koSearch } from './ko.mts';

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
  head: [
    ['link', { rel: 'stylesheet', href: 'https://static.toss.im/tps/main.css' }],
    ['link', { rel: 'stylesheet', href: 'https://static.toss.im/tps/others.css' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon/favicon-96x96.png', sizes: '96x96' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon/favicon.svg' }],
    ['link', { rel: 'shortcut icon', href: '/favicon/favicon.ico' }],
    ['link', { rel: 'apple-touch-icon', href: '/favicon/apple-touch-icon.png' }],
    ['link', { rel: 'manifest', href: '/favicon/site.webmanifest' }],
    ['meta', { name: 'author', content: 'Viva Republica, Inc.' }],
    ['meta', { name: 'keywords', content: 'react, hooks, utility, library, reactive-kit' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'reactive-kit' }],
    ['meta', { property: 'og:description', content: 'Lightweight and powerful React utility library' }],
    ['meta', { property: 'og:site_name', content: 'reactive-kit' }],
    ['meta', { property: 'og:image', content: 'https://reactive-kit.slash.page/images/og.png' }],
    ['meta', { name: 'twitter:image', content: 'https://reactive-kit.slash.page/images/og.png' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ],
  transformHead: ({ pageData }) => {
    const head: HeadConfig[] = [];
    const title = pageData.frontmatter.title || pageData.title || 'reactive-kit';
    const description =
      pageData.frontmatter.description || pageData.description || 'Lightweight and powerful React utility library';

    head.push(['meta', { property: 'og:title', content: title }]);
    head.push(['meta', { property: 'og:description', content: description }]);

    return head;
  },
  themeConfig: {
    logo: '/images/logo.svg',
    search: {
      provider: 'local',
      options: {
        locales: {
          ...koSearch,
        },
      },
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/toss/reactive-kit' },
      {
        icon: 'npm',
        link: 'https://www.npmjs.com/package/reactive-kit',
        ariaLabel: 'npm',
      },
    ],
  },
});
