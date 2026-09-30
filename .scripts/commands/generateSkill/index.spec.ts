import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, it } from 'vitest';

import { renderEnglishDoc } from '../generateDocs/index.ts';

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

  it('lists an export whose JSDoc is @deprecated under Deprecated, from the page docs:gen renders', async () => {
    const [oldPage, newPage] = await Promise.all([
      renderFixtureDoc(
        'useOld',
        `/**
 * @deprecated Use \`useNew\` instead.
 *
 * @description
 * \`useOld\` flips a boolean.
 *
 * @returns {void}
 *
 * @example
 * useOld();
 */
export function useOld() {}`
      ),
      renderFixtureDoc(
        'useNew',
        `/**
 * @description
 * \`useNew\` flips a boolean.
 *
 * @returns {void}
 *
 * @example
 * useNew();
 */
export function useNew() {}`
      ),
    ]);
    const root = await writeFixtureRoot({
      index: `
export { useNew } from './hooks/useNew/index.ts';
export { useOld } from './hooks/useOld/index.ts';
`,
      pages: { 'hooks/useNew/useNew.md': newPage, 'hooks/useOld/useOld.md': oldPage },
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
    assert.equal(
      skill.includes('| Name | Notice |\n| --- | --- |\n| [`useOld`](references/useOld.md) | Use `useNew` instead. |'),
      true
    );
    assert.equal(await fs.readFile(path.join(outputDirectory, 'references', 'useOld.md'), 'utf8'), oldPage);
  });

  it('fails when an export has no documentation page', async () => {
    const root = await writeFixtureRoot({
      index: `export { useToggle } from './hooks/useToggle/index.ts';\n`,
      pages: {},
    });

    await assert.rejects(
      generateSkill({ root, outputDirectory: path.join(root, 'out') }),
      /useToggle has no documentation page/
    );
  });
});

async function writeFixtureRoot({ index, pages }: { index: string; pages: Record<string, string> }): Promise<string> {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'react-simplikit-skill-'));
  fixtureDirectories.push(root);
  const sourceDirectory = path.join(root, path.dirname(PACKAGE_INDEX_FILE));

  await fs.mkdir(sourceDirectory, { recursive: true });
  await fs.writeFile(path.join(root, PACKAGE_INDEX_FILE), index);

  for (const [relativePath, content] of Object.entries(pages)) {
    const pagePath = path.join(sourceDirectory, relativePath);
    await fs.mkdir(path.dirname(pagePath), { recursive: true });
    await fs.writeFile(pagePath, content);
  }

  return root;
}

async function renderFixtureDoc(name: string, source: string): Promise<string> {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'react-simplikit-skill-doc-'));
  fixtureDirectories.push(directory);
  const sourceFilePath = path.join(directory, `${name}.ts`);

  await fs.writeFile(sourceFilePath, source);

  return renderEnglishDoc(name, sourceFilePath);
}
