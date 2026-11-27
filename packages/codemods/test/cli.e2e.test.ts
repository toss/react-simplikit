import { spawnSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import manifest from '../package.json';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// From the manifest, so a `bin` left behind by a build-output rename fails here.
const binPath = path.join(packageRoot, manifest.bin);
const fixturesRoot = path.join(packageRoot, 'test', '__fixtures__');
// Projects live outside this repository, so its own uncommitted changes never trip the git check.
const projectsRoot = path.join(tmpdir(), 'react-simplikit-codemods-e2e');

const MOBILE_IMPORT = `import { isIOS } from '@react-simplikit/mobile';\n`;
const ROOT_IMPORT = `import { isIOS } from 'react-simplikit';\n`;

beforeAll(async () => {
  await mkdir(fixturesRoot, { recursive: true });
  await mkdir(projectsRoot, { recursive: true });
});

afterAll(async () => {
  await rm(fixturesRoot, { force: true, recursive: true });
  await rm(projectsRoot, { force: true, recursive: true });
});

// The PnP loader comes in through NODE_OPTIONS, which the child inherits from the test run.
function runCli(args: readonly string[], bin = binPath) {
  const { stdout, stderr, status } = spawnSync(process.execPath, [bin, ...args], {
    cwd: packageRoot,
    encoding: 'utf8',
  });

  return { stdout, stderr, exitCode: status ?? 1 };
}

async function createProject(files: Record<string, string>) {
  const project = await mkdtemp(path.join(projectsRoot, 'case-'));

  for (const [relative, contents] of Object.entries(files)) {
    await mkdir(path.dirname(path.join(project, relative)), { recursive: true });
    await writeFile(path.join(project, relative), contents, 'utf8');
  }

  return project;
}

function readProjectFile(project: string, relative: string) {
  return readFile(path.join(project, relative), 'utf8');
}

function git(project: string, ...args: string[]) {
  spawnSync('git', ['-c', 'user.name=codemods', '-c', 'user.email=codemods@example.com', ...args], { cwd: project });
}

describe('the bin', () => {
  it('starts with a shebang', async () => {
    const bin = await readFile(binPath, 'utf8');

    expect(bin.startsWith('#!/usr/bin/env node')).toBe(true);
  });

  it('prints its version with -v', () => {
    const result = runCli(['-v']);

    expect(result.stdout).toBe(`${manifest.version}\n`);
  });

  it('prints its usage with -h', () => {
    const result = runCli(['-h']);

    expect(result.stdout).toContain('Usage: @react-simplikit/codemods [codemod] [path]');
  });

  it('lists the transforms in the help', () => {
    const result = runCli(['-h']);

    expect(result.stdout).toContain('Transforms:\n  mobile-to-root  ');
  });
});

describe('arguments it rejects', () => {
  it('exits 1 instead of prompting when it is not run in a terminal', () => {
    const result = runCli(['mobile-to-root']);

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('Pass both the transform and the path');
  });

  it('exits 1 on an unknown transform and lists the valid ones', async () => {
    const project = await createProject({});

    const result = runCli(['nope', project]);

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('- mobile-to-root');
  });

  it('exits 1 on a path that does not exist', async () => {
    const project = await createProject({});

    const result = runCli(['mobile-to-root', path.join(project, 'missing')]);

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('Path not found');
  });
});

describe('a run', () => {
  it('rewrites source files and package.json, then prints the next steps', async () => {
    const project = await createProject({
      'src/a.tsx': `import { useToggle } from 'react-simplikit';\n${MOBILE_IMPORT}`,
      'package.json': `{\n  "dependencies": { "@react-simplikit/mobile": "^0.1.0" }\n}\n`,
    });

    const result = runCli(['mobile-to-root', project]);

    expect(result.exitCode).toBe(0);
    expect(await readProjectFile(project, 'src/a.tsx')).toBe(`import { useToggle, isIOS } from 'react-simplikit';\n`);
    expect(await readProjectFile(project, 'package.json')).toBe(
      `{\n  "dependencies": {\n    "react-simplikit": "^0.2.0"\n  }\n}\n`
    );
    expect(result.stdout).toContain('Next steps:');
  });

  it('prints the jscodeshift command it runs', async () => {
    const project = await createProject({});

    const result = runCli(['mobile-to-root', project]);

    expect(result.stdout).toContain(
      'Executing command: jscodeshift --no-babel --fail-on-error ' +
        '--ignore-pattern=**/node_modules/** --ignore-pattern=**/dist/** --ignore-pattern=**/build/** ' +
        '--ignore-pattern=**/out/** --ignore-pattern=**/coverage/** --ignore-pattern=**/.next/** ' +
        '--ignore-pattern=**/.yarn/** --ignore-pattern=**/.git/** --ignore-pattern=**/.pnp.* ' +
        '--extensions=tsx,ts,mts,cts,jsx,js,mjs,cjs,json --transform '
    );
  });

  it('migrates a single file given as the path', async () => {
    const project = await createProject({ 'src/a.ts': MOBILE_IMPORT, 'src/b.ts': MOBILE_IMPORT });

    const result = runCli(['mobile-to-root', path.join(project, 'src', 'a.ts')]);

    expect(result.exitCode).toBe(0);
    expect(await readProjectFile(project, 'src/a.ts')).toBe(ROOT_IMPORT);
    expect(await readProjectFile(project, 'src/b.ts')).toBe(MOBILE_IMPORT);
  });

  it('skips node_modules', async () => {
    const project = await createProject({ 'node_modules/dep/index.js': MOBILE_IMPORT });

    runCli(['mobile-to-root', project]);

    expect(await readProjectFile(project, 'node_modules/dep/index.js')).toBe(MOBILE_IMPORT);
  });

  it('still migrates a project that sits under a build folder', async () => {
    const project = await createProject({ 'build/app/src/a.ts': MOBILE_IMPORT });

    const result = runCli(['mobile-to-root', path.join(project, 'build', 'app')]);

    expect(result.exitCode).toBe(0);
    expect(await readProjectFile(project, 'build/app/src/a.ts')).toBe(ROOT_IMPORT);
  });

  it('migrates the rest and exits 1 when a file cannot be parsed', async () => {
    const project = await createProject({
      'src/broken.ts': `${MOBILE_IMPORT}import { isIOS } from 'x';\n`,
      'src/ok.ts': MOBILE_IMPORT,
    });

    const result = runCli(['mobile-to-root', project]);

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toContain('broken.ts');
    expect(await readProjectFile(project, 'src/ok.ts')).toBe(ROOT_IMPORT);
  });

  it('changes nothing on a second run', async () => {
    const project = await createProject({
      'src/a.ts': `import { useToggle } from 'react-simplikit';\n${MOBILE_IMPORT}`,
    });
    runCli(['mobile-to-root', project]);

    runCli(['mobile-to-root', project]);

    expect(await readProjectFile(project, 'src/a.ts')).toBe(`import { useToggle, isIOS } from 'react-simplikit';\n`);
  });
});

describe('--dry and --print', () => {
  it('writes nothing and prints no next steps with --dry', async () => {
    const project = await createProject({ 'src/a.ts': MOBILE_IMPORT });

    const result = runCli(['mobile-to-root', project, '--dry']);

    expect(result.exitCode).toBe(0);
    expect(await readProjectFile(project, 'src/a.ts')).toBe(MOBILE_IMPORT);
    expect(result.stdout).not.toContain('Next steps:');
  });

  it('prints the transformed source with --print', async () => {
    const project = await createProject({ 'src/a.ts': MOBILE_IMPORT });

    const result = runCli(['mobile-to-root', project, '--dry', '--print']);

    expect(result.stdout).toContain(ROOT_IMPORT);
  });
});

describe('the git safety check', () => {
  it('stops on uncommitted changes and writes nothing', async () => {
    const project = await createProject({ 'src/a.ts': MOBILE_IMPORT });
    git(project, 'init', '-q');

    const result = runCli(['mobile-to-root', project]);

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('please stash or commit your git changes');
    expect(await readProjectFile(project, 'src/a.ts')).toBe(MOBILE_IMPORT);
  });

  it('runs on a committed working tree', async () => {
    const project = await createProject({ 'src/a.ts': MOBILE_IMPORT });
    git(project, 'init', '-q');
    git(project, 'add', '-A');
    git(project, 'commit', '-q', '-m', 'init');

    const result = runCli(['mobile-to-root', project]);

    expect(result.exitCode).toBe(0);
    expect(await readProjectFile(project, 'src/a.ts')).toBe(ROOT_IMPORT);
  });

  it('runs on uncommitted changes with --force and warns', async () => {
    const project = await createProject({ 'src/a.ts': MOBILE_IMPORT });
    git(project, 'init', '-q');

    const result = runCli(['mobile-to-root', project, '--force']);

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toContain('WARNING: Git directory is not clean. Forcibly continuing.');
    expect(await readProjectFile(project, 'src/a.ts')).toBe(ROOT_IMPORT);
  });

  it('skips the check on a dry run', async () => {
    const project = await createProject({ 'src/a.ts': MOBILE_IMPORT });
    git(project, 'init', '-q');

    const result = runCli(['mobile-to-root', project, '--dry']);

    expect(result.exitCode).toBe(0);
    expect(result.stderr).not.toContain('please stash or commit');
  });

  it('stops when git cannot read the working tree', async () => {
    const project = await createProject({ 'src/a.ts': MOBILE_IMPORT });
    git(project, 'init', '-q');
    await writeFile(path.join(project, '.git', 'index'), 'not an index');

    const result = runCli(['mobile-to-root', project]);

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('Could not read the git status');
    expect(await readProjectFile(project, 'src/a.ts')).toBe(MOBILE_IMPORT);
  });

  it('runs in a folder outside any git repository', async () => {
    const project = await createProject({ 'src/a.ts': MOBILE_IMPORT });

    const result = runCli(['mobile-to-root', project]);

    expect(result.exitCode).toBe(0);
    expect(await readProjectFile(project, 'src/a.ts')).toBe(ROOT_IMPORT);
  });
});

describe('--jscodeshift', () => {
  it('passes the options through to jscodeshift', async () => {
    const project = await createProject({ 'src/a.ts': MOBILE_IMPORT, 'legacy/b.ts': MOBILE_IMPORT });

    const result = runCli(['mobile-to-root', project, '--jscodeshift=--ignore-pattern=**/legacy/**']);

    expect(result.exitCode).toBe(0);
    expect(await readProjectFile(project, 'src/a.ts')).toBe(ROOT_IMPORT);
    expect(await readProjectFile(project, 'legacy/b.ts')).toBe(MOBILE_IMPORT);
  });
});

describe('the published tarball', () => {
  async function extractTarball() {
    const workDir = await mkdtemp(path.join(fixturesRoot, 'pack-'));
    const packed = spawnSync('npm', ['pack', '--ignore-scripts', '--pack-destination', workDir], {
      cwd: packageRoot,
      encoding: 'utf8',
    });
    const tarball = path.join(workDir, packed.stdout.trim().split('\n').at(-1) ?? '');
    spawnSync('tar', ['-xzf', tarball, '-C', workDir]);

    return path.join(workDir, 'package');
  }

  it('carries an executable bin that runs', async () => {
    const extracted = await extractTarball();
    const packedBin = path.join(extracted, manifest.bin);

    const result = runCli(['-v'], packedBin);

    expect((await stat(packedBin)).mode & 0o111).toBeGreaterThan(0);
    expect(result.stdout).toBe(`${manifest.version}\n`);
  });

  it('carries the transforms the bin runs', async () => {
    const extracted = await extractTarball();

    const transform = await stat(path.join(extracted, 'dist', 'transforms', 'mobile-to-root.cjs'));

    expect(transform.isFile()).toBe(true);
  });
});
