import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

import { SITE_ORIGIN } from '../../.vitepress/shared.mts';

const { JSDOM } = createRequire(import.meta.url)('jsdom') as {
  JSDOM: new (html: string, options?: { contentType: string }) => { window: Window };
};

export async function assertSeoOutput(buildOutputDirectory: string): Promise<void> {
  const sitemap = new JSDOM(await readFile(path.join(buildOutputDirectory, 'sitemap.xml'), 'utf8'), {
    contentType: 'application/xml',
  });
  const entries = sitemap.window.document.querySelectorAll('url');
  const sitemapUrls = new Set(Array.from(entries, entry => entry.querySelector('loc')!.textContent!));
  assert.ok(sitemapUrls.size > 0, 'the sitemap must contain canonical pages');
  assert.equal(sitemapUrls.size, entries.length, 'sitemap URLs must be unique');
  for (const url of sitemapUrls) {
    assert.equal(
      /\/(?:generated-locales|core|mobile)\/|\/404\.html$/.test(url),
      false,
      `unexpected sitemap URL: ${url}`
    );
  }
  const alternates = Array.from(sitemap.window.document.getElementsByTagNameNS('http://www.w3.org/1999/xhtml', 'link'));
  assert.ok(alternates.length > 0, 'the sitemap must include alternate-language links');
  for (const alternate of alternates) {
    assert.ok(sitemapUrls.has(alternate.getAttribute('href')!), 'alternates must point to canonical pages');
  }
  sitemap.window.close();

  for (const [route, canonicalRoute] of [
    ['index.html', ''],
    ['ko/index.html', 'ko/'],
    ['installation.html', 'installation.html'],
    ['ko/use-cases.html', 'ko/use-cases.html'],
    ['ja/hooks/useDebounce.html', 'hooks/useDebounce.html'],
  ]) {
    const html = await readFile(path.join(buildOutputDirectory, route), 'utf8');
    const dom = new JSDOM(html.slice(0, html.indexOf('</head>') + '</head>'.length));
    const { document } = dom.window;
    const canonical = `${SITE_ORIGIN}/${canonicalRoute}`;
    const pageUrl = `${SITE_ORIGIN}/${route.replace(/index\.html$/, '')}`;
    assert.ok(sitemapUrls.has(canonical), `${route} canonical URL must appear in the sitemap`);
    assert.equal(sitemapUrls.has(pageUrl), pageUrl === canonical, `${route} sitemap membership`);
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content');
    assert.ok(
      description != null && description.length > 0 && description !== 'A VitePress site',
      `${route} description`
    );
    if (route === 'installation.html') {
      assert.equal(description, 'How to install react-simplikit');
    }
    for (const [selector, attribute, expected] of [
      ['link[rel="canonical"]', 'href', canonical],
      ['meta[property="og:url"]', 'content', canonical],
      ['meta[property="og:title"]', 'content', document.title],
      ['meta[name="twitter:title"]', 'content', document.title],
      ['meta[property="og:description"]', 'content', description],
      ['meta[name="twitter:description"]', 'content', description],
    ]) {
      const tags = document.querySelectorAll(selector);
      assert.equal(tags.length, 1, `${route} must have one ${selector}`);
      assert.equal(tags[0].getAttribute(attribute), expected, `${route} ${selector}`);
    }
    dom.window.close();
  }
  console.log('SEO metadata, canonical URLs and sitemap passed');
}
