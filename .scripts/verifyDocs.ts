import glob from 'fast-glob';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import path from 'node:path';

import { renderEnglishDoc } from './commands/generateDocs/index.ts';
import { PACKAGE_INDEX_FILE } from './commands/generateSkill/index.ts';
import { collectPublicExports } from './utils/collectPublicExports.ts';
import { getRootPath } from './utils/getRootPath.ts';

const root = getRootPath();
const publicExports = await collectPublicExports(path.join(root, PACKAGE_INDEX_FILE));

// The English pages are generated from JSDoc, and `verifySkill.ts` checks the skill against those
// pages — so a page that drifts from its source carries the drift into the skill unnoticed.
for (const name of publicExports) {
  const [sourceFilePath] = await glob(`packages/react-simplikit/src/**/${name}.ts?(x)`, {
    absolute: true,
    cwd: root,
    ignore: ['**/*.spec.*', '**/*.test.*'],
  });

  assert.ok(sourceFilePath, `${name} is exported but has no source file`);

  const documentPath = path.join(path.dirname(sourceFilePath), `${name}.md`);

  assert.equal(
    await fs.readFile(documentPath, 'utf8'),
    await renderEnglishDoc(name, sourceFilePath),
    `${path.relative(root, documentPath)} is out of date — run \`yarn docs:gen ${name}\` and commit the result`
  );
}

// These pages name exports by hand, so a renamed or removed export would leave a dead
// name behind and nothing else reads them. Both inline code and reference links count.
const exportNames = new Set(publicExports);
const handWrittenPages = await glob(
  ['README*.md', 'packages/react-simplikit/README*.md', 'docs/mobile-web.md', 'docs/*/mobile-web.md'],
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
