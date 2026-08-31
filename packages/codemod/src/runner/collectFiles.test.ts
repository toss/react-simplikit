import { mkdir, mkdtemp, realpath, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';

import { collectFiles, type CollectFilesOptions } from './collectFiles.ts';

let cwd = '';

async function write(relative: string, contents = ''): Promise<void> {
  const absolute = path.join(cwd, relative);

  await mkdir(path.dirname(absolute), { recursive: true });
  await writeFile(absolute, contents, 'utf8');
}

async function collect(overrides: Partial<CollectFilesOptions> = {}): Promise<string[]> {
  const files = await collectFiles({ paths: ['.'], ignore: [], includePackageJson: true, cwd, ...overrides });

  return files.map(file => path.relative(cwd, file).split(path.sep).join('/')).toSorted();
}

beforeEach(async () => {
  cwd = await realpath(await mkdtemp(path.join(tmpdir(), 'codemod-collect-')));
});

describe('collectFiles', () => {
  it('collects every supported source extension and nothing else', async () => {
    for (const name of ['a.ts', 'b.tsx', 'c.mts', 'd.cts', 'e.js', 'f.jsx', 'g.mjs', 'h.cjs']) {
      await write(name);
    }
    await write('skip.md');
    await write('skip.css');

    expect(await collect()).toEqual(['a.ts', 'b.tsx', 'c.mts', 'd.cts', 'e.js', 'f.jsx', 'g.mjs', 'h.cjs'].toSorted());
  });

  it('includes package.json when asked and skips it otherwise', async () => {
    await write('package.json', '{}');

    expect(await collect()).toEqual(['package.json']);
    expect(await collect({ includePackageJson: false })).toEqual([]);
  });

  it('skips vendored and generated directories by default', async () => {
    await write('src/a.ts');
    await write('node_modules/pkg/b.ts');
    await write('dist/c.ts');
    await write('coverage/d.ts');
    await write('.next/e.ts');

    expect(await collect()).toEqual(['src/a.ts']);
  });

  it('honours an extra ignore glob', async () => {
    await write('src/a.ts');
    await write('legacy/b.ts');

    expect(await collect({ ignore: ['**/legacy/**'] })).toEqual(['src/a.ts']);
  });

  it('accepts explicit file paths without globbing', async () => {
    await write('src/a.ts');
    await write('src/b.ts');

    expect(await collect({ paths: ['src/a.ts'] })).toEqual(['src/a.ts']);
  });

  it('deduplicates a file reached through two paths', async () => {
    await write('src/a.ts');

    expect(await collect({ paths: ['src/a.ts', 'src'] })).toEqual(['src/a.ts']);
  });

  it('throws a UsageError naming the path that does not exist', async () => {
    await expect(collect({ paths: ['nope'] })).rejects.toThrow(/Path not found: nope/);
  });
});

describe('collectFiles — explicit paths obey the same policy as globbed ones', () => {
  it('skips an explicitly named package.json when package.json handling is off', async () => {
    await write('app/package.json', '{}');

    expect(await collect({ paths: ['app/package.json'], includePackageJson: false })).toEqual([]);
  });

  it('honours an ignore glob against an explicitly named file', async () => {
    await write('vendor/v.ts');

    expect(await collect({ paths: ['vendor/v.ts'], ignore: ['**/vendor/**'] })).toEqual([]);
  });

  it('skips an explicitly named file inside node_modules', async () => {
    await write('node_modules/pkg/i.js');

    expect(await collect({ paths: ['node_modules/pkg/i.js'] })).toEqual([]);
  });

  it('skips an explicitly named file with an unsupported extension', async () => {
    await write('notes.md');

    expect(await collect({ paths: ['notes.md'] })).toEqual([]);
  });

  it('does not follow a symlinked file or directory given explicitly', async () => {
    await write('real/x.ts');
    await symlink(path.join(cwd, 'real'), path.join(cwd, 'linkedDir'));
    await symlink(path.join(cwd, 'real', 'x.ts'), path.join(cwd, 'linked.ts'));

    expect(await collect({ paths: ['linkedDir'] })).toEqual([]);
    expect(await collect({ paths: ['linked.ts'] })).toEqual([]);
  });
});
