import { execFile } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

const execFileAsync = promisify(execFile);

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Resolved from the manifest, not hard-coded: the e2e has to exercise the entry point
// consumers actually get, so a `bin` left behind by a build-output rename fails here.
const { bin } = JSON.parse(readFileSync(path.join(packageRoot, 'package.json'), 'utf8'));
const binPath = path.join(packageRoot, bin);
const fixturesRoot = path.join(packageRoot, 'test', '__fixtures__');

const YARN = process.platform === 'win32' ? 'yarn.cmd' : 'yarn';

type CliResult = { stdout: string; stderr: string; exitCode: number };

async function runCli(args: readonly string[], cwd: string): Promise<CliResult> {
  try {
    const { stdout, stderr } = await execFileAsync(YARN, ['node', binPath, ...args], { cwd });

    return { stdout, stderr, exitCode: 0 };
  } catch (error) {
    const failure = error as { stdout?: string; stderr?: string; code?: number };

    return { stdout: failure.stdout ?? '', stderr: failure.stderr ?? '', exitCode: failure.code ?? 1 };
  }
}

let cwd = '';

async function write(relative: string, contents: string): Promise<void> {
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

  it('prints its version to stdout and exits 0', async () => {
    const result = await runCli(['--version'], cwd);

    expect(result.exitCode).toBe(0);
    expect(result.stdout.trim()).toMatch(/^\d+\.\d+\.\d+/);
    expect(result.stderr).toBe('');
  });

  it('prints help for the transform and exits 0', async () => {
    const result = await runCli(['mobile-to-root', '--help'], cwd);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('--dry-run');
    expect(result.stdout).toContain('--json');
    expect(result.stdout).toContain('Examples:');
  });

  it('exits 2 for an unknown command, with the message on stderr', async () => {
    const result = await runCli(['nope'], cwd);

    expect(result.exitCode).toBe(2);
    expect(result.stderr).not.toBe('');
    expect(result.stdout).toBe('');
  });

  it('exits 2 when no command is given', async () => {
    expect((await runCli([], cwd)).exitCode).toBe(2);
  });

  it('exits 2 for a path that does not exist and names it', async () => {
    const result = await runCli(['mobile-to-root', 'missing-dir'], cwd);

    expect(result.exitCode).toBe(2);
    expect(result.stderr).toContain('Path not found: missing-dir');
  });

  it('rewrites imports and names the changed file on stdout', async () => {
    await write('src/a.tsx', `import { useKeyboardHeight } from '@react-simplikit/mobile';\n`);

    const result = await runCli(['mobile-to-root'], cwd);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain(path.join('src', 'a.tsx'));
    expect(await readFile(path.join(cwd, 'src', 'a.tsx'), 'utf8')).toBe(
      `import { useKeyboardHeight } from 'react-simplikit';\n`
    );
  });

  it('leaves files alone with --dry-run', async () => {
    const original = `import { isIOS } from '@react-simplikit/mobile';\n`;
    await write('src/a.ts', original);

    const result = await runCli(['mobile-to-root', '--dry-run'], cwd);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Would change');
    expect(await readFile(path.join(cwd, 'src', 'a.ts'), 'utf8')).toBe(original);
  });

  it('prints JSON and nothing else on stdout with --json', async () => {
    await write('src/a.ts', `import { isIOS } from '@react-simplikit/mobile';\n`);

    const result = await runCli(['mobile-to-root', '--json'], cwd);
    const parsed = JSON.parse(result.stdout) as Record<string, unknown> & { transform: string; changed: unknown[] };

    expect(result.exitCode).toBe(0);
    expect(Object.keys(parsed).toSorted()).toEqual(['changed', 'dryRun', 'failed', 'manual', 'scanned', 'transform']);
    expect(parsed.transform).toBe('mobile-to-root');
    expect(parsed.changed).toHaveLength(1);
  });

  it('rewrites the package.json dependency and skips it with --no-package-json', async () => {
    const manifest = `{\n  "dependencies": {\n    "@react-simplikit/mobile": "^0.1.1"\n  }\n}\n`;

    await write('app/package.json', manifest);
    expect((await runCli(['mobile-to-root'], cwd)).exitCode).toBe(0);
    expect(await readFile(path.join(cwd, 'app', 'package.json'), 'utf8')).toContain('"react-simplikit"');

    await write('app/package.json', manifest);
    expect((await runCli(['mobile-to-root', '--no-package-json'], cwd)).exitCode).toBe(0);
    expect(await readFile(path.join(cwd, 'app', 'package.json'), 'utf8')).toBe(manifest);
  });

  it('honours a repeatable --ignore glob', async () => {
    const original = `import { isIOS } from '@react-simplikit/mobile';\n`;

    await write('src/a.ts', original);
    await write('legacy/b.ts', original);
    await write('vendor/c.ts', original);

    const result = await runCli(
      ['mobile-to-root', '--ignore', '**/legacy/**', '--ignore', '**/vendor/**', '--json'],
      cwd
    );
    const parsed = JSON.parse(result.stdout) as { changed: { file: string }[] };

    expect(parsed.changed.map(entry => entry.file)).toEqual([path.join('src', 'a.ts')]);
  });

  it('accepts an explicit target directory', async () => {
    const original = `import { isIOS } from '@react-simplikit/mobile';\n`;

    await write('src/a.ts', original);
    await write('other/b.ts', original);

    const result = await runCli(['mobile-to-root', 'src', '--json'], cwd);
    const parsed = JSON.parse(result.stdout) as { changed: { file: string }[] };

    expect(parsed.changed.map(entry => entry.file)).toEqual([path.join('src', 'a.ts')]);
    expect(await readFile(path.join(cwd, 'other', 'b.ts'), 'utf8')).toBe(original);
  });

  it('exits 0 and says nothing changed on a clean tree', async () => {
    await write('src/a.ts', `import { useToggle } from 'react-simplikit';\n`);

    const result = await runCli(['mobile-to-root'], cwd);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('No file imports');
  });

  it('reports a file it cannot parse, migrates the rest, and exits 1', async () => {
    await write('app/package.json', `{ "dependencies": { "@react-simplikit/mobile" `);
    await write('src/a.ts', `import { isIOS } from '@react-simplikit/mobile';\n`);

    const result = await runCli(['mobile-to-root'], cwd);

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toContain('Could not be processed:');
    expect(result.stdout).toContain(path.join('app', 'package.json'));
    expect(result.stderr).toContain('Could not process 1 file:');
    expect(await readFile(path.join(cwd, 'src', 'a.ts'), 'utf8')).toBe(`import { isIOS } from 'react-simplikit';\n`);
  });

  it('keeps --json parseable when a file fails', async () => {
    await write('app/package.json', `{ "dependencies": { "@react-simplikit/mobile" `);

    const result = await runCli(['mobile-to-root', '--json'], cwd);
    const parsed = JSON.parse(result.stdout) as { failed: { file: string }[] };

    expect(result.exitCode).toBe(1);
    expect(parsed.failed.map(entry => entry.file)).toEqual([path.join('app', 'package.json')]);
  });

  it('never hangs or prompts under CI=true', async () => {
    await write('src/a.ts', `import { isIOS } from '@react-simplikit/mobile';\n`);

    const { stdout } = await execFileAsync(YARN, ['node', binPath, 'mobile-to-root'], {
      cwd,
      env: { ...process.env, CI: 'true' },
    });

    expect(stdout).toContain('Changed 1 of');
  });
});

describe('running it twice', () => {
  it('changes nothing on the second run', async () => {
    await write(
      'src/a.tsx',
      `import { useToggle } from 'react-simplikit';\nimport { isIOS } from '@react-simplikit/mobile';\n`
    );
    await write('app/package.json', `{\n  "dependencies": {\n    "@react-simplikit/mobile": "^0.1.1"\n  }\n}\n`);

    expect((await runCli(['mobile-to-root'], cwd)).exitCode).toBe(0);
    const afterFirst = await readFile(path.join(cwd, 'src', 'a.tsx'), 'utf8');

    const second = await runCli(['mobile-to-root', '--json'], cwd);
    const parsed = JSON.parse(second.stdout) as { changed: unknown[] };

    expect(parsed.changed).toEqual([]);
    expect(await readFile(path.join(cwd, 'src', 'a.tsx'), 'utf8')).toBe(afterFirst);
  });
});

describe('declined merges', () => {
  it('tells the user why a line was left on its own', async () => {
    await write(
      'src/a.ts',
      `import { useToggle as isIOS } from 'react-simplikit';\nimport { isIOS } from '@react-simplikit/mobile';\n`
    );

    const result = await runCli(['mobile-to-root'], cwd);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Needs a manual follow-up:');
    expect(result.stdout).toContain('src/a.ts:2');
    expect(result.stdout).toContain('Merging it by hand would change what the name binds');
  });
});

describe('the published tarball', () => {
  it('carries the bin entry it declares, executable and runnable', async () => {
    const workDir = await mkdtemp(path.join(fixturesRoot, 'pack-'));
    const packed = await execFileAsync('npm', ['pack', '--pack-destination', workDir], { cwd: packageRoot });
    const tarball = path.join(workDir, packed.stdout.trim().split('\n').at(-1) ?? '');

    await execFileAsync('tar', ['-xzf', tarball, '-C', workDir]);

    const extracted = path.join(workDir, 'package');
    const manifest = JSON.parse(await readFile(path.join(extracted, 'package.json'), 'utf8')) as {
      bin: string | Record<string, string>;
      version: string;
    };
    const declared = typeof manifest.bin === 'string' ? manifest.bin : Object.values(manifest.bin)[0];
    const packedBin = path.join(extracted, declared);

    expect((await stat(packedBin)).mode & 0o111).toBeGreaterThan(0);
    expect((await readFile(packedBin, 'utf8')).startsWith('#!/usr/bin/env node')).toBe(true);

    const run = await execFileAsync(YARN, ['node', packedBin, '--version'], { cwd: packageRoot });

    expect(run.stdout.trim()).toBe(manifest.version);
  });
});

describe('--debug', () => {
  it('prints a stack for a usage error only when asked', async () => {
    const plain = await runCli(['mobile-to-root', 'missing-dir'], cwd);
    const debugged = await runCli(['mobile-to-root', 'missing-dir', '--debug'], cwd);

    expect(plain.stderr).not.toContain('\n    at ');
    expect(debugged.stderr).toContain('\n    at ');
    expect(debugged.exitCode).toBe(2);
  });

  it('prints a stack for a file that could not be processed', async () => {
    await write('app/package.json', `{ "dependencies": { "@react-simplikit/mobile" `);

    const plain = await runCli(['mobile-to-root'], cwd);
    const debugged = await runCli(['mobile-to-root', '--debug'], cwd);

    expect(plain.stdout).not.toContain('\n    at ');
    expect(debugged.stdout).toContain('\n    at ');
    expect(debugged.exitCode).toBe(1);
  });

  it('is not tripped by the string appearing as a flag value', async () => {
    const result = await runCli(['mobile-to-root', 'missing-dir', '--ignore', '--debug'], cwd);

    expect(result.stderr).not.toContain('\n    at ');
  });
});

describe('what the operator sees on stderr', () => {
  it('names the files it could not process, not just a count', async () => {
    await write('app/package.json', `{ "dependencies": { "@react-simplikit/mobile" `);

    const result = await runCli(['mobile-to-root'], cwd);

    expect(result.stderr).toContain(path.join('app', 'package.json'));
  });

  it('says a command is required when given none', async () => {
    const result = await runCli([], cwd);

    expect(result.exitCode).toBe(2);
    expect(result.stderr).toContain('mobile-to-root');
  });
});
