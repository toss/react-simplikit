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
    const result = await runTransform({ files: [file], cwd, dryRun: false, debug: false });

    expect(await readFile(file, 'utf8')).toBe(`import { isIOS } from 'react-simplikit';\n`);
    expect(result.scanned).toBe(1);
    expect(result.changed).toEqual([
      { kind: 'source', file: path.join('src', 'a.ts'), changes: [{ line: 1, kind: 'import' }] },
    ]);
  });

  it('leaves the file on disk untouched when dryRun is set', async () => {
    const original = `import { isIOS } from '@react-simplikit/mobile';\n`;
    const file = await write('src/a.ts', original);
    const result = await runTransform({ files: [file], cwd, dryRun: true, debug: false });

    expect(await readFile(file, 'utf8')).toBe(original);
    expect(result.changed).toHaveLength(1);
  });

  it('counts an unchanged file as scanned but not changed', async () => {
    const file = await write('src/a.ts', `import { useToggle } from 'react-simplikit';\n`);
    const result = await runTransform({ files: [file], cwd, dryRun: false, debug: false });

    expect(result.scanned).toBe(1);
    expect(result.changed).toEqual([]);
  });

  it('routes package.json through the manifest transform', async () => {
    const file = await write(
      'package.json',
      `{\n  "dependencies": {\n    "@react-simplikit/mobile": "^0.1.1"\n  }\n}\n`
    );
    const result = await runTransform({ files: [file], cwd, dryRun: false, debug: false });

    const [entry] = result.changed;

    expect(entry?.kind).toBe('manifest');
    expect(entry?.kind === 'manifest' && entry.dependencies).toHaveLength(1);
    expect(await readFile(file, 'utf8')).toContain('"react-simplikit"');
  });

  it('attaches the file path to manual notes', async () => {
    const file = await write('package.json', `{\n  "overrides": {\n    "@react-simplikit/mobile": "0.1.1"\n  }\n}\n`);
    const result = await runTransform({ files: [file], cwd, dryRun: false, debug: false });

    expect(result.manual).toEqual([{ file: 'package.json', reason: expect.stringContaining('overrides') }]);
    expect(result.changed).toEqual([]);
  });

  it('records a file it cannot parse and keeps going', async () => {
    const broken = await write('package.json', `{ "dependencies": { "@react-simplikit/mobile" `);
    const good = await write('src/a.ts', `import { isIOS } from '@react-simplikit/mobile';\n`);
    const result = await runTransform({ files: [broken, good], cwd, dryRun: false, debug: false });

    expect(result.failed).toEqual([{ file: 'package.json', reason: expect.any(String) }]);
    expect(result.changed.map(entry => entry.file)).toEqual([path.join('src', 'a.ts')]);
    expect(await readFile(good, 'utf8')).toBe(`import { isIOS } from 'react-simplikit';\n`);
  });

  it('keeps the stack in the reason when debug is on', async () => {
    const missing = path.join(cwd, 'gone.ts');
    const result = await runTransform({ files: [missing], cwd, dryRun: false, debug: true });

    const plain = await runTransform({ files: [missing], cwd, dryRun: false, debug: false });

    expect(result.failed[0]?.reason.startsWith('Error: ')).toBe(true);
    expect(plain.failed[0]?.reason.startsWith('Error: ')).toBe(false);
  });

  it('records a file it cannot read', async () => {
    const missing = path.join(cwd, 'gone.ts');
    const result = await runTransform({ files: [missing], cwd, dryRun: false, debug: false });

    expect(result.failed.map(failure => failure.file)).toEqual(['gone.ts']);
    expect(result.changed).toEqual([]);
  });

  it('does not let one bad manifest sink a dry run', async () => {
    const broken = await write('package.json', `{ "dependencies": { "@react-simplikit/mobile" `);
    const good = await write('src/a.ts', `import { isIOS } from '@react-simplikit/mobile';\n`);
    const result = await runTransform({ files: [broken, good], cwd, dryRun: true, debug: false });

    expect(result.failed).toHaveLength(1);
    expect(result.changed).toHaveLength(1);
  });
});
