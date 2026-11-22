import { lstatSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { jscodeshiftExecutable, transformerDirectory, transformRunner } from './transformRunner.ts';

const { isTTY } = process.stdin;

const { execa, prompts } = vi.hoisted(() => ({ execa: vi.fn(), prompts: vi.fn() }));

vi.mock('execa', () => ({ default: execa }));
vi.mock('prompts', () => ({ default: prompts }));

const IGNORE_ARGS = [
  '--ignore-pattern=**/node_modules/**',
  '--ignore-pattern=**/dist/**',
  '--ignore-pattern=**/build/**',
  '--ignore-pattern=**/out/**',
  '--ignore-pattern=**/coverage/**',
  '--ignore-pattern=**/.next/**',
  '--ignore-pattern=**/.yarn/**',
  '--ignore-pattern=**/.git/**',
  '--ignore-pattern=**/.pnp.*',
].join(' ');

describe('transformRunner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    execa.mockResolvedValue({ failed: false, exitCode: 0, stdout: '' });
  });

  afterEach(() => {
    process.stdin.isTTY = isTTY;
  });

  it('finds the jscodeshift executable', () => {
    expect(lstatSync(jscodeshiftExecutable).isFile()).toBe(true);
  });

  it('runs jscodeshift with the given transformer and path', async () => {
    await transformRunner('mobile-to-root', 'src');

    const transformPath = join(transformerDirectory, 'mobile-to-root.cjs');

    expect(console.log).toHaveBeenCalledWith(
      `Executing command: jscodeshift --no-babel --fail-on-error ${IGNORE_ARGS} --extensions=tsx,ts,mts,cts,jsx,js,mjs,cjs,json --transform ${transformPath} .`
    );
    expect(execa).toHaveBeenCalledWith(
      process.execPath,
      expect.arrayContaining([jscodeshiftExecutable, '--transform', transformPath, '.']),
      { cwd: resolve('src'), stdio: 'inherit', reject: false }
    );
  });

  it('passes --dry and --print through', async () => {
    await transformRunner('mobile-to-root', 'src', { dry: true, print: true });

    expect(execa).toHaveBeenCalledWith(
      process.execPath,
      expect.arrayContaining(['--dry', '--print']),
      expect.anything()
    );
  });

  it('asks for the transformer and the path when they are missing', async () => {
    process.stdin.isTTY = true;
    prompts.mockResolvedValueOnce({ transformer: 'mobile-to-root' }).mockResolvedValueOnce({ path: 'test' });

    await transformRunner();

    expect(prompts).toHaveBeenCalledTimes(2);
    expect(execa).toHaveBeenCalledWith(
      process.execPath,
      expect.arrayContaining([join(transformerDirectory, 'mobile-to-root.cjs'), '.']),
      expect.objectContaining({ cwd: resolve('test') })
    );
  });

  it('exits without asking when a missing argument cannot be prompted for', async () => {
    process.stdin.isTTY = false;

    await expect(transformRunner('mobile-to-root')).rejects.toThrow('process.exit unexpectedly called with "1"');
    expect(prompts).not.toHaveBeenCalled();
    expect(execa).not.toHaveBeenCalled();
  });

  it('exits when a prompt is cancelled', async () => {
    process.stdin.isTTY = true;
    prompts.mockImplementationOnce((_question, { onCancel }) => onCancel());

    await expect(transformRunner(undefined, 'src')).rejects.toThrow('process.exit unexpectedly called with "1"');
  });

  it('exits on an unknown transformer', async () => {
    await expect(transformRunner('unknown', 'src')).rejects.toThrow('process.exit unexpectedly called with "1"');
    expect(console.error).toHaveBeenCalledWith('- mobile-to-root');
  });

  it('runs from the file s folder when the path is a file', async () => {
    await transformRunner('mobile-to-root', 'package.json');

    expect(execa).toHaveBeenCalledWith(
      process.execPath,
      expect.arrayContaining(['package.json']),
      expect.objectContaining({ cwd: resolve('.') })
    );
  });

  it('exits on a path that does not exist', async () => {
    await expect(transformRunner('mobile-to-root', 'missing-dir')).rejects.toThrow(
      'process.exit unexpectedly called with "1"'
    );
    expect(console.error).toHaveBeenCalledWith('Path not found: missing-dir');
    expect(execa).not.toHaveBeenCalled();
  });

  it('exits when jscodeshift fails', async () => {
    execa.mockResolvedValueOnce({ failed: false, stdout: '' }).mockResolvedValueOnce({ failed: true, exitCode: 1 });

    await expect(transformRunner('mobile-to-root', 'src')).rejects.toThrow('process.exit unexpectedly called with "1"');
  });

  it('stops before writing when the git working tree has changes', async () => {
    execa.mockResolvedValueOnce({ failed: false, stdout: ' M src/a.ts' });

    await expect(transformRunner('mobile-to-root', 'src')).rejects.toThrow('process.exit unexpectedly called with "1"');
    expect(console.error).toHaveBeenCalledWith('You may use the --force flag to override this safety check.');
    expect(execa).toHaveBeenCalledTimes(1);
  });

  it('runs on a dirty working tree with --force', async () => {
    execa.mockResolvedValueOnce({ failed: false, stdout: ' M src/a.ts' });

    await transformRunner('mobile-to-root', 'src', { force: true });

    expect(console.warn).toHaveBeenCalledWith('WARNING: Git directory is not clean. Forcibly continuing.');
    expect(execa).toHaveBeenLastCalledWith(process.execPath, expect.anything(), expect.anything());
  });

  it('runs outside a git repository', async () => {
    execa.mockResolvedValueOnce({ failed: true, stdout: '' });

    await transformRunner('mobile-to-root', 'src');

    expect(execa).toHaveBeenLastCalledWith(process.execPath, expect.anything(), expect.anything());
  });

  it('skips the git check on a dry run', async () => {
    await transformRunner('mobile-to-root', 'src', { dry: true });

    expect(execa).toHaveBeenCalledTimes(1);
    expect(execa).toHaveBeenCalledWith(process.execPath, expect.anything(), expect.anything());
  });

  it('passes --jscodeshift options through', async () => {
    await transformRunner('mobile-to-root', 'src', { jscodeshift: ' --cpus=2  --verbose=2 ' });

    expect(execa).toHaveBeenLastCalledWith(
      process.execPath,
      expect.arrayContaining(['--cpus=2', '--verbose=2']),
      expect.anything()
    );
  });

  it('prints the next steps after a run that wrote files', async () => {
    await transformRunner('mobile-to-root', 'src');

    expect(console.log).toHaveBeenLastCalledWith(expect.stringContaining('Next steps:'));
  });

  it('prints no next steps after a dry run', async () => {
    await transformRunner('mobile-to-root', 'src', { dry: true });

    expect(console.log).not.toHaveBeenCalledWith(expect.stringContaining('Next steps:'));
  });
});
