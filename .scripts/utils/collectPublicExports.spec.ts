import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, it } from 'vitest';

import { collectPublicExportEntries, collectPublicExports } from './collectPublicExports.ts';

const fixtureDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(fixtureDirectories.splice(0).map(directory => fs.rm(directory, { force: true, recursive: true })));
});

describe('collectPublicExports', () => {
  it('returns the sorted value exports and skips type-only exports', async () => {
    const indexFilePath = await writeIndexFile(`
export { useToggle } from './hooks/useToggle/index.ts';
export { type Options, useList } from './hooks/useList/index.ts';
export type { State } from './hooks/useState/index.ts';
export {
  type ConnectionType,
  useNetworkStatus,
} from './hooks/useNetworkStatus/index.ts';
export { internalName as mergeRefs } from './utils/mergeRefs/index.ts';
`);

    assert.deepEqual(await collectPublicExports(indexFilePath), [
      'mergeRefs',
      'useList',
      'useNetworkStatus',
      'useToggle',
    ]);
  });

  it('deduplicates a name exported twice', async () => {
    const indexFilePath = await writeIndexFile(`
export { isServer } from './utils/isServer/index.ts';
export { isServer } from './legacy/index.ts';
`);

    assert.deepEqual(await collectPublicExports(indexFilePath), ['isServer']);
  });
});

describe('collectPublicExportEntries', () => {
  it('pairs each value export with the module it comes from', async () => {
    const indexFilePath = await writeIndexFile(`
export { useToggle } from './hooks/useToggle/index.ts';
export { type Options, useList } from "./hooks/useList/index.ts";
export { internalName as mergeRefs } from './utils/mergeRefs/index.ts';
`);

    assert.deepEqual(await collectPublicExportEntries(indexFilePath), [
      { name: 'mergeRefs', sourcePath: './utils/mergeRefs/index.ts' },
      { name: 'useList', sourcePath: './hooks/useList/index.ts' },
      { name: 'useToggle', sourcePath: './hooks/useToggle/index.ts' },
    ]);
  });

  it('keeps the first source of a name exported twice', async () => {
    const indexFilePath = await writeIndexFile(`
export { isServer } from './utils/isServer/index.ts';
export { isServer } from './legacy/index.ts';
`);

    assert.deepEqual(await collectPublicExportEntries(indexFilePath), [
      { name: 'isServer', sourcePath: './utils/isServer/index.ts' },
    ]);
  });
});

async function writeIndexFile(source: string): Promise<string> {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'react-simplikit-exports-'));
  fixtureDirectories.push(directory);
  const indexFilePath = path.join(directory, 'index.ts');
  await fs.writeFile(indexFilePath, source);
  return indexFilePath;
}
