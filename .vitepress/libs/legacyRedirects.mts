import fs from 'node:fs';
import path from 'node:path';

import { legacyRoutePatterns, localeDirectories } from '../locales.mts';
import { projectRoot } from '../shared.mts';

const SITE_ORIGIN = 'https://react-simplikit.slash.page';

type RedirectPair = { from: string; to: string };

/**
 * Rebuilds the URL from its parts so the query and fragment a meta refresh would
 * drop survive. A target that already carries a fragment keeps it unless the
 * incoming URL has one of its own, and the query always lands before the hash.
 */
/**
 * Headings that moved into a differently named section during the guide merge.
 * Without this the incoming hash wins and lands on an id that no longer exists.
 */
const RETIRED_ANCHORS: Record<string, string> = {
  '#core-principles': '#mobile-specific-principles',
};

function REDIRECT_SCRIPT(target: string): string {
  const [pathname, fragment] = target.split('#');
  const fallback = fragment === undefined ? '' : `#${fragment}`;
  return (
    `var r=${JSON.stringify(RETIRED_ANCHORS)};` +
    `location.replace(${JSON.stringify(pathname)} + location.search + ` +
    `(r[location.hash] || location.hash || ${JSON.stringify(fallback)}))`
  );
}

/**
 * Guide pages moved with per-page targets (the merge folded eleven pages into
 * seven), so they are listed explicitly instead of derived from a pattern.
 */
const GUIDE_LEGACY: RedirectPair[] = [
  { from: 'core/intro.html', to: 'intro.html' },
  { from: 'core/why-react-simplikit-matters.html', to: 'why-react-simplikit-matters.html' },
  { from: 'core/installation.html', to: 'installation.html' },
  { from: 'core/ai-integration.html', to: 'ai-integration.html' },
  { from: 'core/design-principles.html', to: 'design-principles.html' },
  { from: 'core/contributing.html', to: 'contributing.html' },
  { from: 'mobile/intro.html', to: 'mobile-web.html' },
  { from: 'mobile/roadmap.html', to: 'mobile-web.html#roadmap' },
  { from: 'mobile/installation.html', to: 'installation.html' },
  { from: 'mobile/design-principles.html', to: 'mobile-web.html#mobile-specific-principles' },
  { from: 'mobile/contributing.html', to: 'mobile-web.html#mobile-specific-guidelines' },
];

/**
 * Expands the parameterized legacy routes against the actual source tree.
 * A pattern like `packages/react-simplikit/src/hooks/:hook/:hook.md` with the
 * legacy destination `core/hooks/:hook.md` yields one pair per hook directory.
 */
export function collectLegacyRedirects(): RedirectPair[] {
  const pairs: RedirectPair[] = GUIDE_LEGACY.flatMap(pair => [
    pair,
    ...localeDirectories.map(locale => ({ from: `${locale}/${pair.from}`, to: `${locale}/${pair.to}` })),
  ]);

  for (const route of legacyRoutePatterns) {
    const parameter = route.from.match(/:([A-Za-z]+)\.md$/)?.[1];

    if (parameter === undefined) {
      continue;
    }

    const itemsRoot = path.join(projectRoot, route.source.split(`/:${parameter}/`)[0]);

    if (!fs.existsSync(itemsRoot)) {
      continue;
    }

    for (const entry of fs.readdirSync(itemsRoot, { withFileTypes: true })) {
      if (!entry.isDirectory()) {
        continue;
      }

      pairs.push({
        from: route.from.replace(`:${parameter}`, entry.name).replace(/\.md$/, '.html'),
        to: route.to.replace(`:${parameter}`, entry.name).replace(/\.md$/, '.html'),
      });
    }
  }

  return pairs;
}

/**
 * Writes one redirect stub per legacy URL into the build output. An instant
 * meta refresh is treated as a permanent redirect by search engines, and the
 * canonical link points them at the new URL, so the stubs work on any static
 * host with no server configuration.
 */
export function writeLegacyRedirectStubs(outDir: string): number {
  const pairs = collectLegacyRedirects();

  for (const { from, to } of pairs) {
    const target = `/${to}`;
    const stubPath = path.join(outDir, from);

    // The llms plugin emits a raw Markdown twin of every page. A meta refresh is
    // useless to whatever fetches those, so the old path gets a copy of the new
    // file instead of a stub.
    const markdownSource = path.join(outDir, to.replace(/\.html(#.*)?$/, '.md'));
    const markdownTarget = path.join(outDir, from.replace(/\.html$/, '.md'));

    if (fs.existsSync(markdownSource)) {
      fs.mkdirSync(path.dirname(markdownTarget), { recursive: true });
      fs.copyFileSync(markdownSource, markdownTarget);
    }

    fs.mkdirSync(path.dirname(stubPath), { recursive: true });
    fs.writeFileSync(
      stubPath,
      [
        '<!DOCTYPE html>',
        '<html lang="en">',
        '<head>',
        '<meta charset="utf-8">',
        `<meta http-equiv="refresh" content="0; url=${target}">`,
        `<link rel="canonical" href="${SITE_ORIGIN}${target.split('#')[0]}">`,
        // Carries the fragment and query the meta refresh would drop; the meta
        // tag above stays as the no-JS fallback.
        `<script>${REDIRECT_SCRIPT(target)}</script>`,
        `<title>Redirecting to ${target}</title>`,
        '</head>',
        `<body><p>This page moved to <a href="${target}">${target}</a>.</p></body>`,
        '</html>',
      ].join('\n')
    );
  }

  return pairs.length;
}
