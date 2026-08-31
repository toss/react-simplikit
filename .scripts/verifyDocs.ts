import glob from 'fast-glob';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import path from 'node:path';

import { renderEnglishDoc } from './commands/generateDocs/index.ts';
import { PACKAGE_INDEX_FILE } from './commands/generateSkill/index.ts';
import { collectPublicExports } from './utils/collectPublicExports.ts';
import { getRootPath } from './utils/getRootPath.ts';

const root = getRootPath();

// The English pages are generated from JSDoc, and `verifySkill.ts` checks the skill against those
// pages — so a page that drifts from its source carries the drift into the skill unnoticed.
for (const name of await collectPublicExports(path.join(root, PACKAGE_INDEX_FILE))) {
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
