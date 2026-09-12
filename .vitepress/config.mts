import { defineConfig, HeadConfig } from 'vitepress';
import llmstxt from 'vitepress-plugin-llms';
import { buildLocaleConfig } from './libs/buildLocaleConfig.mts';
import { generatedRewrites, localeDefinitions, rewrites } from './locales.mts';
import { writeLegacyRedirectStubs } from './libs/legacyRedirects.mts';
import { SITE_ORIGIN } from './shared.mts';

const fallbackUrls = new Set<string>();

function pageUrl(relativePath: string): string {
  return relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '.html');
}

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
        domain: SITE_ORIGIN,
        title: 'react-simplikit',
        description: 'Lightweight, zero-dependency React hooks, components and utils',
        details: `\
react-simplikit provides reliable, typed React hooks, components and utils with zero runtime dependencies, 100% test coverage and SSR safety.

Everything ships in one package, \`react-simplikit\`: state and logic hooks, components and utils for any React app (web, SSR), plus hooks for mobile web problems — viewport, keyboard, safe area and body scroll lock.

Guidelines for AI agents:

- Before hand-writing debounce, throttle, toggle, list/map/set state, interval, timeout, click-outside or intersection logic, check whether a hook below already covers it.
- Use named imports from \`react-simplikit\`. There is no default export and no subpath.
- Every page linked below is also available as raw Markdown at the same URL with a \`.md\` suffix.`,
        // srcDir is the repo root, so everything VitePress's srcExclude skips must be skipped here too,
        // plus the localized copies (every registered locale + generated fallbacks) so llms.txt lists each page once.
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
          '**/es/**',
        ],
      }),
    ],
  },
  rewrites: { ...rewrites, ...generatedRewrites },
  sitemap: {
    hostname: SITE_ORIGIN,
    transformItems: items =>
      items
        .filter(item => !fallbackUrls.has(item.url))
        .map(item => ({ ...item, links: item.links?.filter(link => !fallbackUrls.has(link.url)) })),
  },
  markdown: {
    config(md) {
      md.core.ruler.after('inline', 'page-description', state => {
        if (state.inlineMode) {
          return;
        }
        const { frontmatter } = state.env as {
          frontmatter: { description?: string; hero?: { text?: string } };
        };
        if (frontmatter.description != null) {
          return;
        }

        const paragraph = state.tokens.findIndex(token => token.type === 'paragraph_open' && token.level === 0);
        const text = state.tokens[paragraph + 1]?.children
          ?.map(token => {
            if (token.type === 'text' || token.type === 'code_inline') {
              return token.content;
            }
            return token.type === 'softbreak' || token.type === 'hardbreak' ? ' ' : '';
          })
          .join('');
        frontmatter.description = frontmatter.hero?.text ?? text?.replace(/\s+/g, ' ').trim();
      });
    },
  },
  transformPageData(pageData) {
    const url = pageUrl(pageData.relativePath);
    const isFallback = pageData.frontmatter.untranslated === true;
    if (isFallback) {
      fallbackUrls.add(url);
    } else {
      fallbackUrls.delete(url);
    }
    const canonical = `${SITE_ORIGIN}/${isFallback ? url.slice(url.indexOf('/') + 1) : url}`;
    const title =
      pageData.title === '' || pageData.title === 'react-simplikit'
        ? 'react-simplikit'
        : `${pageData.title} | react-simplikit`;
    const head: HeadConfig[] = [
      ['link', { rel: 'canonical', href: canonical }],
      ['meta', { property: 'og:url', content: canonical }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: pageData.description }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: pageData.description }],
    ];
    pageData.frontmatter.head ??= [];
    pageData.frontmatter.head.push(...head);
  },
  buildEnd: async siteConfig => {
    const count = writeLegacyRedirectStubs(siteConfig.outDir);
    console.log(`legacy redirect stubs: ${count}`);
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
    ['meta', { property: 'og:site_name', content: 'react-simplikit' }],
    ['meta', { property: 'og:image', content: `${SITE_ORIGIN}/images/og.png` }],
    ['meta', { name: 'twitter:image', content: `${SITE_ORIGIN}/images/og.png` }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ],
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
