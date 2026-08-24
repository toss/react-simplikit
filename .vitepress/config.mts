import { defineConfig, HeadConfig } from 'vitepress';
import { buildLocaleConfig } from './libs/buildLocaleConfig.mts';
import { generatedRewrites, localeDefinitions, rewrites } from './locales.mts';

const locales = Object.fromEntries(
  Object.entries(localeDefinitions).map(([code, definition]) => [
    code,
    { label: definition.label, ...buildLocaleConfig(definition) },
  ])
);

const searchLocales = Object.fromEntries(
  Object.entries(localeDefinitions)
    .filter(([, definition]) => definition.themeStrings.search !== undefined)
    .map(([code, definition]) => [code, definition.themeStrings.search])
);

export default defineConfig({
  title: 'react-simplikit',
  locales,
  srcDir: '.',
  srcExclude: [
    '**/node_modules/**',
    '**/README*.md',
    '**/CHANGELOG.md',
    'CONTRIBUTING.md',
    'CLAUDE.md',
    'AGENTS.md',
    '**/hook-design-principles.md',
    '**/react-hook-usage-patterns.md',
    'examples/**',
    'packages/plugin/**',
    'packages/**/*.ts',
    'packages/**/*.tsx',
  ],
  vite: {
    resolve: {
      dedupe: ['vue', 'vitepress'],
    },
  },
  rewrites: { ...rewrites, ...generatedRewrites },
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
        locales: searchLocales,
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
