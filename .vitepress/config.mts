import { defineConfig, HeadConfig } from 'vitepress';
import { en } from './en.mts';
import { ko, search as koSearch } from './ko.mts';

export default defineConfig({
  title: 'react-simplikit',
  locales: {
    root: { label: 'English', ...en },
    ko: { label: '한국어', ...ko },
  },
  srcDir: '.',
  srcExclude: [
    '**/node_modules/**',
    '**/README*.md',
    '**/CHANGELOG.md',
    'CONTRIBUTING.md',
    'packages/**/*.ts',
    'packages/**/*.tsx',
  ],
  vite: {
    resolve: {
      dedupe: ['vue', 'vitepress'],
    },
  },
  rewrites: {
    // Landing page
    'docs/index.md': 'index.md',
    'docs/ko/index.md': 'ko/index.md',

    // Core guide docs
    'docs/core/:doc.md': 'core/:doc.md',
    'docs/ko/core/:doc.md': 'ko/core/:doc.md',

    // Mobile guide docs
    'docs/mobile/:doc.md': 'mobile/:doc.md',
    'docs/ko/mobile/:doc.md': 'ko/mobile/:doc.md',

    // Core hooks
    'packages/core/src/hooks/:hook/:hook.md': 'core/hooks/:hook.md',
    'packages/core/src/hooks/:hook/ko/:hook.md': 'ko/core/hooks/:hook.md',

    // Core components
    'packages/core/src/components/:component/:component.md': 'core/components/:component.md',
    'packages/core/src/components/:component/ko/:component.md': 'ko/core/components/:component.md',

    // Core utils
    'packages/core/src/utils/:util/:util.md': 'core/utils/:util.md',
    'packages/core/src/utils/:util/ko/:util.md': 'ko/core/utils/:util.md',

    // Mobile hooks
    'packages/mobile/src/hooks/:hook/:hook.md': 'mobile/hooks/:hook.md',
    'packages/mobile/src/hooks/:hook/ko/:hook.md': 'ko/mobile/hooks/:hook.md',

    // Mobile utils
    'packages/mobile/src/utils/:util/:util.md': 'mobile/utils/:util.md',
    'packages/mobile/src/utils/:util/ko/:util.md': 'ko/mobile/utils/:util.md',

    // Mobile keyboardHeight (special case - folder name differs from hook name)
    'packages/mobile/src/hooks/keyboardHeight/useKeyboardHeight.md': 'mobile/hooks/useKeyboardHeight.md',
    'packages/mobile/src/hooks/keyboardHeight/ko/useKeyboardHeight.md': 'ko/mobile/hooks/useKeyboardHeight.md',
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
    ['meta', { name: 'keywords', content: 'react, hooks, utility, library, react-simplikit, mobile' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'react-simplikit' }],
    ['meta', { property: 'og:description', content: 'Lightweight and powerful React utility library' }],
    ['meta', { property: 'og:site_name', content: 'react-simplikit' }],
    ['meta', { property: 'og:image', content: 'https://react-simplikit.slash.page/images/og.png' }],
    ['meta', { name: 'twitter:image', content: 'https://react-simplikit.slash.page/images/og.png' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ],
  transformHead: ({ pageData }) => {
    const head: HeadConfig[] = [];
    const title = pageData.frontmatter.title || pageData.title || 'react-simplikit';
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
      { icon: 'github', link: 'https://github.com/toss/react-simplikit' },
      {
        icon: 'npm',
        link: 'https://www.npmjs.com/package/react-simplikit',
        ariaLabel: 'npm',
      },
    ],
  },
});
