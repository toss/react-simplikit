import { mkdir, mkdtemp, readFile, realpath, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';

import { runTransform } from './runTransform.ts';

let cwd = '';

async function write(relative: string, contents: string): Promise<string> {
  const absolute = path.join(cwd, relative);

  await mkdir(path.dirname(absolute), { recursive: true });
  await writeFile(absolute, contents, 'utf8');

  return absolute;
}

beforeEach(async () => {
  cwd = await realpath(await mkdtemp(path.join(tmpdir(), 'codemod-run-')));
});

describe('runTransform', () => {
  it('rewrites a source file and reports it by relative path', async () => {
    const file = await write('src/a.ts', `import { isIOS } from '@react-simplikit/mobile';\n`);
    const result = await runTransform({ files: [file], cwd, dryRun: false });

    expect(await readFile(file, 'utf8')).toBe(`import { isIOS } from 'react-simplikit';\n`);
    expect(result.scanned).toBe(1);
    expect(result.changed).toEqual([
      { file: path.join('src', 'a.ts'), changes: [{ line: 1, kind: 'import' }], dependencies: [] },
    ]);
  });

  it('leaves the file on disk untouched when dryRun is set', async () => {
    const original = `import { isIOS } from '@react-simplikit/mobile';\n`;
    const file = await write('src/a.ts', original);
    const result = await runTransform({ files: [file], cwd, dryRun: true });

    expect(await readFile(file, 'utf8')).toBe(original);
    expect(result.changed).toHaveLength(1);
  });

  it('counts an unchanged file as scanned but not changed', async () => {
    const file = await write('src/a.ts', `import { useToggle } from 'react-simplikit';\n`);
    const result = await runTransform({ files: [file], cwd, dryRun: false });

    expect(result.scanned).toBe(1);
    expect(result.changed).toEqual([]);
  });

  it('routes package.json through the manifest transform', async () => {
    const file = await write(
      'package.json',
      `{\n  "dependencies": {\n    "@react-simplikit/mobile": "^0.1.1"\n  }\n}\n`
    );
    const result = await runTransform({ files: [file], cwd, dryRun: false });

    expect(result.changed[0]?.dependencies).toHaveLength(1);
    expect(result.changed[0]?.changes).toEqual([]);
    expect(await readFile(file, 'utf8')).toContain('"react-simplikit"');
  });

  it('attaches the file path to manual notes', async () => {
    const file = await write('package.json', `{\n  "overrides": {\n    "@react-simplikit/mobile": "0.1.1"\n  }\n}\n`);
    const result = await runTransform({ files: [file], cwd, dryRun: false });

    expect(result.manual).toEqual([{ file: 'package.json', reason: expect.stringContaining('overrides') }]);
    expect(result.changed).toEqual([]);
  });

  it('names the offending file when a manifest cannot be parsed', async () => {
    await write('package.json', `{ "dependencies": { "@react-simplikit/mobile" `);
    const file = path.join(cwd, 'package.json');

    await expect(runTransform({ files: [file], cwd, dryRun: false })).rejects.toThrow(/Failed on package\.json/);
  });

  it('names the offending file when it cannot be read', async () => {
    const missing = path.join(cwd, 'gone.ts');

    await expect(runTransform({ files: [missing], cwd, dryRun: false })).rejects.toThrow(/Failed on gone\.ts/);
  });
});
