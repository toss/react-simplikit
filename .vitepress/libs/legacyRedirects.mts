import fs from 'node:fs';
import path from 'node:path';

import { legacyRoutePatterns, localeDirectories } from '../locales.mts';
import { listDirectories, projectRoot, SITE_ORIGIN } from '../shared.mts';

type RedirectPair = { from: string; to: string };

// Guide pages moved one-to-one, so they are listed instead of derived from a pattern.
const GUIDE_REDIRECTS: RedirectPair[] = [
  { from: 'core/intro.html', to: 'intro.html' },
  { from: 'core/why-react-simplikit-matters.html', to: 'why-react-simplikit-matters.html' },
  { from: 'core/installation.html', to: 'installation.html' },
  { from: 'core/ai-integration.html', to: 'ai-integration.html' },
  { from: 'core/design-principles.html', to: 'design-principles.html' },
  { from: 'core/contributing.html', to: 'contributing.html' },
  { from: 'mobile/intro.html', to: 'mobile-web.html' },
  { from: 'mobile/roadmap.html', to: 'mobile-web.html#roadmap' },
  { from: 'mobile/installation.html', to: 'installation.html' },
  { from: 'mobile/design-principles.html', to: 'design-principles.html' },
  { from: 'mobile/contributing.html', to: 'contributing.html' },
];

export function collectLegacyRedirects(): RedirectPair[] {
  return [...collectGuideRedirects(), ...collectReferenceRedirects()];
}

function collectGuideRedirects(): RedirectPair[] {
  return GUIDE_REDIRECTS.flatMap(pair => [
    pair,
    ...localeDirectories.map(locale => ({ from: `${locale}/${pair.from}`, to: `${locale}/${pair.to}` })),
  ]);
}

/**
 * A pattern like `packages/react-simplikit/src/hooks/:hook/:hook.md` with the
 * legacy destination `core/hooks/:hook.md` yields one pair per hook directory.
 */
function collectReferenceRedirects(): RedirectPair[] {
  return legacyRoutePatterns.flatMap(route => {
    const itemsRoot = path.join(projectRoot, route.source.split(/\/:\w+\//)[0]);

    return listDirectories(itemsRoot).map(name => ({
      from: toHtmlPath(route.from, name),
      to: toHtmlPath(route.to, name),
    }));
  });
}

function toHtmlPath(pattern: string, name: string): string {
  return pattern.replace(/:\w+/, name).replace(/\.md$/, '.html');
}

/** Writes one redirect stub per legacy URL into the build output. */
export function writeLegacyRedirectStubs(outDir: string): number {
  const pairs = collectLegacyRedirects();

  for (const pair of pairs) {
    copyMarkdownTwin(outDir, pair);

    const stubPath = path.join(outDir, pair.from);
    fs.mkdirSync(path.dirname(stubPath), { recursive: true });
    fs.writeFileSync(stubPath, renderStub(`/${pair.to}`));
  }

  return pairs.length;
}

/**
 * The llms plugin emits a raw Markdown twin of every page. A meta refresh is
 * useless to whatever fetches those, so the old path gets a copy of the new file
 * instead of a stub.
 */
function copyMarkdownTwin(outDir: string, { from, to }: RedirectPair): void {
  const source = path.join(outDir, to.replace(/\.html(#.*)?$/, '.md'));

  if (!fs.existsSync(source)) {
    return;
  }

  const target = path.join(outDir, from.replace(/\.html$/, '.md'));

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

/**
 * An instant meta refresh is treated as a permanent redirect by search engines,
 * and the canonical link points them at the new URL, so the stub works on any
 * static host with no server configuration. The script forwards the query and
 * fragment the meta refresh would drop; the meta tag stays as the no-JS fallback.
 */
function renderStub(target: string): string {
  const [pathname, fragment] = target.split('#');
  const fallback = fragment == null ? '' : `#${fragment}`;
  const script = `location.replace(${JSON.stringify(pathname)}+location.search+(location.hash||${JSON.stringify(fallback)}))`;

  return [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="utf-8">',
    `<meta http-equiv="refresh" content="0; url=${target}">`,
    `<link rel="canonical" href="${SITE_ORIGIN}${pathname}">`,
    `<script>${script}</script>`,
    `<title>Redirecting to ${target}</title>`,
    '</head>',
    `<body><p>This page moved to <a href="${target}">${target}</a>.</p></body>`,
    '</html>',
  ].join('\n');
}
