import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import path from 'node:path';

import { collectPublicExports } from './collectPublicExports.ts';

type AssertLlmsOutputOptions = {
  buildOutputDirectory: string;
  root: string;
};

const PACKAGE_INDEX_FILE = 'packages/react-simplikit/src/index.ts';

// The generated links are absolute (the plugin's `domain` option), and every documentation page
// lives under core/ or mobile/. A ko/ or ja/ link means the localized copies leaked into the
// listing, which would make an agent read the same page several times in different languages.
const ALLOWED_LINK = /^https:\/\/react-simplikit\.slash\.page\/(?:hooks|components|utils|core|mobile)\/[^/]+\.md$/;

/**
 * Checks the llms outputs vitepress-plugin-llms wrote into a docs build:
 * every public export has a page in llms.txt, localized copies are not listed,
 * and the per-page Markdown exists.
 */
export async function assertLlmsOutput({ buildOutputDirectory, root }: AssertLlmsOutputOptions): Promise<void> {
  const llmsTxt = await fs.readFile(path.join(buildOutputDirectory, 'llms.txt'), 'utf8');
  const links = [...llmsTxt.matchAll(/\]\((\S+?\.md)\)/g)].map(match => match[1]);

  assert.notEqual(links.length, 0, 'llms.txt must list the documentation pages');

  for (const link of links) {
    assert.match(
      link,
      ALLOWED_LINK,
      `llms.txt must only link English pages in the flat reference namespaces or the guides: ${link}`
    );
  }

  for (const name of await collectPublicExports(path.join(root, PACKAGE_INDEX_FILE))) {
    assert.equal(
      links.some(link => link.endsWith(`/${name}.md`)),
      true,
      `llms.txt must link the documentation page of ${name}`
    );
  }

  const llmsFullTxt = await fs.readFile(path.join(buildOutputDirectory, 'llms-full.txt'), 'utf8');
  assert.equal(llmsFullTxt.includes('# useDebounce'), true, 'llms-full.txt must inline the page contents');

  const pageMarkdown = await fs.readFile(path.join(buildOutputDirectory, 'hooks/useDebounce.md'), 'utf8');
  assert.equal(pageMarkdown.includes('# useDebounce'), true, 'each page must be served as Markdown');
  assert.equal(pageMarkdown.includes('<Interface'), false, 'each page must be served without the VitePress components');
}
