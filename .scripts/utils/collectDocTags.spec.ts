import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, it } from 'vitest';

import { collectDocTags } from './collectDocTags.ts';

const fixtureDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(fixtureDirectories.splice(0).map(directory => fs.rm(directory, { force: true, recursive: true })));
});

describe('collectDocTags', () => {
  it('keeps the exports whose own JSDoc is @deprecated, wherever their source sits', async () => {
    const root = await writeFixtureRoot({
      'hooks/useNew/useNew.ts': '/**\n * @description Does it.\n */\nexport function useNew() {}\n',
      'hooks/useNew/useNew.test.ts': '/**\n * @deprecated Use `nothing` instead.\n */\n',
      'hooks/useNew/useOld.ts':
        '/**\n * @description The old name.\n * @deprecated Use `useNew` instead.\n */\nexport const useOld = useNew;\n',
      'components/Old/Old.tsx': '/**\n * @deprecated Use `New` instead.\n */\nexport function Old() {}\n',
    });

    assert.deepEqual((await collectDocTags(root, ['Old', 'useNew', 'useOld'])).deprecated, ['Old', 'useOld']);
  });

  it('keeps the exports whose own JSDoc is @no-docs, with or without @deprecated', async () => {
    const root = await writeFixtureRoot({
      'hooks/useNew/useNew.ts': '/**\n * @description Does it.\n */\nexport function useNew() {}\n',
      'hooks/useNew/useOld.ts':
        '/**\n * @description The old name.\n * @no-docs\n * @deprecated Use `useNew` instead.\n */\nexport const useOld = useNew;\n',
      'hooks/useHidden/useHidden.ts':
        '/**\n * @description Hidden.\n * @no-docs\n */\nexport function useHidden() {}\n',
      'hooks/useLegacy/useLegacy.ts':
        '/**\n * @description Still documented.\n * @deprecated Use `useNew` instead.\n */\nexport function useLegacy() {}\n',
    });

    assert.deepEqual(await collectDocTags(root, ['useHidden', 'useLegacy', 'useNew', 'useOld']), {
      deprecated: ['useLegacy', 'useOld'],
      noDocs: ['useHidden', 'useOld'],
    });
  });

  it('reads the public source, not an _internal implementation with the same name', async () => {
    // The implementation sits shallower than the public hook, so an unfiltered glob would find it first.
    const root = await writeFixtureRoot({
      '_internal/useLegacy.ts': '/**\n * @description The implementation.\n */\nexport function useLegacy() {}\n',
      'hooks/useLegacy/useLegacy.ts':
        '/**\n * @description The public hook.\n * @deprecated Use `useNew` instead.\n */\nexport function useLegacy() {}\n',
    });

    assert.deepEqual(await collectDocTags(root, ['useLegacy']), { deprecated: ['useLegacy'], noDocs: [] });
  });

  it('fails on an export that has no source file', async () => {
    const root = await writeFixtureRoot({});

    await assert.rejects(collectDocTags(root, ['useGone']), /useGone is exported but has no source file/);
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
