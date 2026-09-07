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

const YARN = process.platform === 'win32' ? 'yarn.cmd' : 'yarn';

function runCli(args: readonly string[], cwd: string, env = process.env) {
  const { stdout, stderr, status } = spawnSync(YARN, ['node', binPath, ...args], { cwd, env, encoding: 'utf8' });

  return { stdout, stderr, exitCode: status ?? 1 };
}

function reportOf(stdout: string): unknown {
  return JSON.parse(stdout);
}

let cwd = '';

async function write(relative: string, contents: string) {
  const absolute = path.join(cwd, relative);

  await mkdir(path.dirname(absolute), { recursive: true });
  await writeFile(absolute, contents, 'utf8');
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

describe('react-simplikit-codemod', () => {
  it('ships a shebang in the built entrypoint', async () => {
    expect((await readFile(binPath, 'utf8')).startsWith('#!/usr/bin/env node')).toBe(true);
  });

  it('prints its version to stdout and exits 0', () => {
    const result = runCli(['--version'], cwd);

    expect(result.exitCode).toBe(0);
    expect(result.stdout.trim()).toMatch(/^\d+\.\d+\.\d+/);
    expect(result.stderr).toBe('');
  });

  it('prints help for the transform and exits 0', () => {
    const result = runCli(['mobile-to-root', '--help'], cwd);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('--dry-run');
    expect(result.stdout).toContain('--json');
    expect(result.stdout).toContain('Examples:');
  });

  it('exits 2 for an unknown command, with the message on stderr', () => {
    const result = runCli(['nope'], cwd);

    expect(result.exitCode).toBe(2);
    expect(result.stderr).not.toBe('');
    expect(result.stdout).toBe('');
  });

  it('exits 2 when no command is given', () => {
    expect(runCli([], cwd).exitCode).toBe(2);
  });

  it('exits 2 for a path that does not exist and names it', () => {
    const result = runCli(['mobile-to-root', 'missing-dir'], cwd);

    expect(result.exitCode).toBe(2);
    expect(result.stderr).toContain('Path not found: missing-dir');
  });

  it('rewrites imports and names the changed file on stdout', async () => {
    await write('src/a.tsx', `import { useKeyboardHeight } from '@react-simplikit/mobile';\n`);

    const result = runCli(['mobile-to-root'], cwd);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain(path.join('src', 'a.tsx'));
    expect(await readFile(path.join(cwd, 'src', 'a.tsx'), 'utf8')).toBe(
      `import { useKeyboardHeight } from 'react-simplikit';\n`
    );
  });

  it('leaves files alone with --dry-run', async () => {
    const original = `import { isIOS } from '@react-simplikit/mobile';\n`;
    await write('src/a.ts', original);

    const result = runCli(['mobile-to-root', '--dry-run'], cwd);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Would change');
    expect(await readFile(path.join(cwd, 'src', 'a.ts'), 'utf8')).toBe(original);
  });

  it('prints JSON and nothing else on stdout with --json', async () => {
    await write('src/a.ts', `import { isIOS } from '@react-simplikit/mobile';\n`);

    const result = runCli(['mobile-to-root', '--json'], cwd);

    expect(result.exitCode).toBe(0);
    expect(reportOf(result.stdout)).toEqual({
      transform: 'mobile-to-root',
      dryRun: false,
      scanned: 1,
      changed: [expect.any(Object)],
      manual: [],
      failed: [],
    });
  });

  it('rewrites the package.json dependency and skips it with --no-package-json', async () => {
    const original = `{\n  "dependencies": {\n    "@react-simplikit/mobile": "^0.1.1"\n  }\n}\n`;

    await write('app/package.json', original);
    expect(runCli(['mobile-to-root'], cwd).exitCode).toBe(0);
    expect(await readFile(path.join(cwd, 'app', 'package.json'), 'utf8')).toContain('"react-simplikit"');

    await write('app/package.json', original);
    expect(runCli(['mobile-to-root', '--no-package-json'], cwd).exitCode).toBe(0);
    expect(await readFile(path.join(cwd, 'app', 'package.json'), 'utf8')).toBe(original);
  });

  it('honours a repeatable --ignore glob', async () => {
    const original = `import { isIOS } from '@react-simplikit/mobile';\n`;

    await write('src/a.ts', original);
    await write('legacy/b.ts', original);
    await write('vendor/c.ts', original);

    const result = runCli(['mobile-to-root', '--ignore', '**/legacy/**', '--ignore', '**/vendor/**', '--json'], cwd);

    expect(reportOf(result.stdout)).toMatchObject({ changed: [{ file: path.join('src', 'a.ts') }] });
  });

  it('accepts an explicit target directory', async () => {
    const original = `import { isIOS } from '@react-simplikit/mobile';\n`;

    await write('src/a.ts', original);
    await write('other/b.ts', original);

    const result = runCli(['mobile-to-root', 'src', '--json'], cwd);

    expect(reportOf(result.stdout)).toMatchObject({ changed: [{ file: path.join('src', 'a.ts') }] });
    expect(await readFile(path.join(cwd, 'other', 'b.ts'), 'utf8')).toBe(original);
  });

  it('exits 0 and says nothing changed on a clean tree', async () => {
    await write('src/a.ts', `import { useToggle } from 'react-simplikit';\n`);

    const result = runCli(['mobile-to-root'], cwd);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('No file imports');
  });

  it('reports a file it cannot parse, migrates the rest, and exits 1', async () => {
    await write('app/package.json', `{ "dependencies": { "@react-simplikit/mobile" `);
    await write('src/a.ts', `import { isIOS } from '@react-simplikit/mobile';\n`);

    const result = runCli(['mobile-to-root'], cwd);

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toContain('Could not be processed:');
    expect(result.stdout).toContain(path.join('app', 'package.json'));
    expect(result.stderr).toContain('Could not process 1 file:');
    expect(await readFile(path.join(cwd, 'src', 'a.ts'), 'utf8')).toBe(`import { isIOS } from 'react-simplikit';\n`);
  });

  it('keeps --json parseable when a file fails', async () => {
    await write('app/package.json', `{ "dependencies": { "@react-simplikit/mobile" `);

    const result = runCli(['mobile-to-root', '--json'], cwd);

    expect(result.exitCode).toBe(1);
    expect(reportOf(result.stdout)).toMatchObject({ failed: [{ file: path.join('app', 'package.json') }] });
  });

  it('never hangs or prompts under CI=true', async () => {
    await write('src/a.ts', `import { isIOS } from '@react-simplikit/mobile';\n`);

    const result = runCli(['mobile-to-root'], cwd, { ...process.env, CI: 'true' });

    expect(result.stdout).toContain('Changed 1 of');
  });
});

describe('running it twice', () => {
  it('changes nothing on the second run', async () => {
    await write(
      'src/a.tsx',
      `import { useToggle } from 'react-simplikit';\nimport { isIOS } from '@react-simplikit/mobile';\n`
    );
    await write('app/package.json', `{\n  "dependencies": {\n    "@react-simplikit/mobile": "^0.1.1"\n  }\n}\n`);

    expect(runCli(['mobile-to-root'], cwd).exitCode).toBe(0);
    const afterFirst = await readFile(path.join(cwd, 'src', 'a.tsx'), 'utf8');

    const second = runCli(['mobile-to-root', '--json'], cwd);

    expect(reportOf(second.stdout)).toMatchObject({ changed: [] });
    expect(await readFile(path.join(cwd, 'src', 'a.tsx'), 'utf8')).toBe(afterFirst);
  });
});

describe('declined merges', () => {
  it('tells the user why a line was left on its own', async () => {
    await write(
      'src/a.ts',
      `import { useToggle as isIOS } from 'react-simplikit';\nimport { isIOS } from '@react-simplikit/mobile';\n`
    );

    const result = runCli(['mobile-to-root'], cwd);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Needs a manual follow-up:');
    expect(result.stdout).toContain('src/a.ts:2');
    expect(result.stdout).toContain('Merging it by hand would change what the name binds');
  });
});

describe('the published tarball', () => {
  it('carries the bin entry it declares, executable and runnable', async () => {
    const workDir = await mkdtemp(path.join(fixturesRoot, 'pack-'));
    const packed = spawnSync('npm', ['pack', '--pack-destination', workDir], { cwd: packageRoot, encoding: 'utf8' });

    expect(packed.status).toBe(0);

    const tarball = path.join(workDir, packed.stdout.trim().split('\n').at(-1) ?? '');

    expect(spawnSync('tar', ['-xzf', tarball, '-C', workDir]).status).toBe(0);

    const extracted = path.join(workDir, 'package');
    const packedBin = path.join(extracted, manifest.bin);

    expect(reportOf(await readFile(path.join(extracted, 'package.json'), 'utf8'))).toMatchObject({
      version: manifest.version,
      bin: manifest.bin,
    });
    expect((await stat(packedBin)).mode & 0o111).toBeGreaterThan(0);
    expect((await readFile(packedBin, 'utf8')).startsWith('#!/usr/bin/env node')).toBe(true);

    const run = spawnSync(YARN, ['node', packedBin, '--version'], { cwd: packageRoot, encoding: 'utf8' });

    expect(run.stdout.trim()).toBe(manifest.version);
  });
});

describe('--debug', () => {
  it('prints a stack for a usage error only when asked', () => {
    const plain = runCli(['mobile-to-root', 'missing-dir'], cwd);
    const debugged = runCli(['mobile-to-root', 'missing-dir', '--debug'], cwd);

    expect(plain.stderr).not.toContain('\n    at ');
    expect(debugged.stderr).toContain('\n    at ');
    expect(debugged.exitCode).toBe(2);
  });

  it('prints a stack for a file that could not be processed', async () => {
    await write('app/package.json', `{ "dependencies": { "@react-simplikit/mobile" `);

    const plain = runCli(['mobile-to-root'], cwd);
    const debugged = runCli(['mobile-to-root', '--debug'], cwd);

    expect(plain.stdout).not.toContain('\n    at ');
    expect(debugged.stdout).toContain('\n    at ');
    expect(debugged.exitCode).toBe(1);
  });

  it('is not tripped by the string appearing as a flag value', () => {
    const result = runCli(['mobile-to-root', 'missing-dir', '--ignore', '--debug'], cwd);

    expect(result.stderr).not.toContain('\n    at ');
  });
});

describe('what the operator sees on stderr', () => {
  it('names the files it could not process, not just a count', async () => {
    await write('app/package.json', `{ "dependencies": { "@react-simplikit/mobile" `);

    const result = runCli(['mobile-to-root'], cwd);

    expect(result.stderr).toContain(path.join('app', 'package.json'));
  });

  it('says a command is required when given none', () => {
    const result = runCli([], cwd);

    expect(result.exitCode).toBe(2);
    expect(result.stderr).toContain('mobile-to-root');
  });
});
