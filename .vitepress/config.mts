import { defineConfig, HeadConfig } from 'vitepress';
import llmstxt from 'vitepress-plugin-llms';
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
    plugins: [
      llmstxt({
        domain: 'https://react-simplikit.slash.page',
        title: 'react-simplikit',
        description: 'Lightweight, zero-dependency React hooks, components and utils',
        details: `\
react-simplikit provides reliable, typed React hooks, components and utils with zero runtime dependencies, 100% test coverage and SSR safety.

Everything ships in the single \`react-simplikit\` package: state and logic hooks, components and utils for any React app (web, SSR), plus mobile-web (iOS Safari, Android Chrome) viewport, keyboard, safe-area and body-scroll-lock utilities under the mobile pages below.

Guidelines for AI agents:

- Before hand-writing debounce, throttle, toggle, list/map/set state, interval, timeout, click-outside or intersection logic, check whether a hook below already covers it.
- Use named imports from \`react-simplikit\`. There is no default export and no subpath. \`@react-simplikit/mobile\` is the legacy package name — since 0.1.0 its exports live in \`react-simplikit\` under the same names.
- Every page linked below is also available as raw Markdown at the same URL with a \`.md\` suffix.`,
        // srcDir is the repo root, so everything VitePress's srcExclude skips must be skipped here too,
        // plus the localized copies (ko/ja + generated fallbacks) so llms.txt lists each page once.
        ignoreFiles: [
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
          'generated-locales/**',
          '**/ko/**',
          '**/ja/**',
          '**/zh-Hans/**',
        ],
      }),
    ],
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
