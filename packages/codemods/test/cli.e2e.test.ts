import { spawnSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import manifest from '../package.json';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// From the manifest, so a `bin` left behind by a build-output rename fails here.
const binPath = path.join(packageRoot, manifest.bin);
const fixturesRoot = path.join(packageRoot, 'test', '__fixtures__');

// The PnP loader comes in through NODE_OPTIONS, which the child inherits from the test run.
function runCli(args: readonly string[], bin = binPath) {
  const { stdout, stderr, status } = spawnSync(process.execPath, [bin, ...args], {
    cwd: packageRoot,
    encoding: 'utf8',
  });

  return { stdout, stderr, exitCode: status ?? 1 };
}

let cwd = '';

async function write(relative: string, contents: string) {
  const absolute = path.join(cwd, relative);

  await mkdir(path.dirname(absolute), { recursive: true });
  await writeFile(absolute, contents, 'utf8');
}

async function read(relative: string) {
  return readFile(path.join(cwd, relative), 'utf8');
}

beforeAll(async () => {
  await mkdir(fixturesRoot, { recursive: true });
});

afterAll(async () => {
  await rm(fixturesRoot, { force: true, recursive: true });
});

beforeEach(async () => {
  cwd = await mkdtemp(path.join(fixturesRoot, 'case-'));
});

describe('@react-simplikit/codemods', () => {
  it('ships a shebang in the built entrypoint', async () => {
    expect((await readFile(binPath, 'utf8')).startsWith('#!/usr/bin/env node')).toBe(true);
  });

  it('prints its version with -v', () => {
    expect(runCli(['-v']).stdout.trim()).toBe(manifest.version);
  });

  it('prints usage with -h', () => {
    expect(runCli(['-h']).stdout).toContain('Usage: @react-simplikit/codemods [codemod] [path]');
  });

  it('lists the transforms in the help', () => {
    expect(runCli(['-h']).stdout).toMatch(/Transforms:\n {2}mobile-to-root {2}/);
  });

  it('exits 1 instead of prompting when it is not run in a terminal', () => {
    const result = runCli(['mobile-to-root']);

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('Pass both the transform and the path');
  });

  it('exits 1 on an unknown transform', () => {
    const result = runCli(['nope', cwd]);

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('- mobile-to-root');
  });

  it('rewrites source files and package.json through jscodeshift', async () => {
    await write(
      'src/a.tsx',
      `import { useToggle } from 'react-simplikit';\nimport { isIOS } from '@react-simplikit/mobile';\n`
    );
    await write('package.json', `{\n  "dependencies": { "@react-simplikit/mobile": "^0.1.0" }\n}\n`);

    const result = runCli(['mobile-to-root', cwd, '--force']);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Next steps:');
    expect(await read('src/a.tsx')).toBe(`import { useToggle, isIOS } from 'react-simplikit';\n`);
    expect(JSON.parse(await read('package.json'))).toEqual({ dependencies: { 'react-simplikit': '^0.2.0' } });
  });

  it('leaves files alone with --dry', async () => {
    const original = `import { isIOS } from '@react-simplikit/mobile';\n`;
    await write('src/a.ts', original);

    expect(runCli(['mobile-to-root', cwd, '--dry']).exitCode).toBe(0);
    expect(await read('src/a.ts')).toBe(original);
  });

  it('skips node_modules', async () => {
    const original = `import { isIOS } from '@react-simplikit/mobile';\n`;
    await write('node_modules/dep/index.js', original);

    runCli(['mobile-to-root', cwd, '--force']);

    expect(await read('node_modules/dep/index.js')).toBe(original);
  });

  it('still migrates a project that sits under a build folder', async () => {
    await write('build/app/src/a.ts', `import { isIOS } from '@react-simplikit/mobile';\n`);

    expect(runCli(['mobile-to-root', path.join(cwd, 'build', 'app'), '--force']).exitCode).toBe(0);
    expect(await read('build/app/src/a.ts')).toBe(`import { isIOS } from 'react-simplikit';\n`);
  });

  it('exits 1 on a path that does not exist', () => {
    const result = runCli(['mobile-to-root', path.join(cwd, 'missing')]);

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('Path not found');
  });

  it('migrates the rest and exits 1 when a file cannot be parsed', async () => {
    await write('src/broken.ts', `import { isIOS } from '@react-simplikit/mobile';\nimport { isIOS } from 'x';\n`);
    await write('src/ok.ts', `import { isIOS } from '@react-simplikit/mobile';\n`);

    const result = runCli(['mobile-to-root', cwd, '--force']);

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toContain('broken.ts');
    expect(await read('src/ok.ts')).toBe(`import { isIOS } from 'react-simplikit';\n`);
  });

  it('changes nothing on a second run', async () => {
    await write(
      'src/a.ts',
      `import { useToggle } from 'react-simplikit';\nimport { isIOS } from '@react-simplikit/mobile';\n`
    );

    runCli(['mobile-to-root', cwd, '--force']);
    const once = await read('src/a.ts');
    runCli(['mobile-to-root', cwd, '--force']);

    expect(await read('src/a.ts')).toBe(once);
  });
});

describe('the git safety check', () => {
  function git(...args: string[]) {
    return spawnSync('git', ['-c', 'user.name=codemods', '-c', 'user.email=codemods@example.com', ...args], { cwd });
  }

  it('stops on uncommitted changes and runs once they are committed', async () => {
    const original = `import { isIOS } from '@react-simplikit/mobile';\n`;
    git('init', '-q');
    await write('src/a.ts', original);

    const dirty = runCli(['mobile-to-root', cwd]);

    expect(dirty.exitCode).toBe(1);
    expect(dirty.stderr).toContain('--force');
    expect(await read('src/a.ts')).toBe(original);

    git('add', '-A');
    git('commit', '-q', '-m', 'init');

    expect(runCli(['mobile-to-root', cwd]).exitCode).toBe(0);
    expect(await read('src/a.ts')).toBe(`import { isIOS } from 'react-simplikit';\n`);
  });
});

describe('--jscodeshift', () => {
  it('passes the options through to jscodeshift', async () => {
    await write('src/a.ts', `import { isIOS } from '@react-simplikit/mobile';\n`);

    const result = runCli(['mobile-to-root', cwd, '--force', '--jscodeshift', '--cpus=1']);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('--cpus=1');
  });
});

describe('the published tarball', () => {
  it('carries the bin and the transforms it runs', async () => {
    const workDir = await mkdtemp(path.join(fixturesRoot, 'pack-'));
    const packed = spawnSync('npm', ['pack', '--pack-destination', workDir], { cwd: packageRoot, encoding: 'utf8' });

    expect(packed.status).toBe(0);

    const tarball = path.join(workDir, packed.stdout.trim().split('\n').at(-1) ?? '');

    expect(spawnSync('tar', ['-xzf', tarball, '-C', workDir]).status).toBe(0);

    const extracted = path.join(workDir, 'package');
    const packedBin = path.join(extracted, manifest.bin);

    expect((await stat(packedBin)).mode & 0o111).toBeGreaterThan(0);
    expect((await stat(path.join(extracted, 'dist', 'transforms', 'mobile-to-root.cjs'))).isFile()).toBe(true);
    expect(runCli(['-v'], packedBin).stdout.trim()).toBe(manifest.version);
  });
});
