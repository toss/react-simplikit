import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, it } from 'vitest';

import { generateSkill, PACKAGE_INDEX_FILE } from './index.ts';

const fixtureDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(fixtureDirectories.splice(0).map(directory => fs.rm(directory, { force: true, recursive: true })));
});

describe('generateSkill', () => {
  it('writes SKILL.md with a catalog row and a reference page per public export', async () => {
    const root = await writeFixtureRoot({
      index: `
export { isIOS } from './utils/isIOS/index.ts';
export { useToggle } from './hooks/useToggle/index.ts';
`,
      pages: {
        'hooks/useToggle/useToggle.md': '# useToggle\n\n`useToggle` flips a boolean. More text.\n\n## Interface\n',
        'utils/isIOS/isIOS.md': '# isIOS\n\n`isIOS` detects iOS.\n',
      },
    });
    const outputDirectory = path.join(root, 'out');

    await generateSkill({ root, outputDirectory });

    const skill = await fs.readFile(path.join(outputDirectory, 'SKILL.md'), 'utf8');
    assert.equal(skill.startsWith('---\nname: react-simplikit\n'), true);
    assert.equal(
      skill.includes(
        '### hooks\n\n| Name | Description |\n| --- | --- |\n| [`useToggle`](references/useToggle.md) | `useToggle` flips a boolean. |'
      ),
      true
    );
    assert.equal(
      skill.includes(
        '### utils\n\n| Name | Description |\n| --- | --- |\n| [`isIOS`](references/isIOS.md) | `isIOS` detects iOS. |'
      ),
      true
    );
    assert.equal(skill.includes('<!-- CATALOG -->'), false);
    assert.equal(skill.includes('### Deprecated'), false);
    assert.equal(
      await fs.readFile(path.join(outputDirectory, 'references', 'useToggle.md'), 'utf8'),
      '# useToggle\n\n`useToggle` flips a boolean. More text.\n\n## Interface\n'
    );
  });

  it('produces identical output on a second run and drops pages of removed exports', async () => {
    const root = await writeFixtureRoot({
      index: `
export { isIOS } from './utils/isIOS/index.ts';
export { useToggle } from './hooks/useToggle/index.ts';
`,
      pages: {
        'hooks/useToggle/useToggle.md': '# useToggle\n\n`useToggle` flips a boolean.\n',
        'utils/isIOS/isIOS.md': '# isIOS\n\n`isIOS` detects iOS.\n',
      },
    });
    const outputDirectory = path.join(root, 'out');

    await generateSkill({ root, outputDirectory });
    const firstSkill = await fs.readFile(path.join(outputDirectory, 'SKILL.md'), 'utf8');

    await generateSkill({ root, outputDirectory });
    assert.equal(await fs.readFile(path.join(outputDirectory, 'SKILL.md'), 'utf8'), firstSkill);

    await fs.writeFile(
      path.join(root, PACKAGE_INDEX_FILE),
      `export { useToggle } from './hooks/useToggle/index.ts';\n`
    );
    await generateSkill({ root, outputDirectory });

    assert.deepEqual(await fs.readdir(path.join(outputDirectory, 'references')), ['useToggle.md']);
    assert.equal((await fs.readFile(path.join(outputDirectory, 'SKILL.md'), 'utf8')).includes('isIOS'), false);
  });

  it('lists an export whose JSDoc is @deprecated under Deprecated, without a page or a reference', async () => {
    const root = await writeFixtureRoot({
      index: `
export { useNew, useOld } from './hooks/useNew/index.ts';
`,
      pages: { 'hooks/useNew/useNew.md': '# useNew\n\n`useNew` flips a boolean.\n' },
      sources: {
        'hooks/useNew/useNew.ts': 'export function useNew() {}\n',
        'hooks/useNew/useOld.ts': `/**
 * @description
 * \`useOld\` is the name \`useNew\` had before.
 *
 * @deprecated Use \`useNew\` instead.
 */
export const useOld = useNew;
`,
      },
    });
    const outputDirectory = path.join(root, 'out');

    await generateSkill({ root, outputDirectory });

    const skill = await fs.readFile(path.join(outputDirectory, 'SKILL.md'), 'utf8');
    assert.equal(
      skill.includes(
        '### hooks\n\n| Name | Description |\n| --- | --- |\n| [`useNew`](references/useNew.md) | `useNew` flips a boolean. |\n\n### Deprecated\n'
      ),
      true
    );
    assert.equal(skill.includes('| Name | Notice |\n| --- | --- |\n| `useOld` | Use `useNew` instead. |'), true);
    assert.equal(skill.includes('references/useOld.md'), false);
    assert.deepEqual(await fs.readdir(path.join(outputDirectory, 'references')), ['useNew.md']);
  });

  it('reads a component source from a .tsx file', async () => {
    const root = await writeFixtureRoot({
      index: `export { Separated } from './components/Separated/index.ts';\n`,
      pages: { 'components/Separated/Separated.md': '# Separated\n\n`Separated` joins children.\n' },
      sources: { 'components/Separated/Separated.tsx': 'export function Separated() {}\n' },
    });
    const outputDirectory = path.join(root, 'out');

    await generateSkill({ root, outputDirectory });

    assert.deepEqual(await fs.readdir(path.join(outputDirectory, 'references')), ['Separated.md']);
  });

  it('fails when an export has no source file next to its index', async () => {
    const root = await writeFixtureRoot({
      index: `export { useToggle } from './hooks/useToggle/index.ts';\n`,
      pages: { 'hooks/useToggle/useToggle.md': '# useToggle\n\n`useToggle` flips a boolean.\n' },
      sources: {},
    });

    await assert.rejects(
      generateSkill({ root, outputDirectory: path.join(root, 'out') }),
      /useToggle has no source file/
    );
  });

  it('fails when an export has no documentation page', async () => {
    const root = await writeFixtureRoot({
      index: `export { useToggle } from './hooks/useToggle/index.ts';\n`,
      pages: {},
      sources: { 'hooks/useToggle/useToggle.ts': 'export function useToggle() {}\n' },
    });

    await assert.rejects(
      generateSkill({ root, outputDirectory: path.join(root, 'out') }),
      /useToggle has no documentation page/
    );
  });
});

type FixtureRoot = {
  index: string;
  pages: Record<string, string>;
  /** Replaces the default: a `<name>.ts` without JSDoc next to each page, which is how a current export looks. */
  sources?: Record<string, string>;
};

async function writeFixtureRoot({ index, pages, sources }: FixtureRoot): Promise<string> {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'react-simplikit-skill-'));
  fixtureDirectories.push(root);
  const sourceDirectory = path.join(root, path.dirname(PACKAGE_INDEX_FILE));
  const pageSources = Object.fromEntries(
    Object.keys(pages).map(pagePath => [pagePath.replace(/\.md$/, '.ts'), 'export {};\n'])
  );

  await fs.mkdir(sourceDirectory, { recursive: true });
  await fs.writeFile(path.join(root, PACKAGE_INDEX_FILE), index);

  for (const [relativePath, content] of Object.entries({ ...pages, ...(sources ?? pageSources) })) {
    const filePath = path.join(sourceDirectory, relativePath);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content);
  }

  return root;
}
