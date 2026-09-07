import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, it } from 'vitest';

import { prepareLocalizedFallbacks } from './index.ts';

const fixtureDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(fixtureDirectories.splice(0).map(directory => fs.rm(directory, { force: true, recursive: true })));
});

describe('prepareLocalizedFallbacks', () => {
  it('creates a marked English fallback when a localized document is missing', async () => {
    const root = await createFixtureDirectory();
    await writeFile(root, 'docs/intro.md', '# Introduction\n');

    await prepareLocalizedFallbacks({ localeDirectories: ['ja'], root });

    await expectFile(
      root,
      'generated-locales/docs/ja/intro.md',
      `---\nuntranslated: true\nsourceLocale: en\n---\n# Introduction\n`
    );
  });

  it('does not create a fallback when a localized document exists', async () => {
    const root = await createFixtureDirectory();
    await writeFile(root, 'packages/react-simplikit/src/hooks/useExample/useExample.md', '# useExample\n');
    await writeFile(root, 'packages/react-simplikit/src/hooks/useExample/ja/useExample.md', '# useExample Japanese\n');

    await prepareLocalizedFallbacks({ localeDirectories: ['ja'], root });

    await assert.rejects(
      fs.access(path.join(root, 'generated-locales/packages/react-simplikit/src/hooks/useExample/ja/useExample.md'))
    );
  });
});

async function createFixtureDirectory() {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'react-simplikit-fallback-'));
  fixtureDirectories.push(directory);
  return directory;
}

async function writeFile(root: string, relativePath: string, content: string) {
  const filePath = path.join(root, relativePath);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content);
}

async function expectFile(root: string, relativePath: string, expectedContent: string) {
  assert.equal(await fs.readFile(path.join(root, relativePath), 'utf8'), expectedContent);
}
