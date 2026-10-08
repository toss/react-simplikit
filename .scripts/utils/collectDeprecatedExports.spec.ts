import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, it } from 'vitest';

import { collectDeprecatedExports } from './collectDeprecatedExports.ts';

const fixtureDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(fixtureDirectories.splice(0).map(directory => fs.rm(directory, { force: true, recursive: true })));
});

describe('collectDeprecatedExports', () => {
  it('keeps the exports whose own JSDoc is @deprecated, wherever their source sits', async () => {
    const root = await writeFixtureRoot({
      'hooks/useNew/useNew.ts': '/**\n * @description Does it.\n */\nexport function useNew() {}\n',
      'hooks/useNew/useNew.test.ts': '/**\n * @deprecated Use `nothing` instead.\n */\n',
      'hooks/useNew/useOld.ts':
        '/**\n * @description The old name.\n * @deprecated Use `useNew` instead.\n */\nexport const useOld = useNew;\n',
      'components/Old/Old.tsx': '/**\n * @deprecated Use `New` instead.\n */\nexport function Old() {}\n',
    });

    assert.deepEqual(await collectDeprecatedExports(root, ['Old', 'useNew', 'useOld']), ['Old', 'useOld']);
  });

  it('fails on an export that has no source file', async () => {
    const root = await writeFixtureRoot({});

    await assert.rejects(collectDeprecatedExports(root, ['useGone']), /useGone is exported but has no source file/);
  });
});

async function writeFixtureRoot(sources: Record<string, string>): Promise<string> {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'react-simplikit-deprecated-'));
  fixtureDirectories.push(root);

  for (const [relativePath, content] of Object.entries(sources)) {
    const filePath = path.join(root, 'packages/react-simplikit/src', relativePath);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content);
  }

  return root;
}
