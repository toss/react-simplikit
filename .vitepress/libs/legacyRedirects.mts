import fs from 'node:fs';
import path from 'node:path';

import { legacyRoutePatterns } from '../locales.mts';
import { projectRoot } from '../shared.mts';

const SITE_ORIGIN = 'https://react-simplikit.slash.page';

type RedirectPair = { from: string; to: string };

/**
 * Expands the parameterized legacy routes against the actual source tree.
 * A pattern like `packages/react-simplikit/src/hooks/:hook/:hook.md` with the
 * legacy destination `core/hooks/:hook.md` yields one pair per hook directory.
 */
export function collectLegacyRedirects(): RedirectPair[] {
  const pairs: RedirectPair[] = [];

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

    fs.mkdirSync(path.dirname(stubPath), { recursive: true });
    fs.writeFileSync(
      stubPath,
      [
        '<!DOCTYPE html>',
        '<html lang="en">',
        '<head>',
        '<meta charset="utf-8">',
        `<meta http-equiv="refresh" content="0; url=${target}">`,
        `<link rel="canonical" href="${SITE_ORIGIN}${target}">`,
        '<meta name="robots" content="noindex">',
        `<title>Redirecting to ${target}</title>`,
        '</head>',
        `<body><p>This page moved to <a href="${target}">${target}</a>.</p></body>`,
        '</html>',
      ].join('\n')
    );
  }

  return pairs.length;
}
