import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

import { SITE_ORIGIN } from '../../.vitepress/shared.mts';

const { JSDOM } = createRequire(import.meta.url)('jsdom') as {
  JSDOM: new (html: string, options?: { contentType: string }) => { window: Window };
};

/** Checks the rendered output, including VitePress's rewrites and generated fallbacks. */
export async function assertSeoOutput(buildOutputDirectory: string): Promise<void> {
  const sitemap = new JSDOM(await readFile(path.join(buildOutputDirectory, 'sitemap.xml'), 'utf8'), {
    contentType: 'application/xml',
  });
  const entries = Array.from(sitemap.window.document.querySelectorAll('url'));
  const urls = entries.map(entry => entry.querySelector('loc')!.textContent!);
  assert.ok(urls.length > 0, 'the sitemap must contain canonical pages');
  assert.equal(new Set(urls).size, urls.length, 'sitemap URLs must be unique');

  for (const entry of entries) {
    const url = entry.querySelector('loc')!.textContent!;
    assert.equal(/\/(?:generated-locales|core|mobile)\//.test(url), false, `unexpected sitemap URL: ${url}`);
    for (const alternate of Array.from(entry.getElementsByTagNameNS('http://www.w3.org/1999/xhtml', 'link'))) {
      assert.ok(urls.includes(alternate.getAttribute('href')!), `${url} links a non-canonical alternate`);
    }
  }

  const cases = [
    ['', ''],
    ['ko/', 'ko/'],
    ['use-cases.html', 'use-cases.html'],
    ['ko/use-cases.html', 'ko/use-cases.html'],
    ['ja/use-cases.html', 'ja/use-cases.html'],
    ['zh-Hans/use-cases.html', 'zh-Hans/use-cases.html'],
    ['es/use-cases.html', 'es/use-cases.html'],
    ['hooks/useDebounce.html', 'hooks/useDebounce.html'],
    ['ko/hooks/useDebounce.html', 'ko/hooks/useDebounce.html'],
    ['ja/hooks/useDebounce.html', 'hooks/useDebounce.html'],
    ['ko/untranslated-fallback-fixture.html', 'untranslated-fallback-fixture.html'],
  ];
  for (const [route, canonicalRoute] of cases) {
    const html = await readFile(
      path.join(buildOutputDirectory, route.endsWith('.html') ? route : `${route}index.html`),
      'utf8'
    );
    const dom = new JSDOM(html.slice(0, html.indexOf('</head>') + '</head>'.length));
    const { document } = dom.window;
    const canonical = `${SITE_ORIGIN}/${canonicalRoute}`;
    const canonicalLinks = document.querySelectorAll('link[rel="canonical"]');
    assert.equal(canonicalLinks.length, 1, `${route} must have one canonical link`);
    assert.equal(canonicalLinks[0].getAttribute('href'), canonical);
    assert.equal(urls.includes(`${SITE_ORIGIN}/${route}`), route === canonicalRoute, `${route} sitemap membership`);

    const description = document.querySelector('meta[name="description"]')?.getAttribute('content');
    assert.ok(
      description != null && description.length > 0 && description !== 'A VitePress site',
      `${route} description`
    );
    for (const [selector, expected] of [
      ['meta[property="og:url"]', canonical],
      ['meta[property="og:title"]', document.title],
      ['meta[name="twitter:title"]', document.title],
      ['meta[property="og:description"]', description],
      ['meta[name="twitter:description"]', description],
    ]) {
      const tags = document.querySelectorAll(selector);
      assert.equal(tags.length, 1, `${route} must have one ${selector}`);
      assert.equal(tags[0].getAttribute('content'), expected, `${route} ${selector}`);
    }
    if (route === 'ko/untranslated-fallback-fixture.html') {
      assert.equal(description, 'Read React and hooks with useToggle. Choose a hook for your app.');
    }
    dom.window.close();
  }

  for (const [route, languages] of [
    ['use-cases.html', ['en', 'ko', 'ja', 'zh-Hans', 'es']],
    ['hooks/useDebounce.html', ['en', 'ko']],
  ] as const) {
    for (const language of languages) {
      const url = `${SITE_ORIGIN}/${language === 'en' ? '' : `${language}/`}${route}`;
      const entry = entries.find(item => item.querySelector('loc')!.textContent === url);
      assert.ok(entry, `${url} must be indexed`);
      const alternates = Array.from(entry.getElementsByTagNameNS('http://www.w3.org/1999/xhtml', 'link'));
      assert.deepEqual(alternates.map(link => link.getAttribute('hreflang')).sort(), [...languages].sort());
    }
  }
  sitemap.window.close();

  const installation = new JSDOM(await readFile(path.join(buildOutputDirectory, 'installation.html'), 'utf8'));
  assert.equal(
    installation.window.document.querySelector('meta[name="description"]')?.getAttribute('content'),
    'How to install react-simplikit'
  );
  installation.window.close();
  assert.equal(urls.includes(`${SITE_ORIGIN}/404.html`), false);
  console.log('SEO metadata, canonical URLs and translated sitemap alternates passed');
}
