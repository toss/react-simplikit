import glob from 'fast-glob';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import path from 'node:path';

import { localeDirectories } from '../.vitepress/locales.mts';

import { renderEnglishDoc } from './commands/generateDocs/index.ts';
import { PACKAGE_INDEX_FILE } from './commands/generateSkill/index.ts';
import { collectDocTags } from './utils/collectDocTags.ts';
import { collectPublicExports } from './utils/collectPublicExports.ts';
import { getRootPath } from './utils/getRootPath.ts';

const root = getRootPath();
const publicExports = await collectPublicExports(path.join(root, PACKAGE_INDEX_FILE));
const docTags = await collectDocTags(root, publicExports);
const deprecatedExports = new Set(docTags.deprecated);
const noDocsExports = new Set(docTags.noDocs);

// The English pages are generated from JSDoc, and `verifySkill.ts` checks the skill against those
// pages — so a page that drifts from its source carries the drift into the skill unnoticed.
// A `@no-docs` export is the exception: it has no page.
for (const name of publicExports) {
  const [sourceFilePath] = await glob(`packages/react-simplikit/src/**/${name}.ts?(x)`, {
    absolute: true,
    cwd: root,
    ignore: ['**/*.spec.*', '**/*.test.*', '**/_internal/**'],
  });

  assert.ok(sourceFilePath, `${name} is exported but has no source file`);

  const documentPath = path.join(path.dirname(sourceFilePath), `${name}.md`);

  // The routes, the sidebar, the reference index and the legacy redirects all expect one page per
  // folder, named after it: a page elsewhere is unreachable, and a folder without one is a dead entry.
  if (noDocsExports.has(name)) {
    assert.notEqual(
      path.basename(path.dirname(sourceFilePath)),
      name,
      `${name} is @no-docs, so it cannot keep a folder of its own — move it into the folder of a documented export`
    );
    assert.equal(
      await pathExists(documentPath),
      false,
      `${path.relative(root, documentPath)} must not exist: ${name} is @no-docs, so it has no documentation page — delete it and its translations`
    );
    continue;
  }

  assert.equal(
    path.basename(path.dirname(sourceFilePath)),
    name,
    `${name} has a documentation page, so it needs a folder of its own — move it into ${name}/, or tag it @no-docs if it is an old name kept in its replacement's folder`
  );
  assert.equal(
    await fs.readFile(documentPath, 'utf8'),
    await renderEnglishDoc(name, sourceFilePath),
    `${path.relative(root, documentPath)} is out of date — run \`yarn docs:gen ${name}\` and commit the result`
  );

  if (deprecatedExports.has(name)) {
    // Translations are written by hand, so the warning the English page gets from `docs:gen` has to be
    // carried over; without it a reader of a translated page would not know the export is deprecated.
    for (const locale of localeDirectories) {
      const translationPath = path.join(path.dirname(sourceFilePath), locale, `${name}.md`);

      if (await pathExists(translationPath)) {
        assert.match(
          await fs.readFile(translationPath, 'utf8'),
          /^# .*\n+::: warning\b/,
          `${path.relative(root, translationPath)} must open with a translated \`::: warning\` block, because ${name} is @deprecated`
        );
      }
    }
  }
}

// These pages name exports by hand, so a renamed or removed export would leave a dead
// name behind and nothing else reads them. Both inline code and reference links count.
const exportNames = new Set(publicExports);
const handWrittenPages = await glob(
  [
    'README*.md',
    'packages/react-simplikit/README*.md',
    'docs/{mobile-web,use-cases}.md',
    'docs/*/{mobile-web,use-cases}.md',
  ],
  { cwd: root }
);
const exportMentions = [
  /`((?:use|get|is|subscribe|enable|disable|merge|build)[A-Z][A-Za-z]*|SwitchCase|Separated|ImpressionArea)`/g,
  /\]\(\/(?:[A-Za-z-]+\/)?(?:hooks|components|utils)\/([A-Za-z]+)\)/g,
];

for (const page of handWrittenPages) {
  const text = await fs.readFile(path.join(root, page), 'utf8');

  for (const pattern of exportMentions) {
    for (const [, name] of text.matchAll(pattern)) {
      assert.equal(exportNames.has(name), true, `${page} names \`${name}\`, which is not a public export`);
    }
  }
}

async function pathExists(target: string): Promise<boolean> {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}
