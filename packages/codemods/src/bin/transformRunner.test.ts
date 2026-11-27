import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { transformerDirectory, transformRunner } from './transformRunner.ts';

// Everything a pipe can drive runs against the built bin in test/cli.e2e.test.ts; only the prompts need a terminal.
const { execa, prompts } = vi.hoisted(() => ({ execa: vi.fn(), prompts: vi.fn() }));

vi.mock('execa', () => ({ default: execa }));
vi.mock('prompts', () => ({ default: prompts }));

const { isTTY } = process.stdin;

afterEach(() => {
  process.stdin.isTTY = isTTY;
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe('transformRunner in a terminal', () => {
  it('asks for the transform, then the path, and runs with the answers', async () => {
    process.stdin.isTTY = true;
    vi.spyOn(console, 'log').mockImplementation(() => {});
    execa.mockResolvedValue({ failed: false, exitCode: 0, stdout: '', stderr: '' });
    prompts.mockResolvedValueOnce({ transformer: 'mobile-to-root' }).mockResolvedValueOnce({ path: 'test' });

    await transformRunner();

    expect(prompts).toHaveBeenCalledTimes(2);
    expect(execa).toHaveBeenLastCalledWith(
      process.execPath,
      expect.arrayContaining(['--transform', join(transformerDirectory, 'mobile-to-root.cjs'), '.']),
      { cwd: resolve('test'), stdio: 'inherit', reject: false }
    );
  });

  it('exits 1 when a prompt is cancelled', async () => {
    process.stdin.isTTY = true;
    prompts.mockImplementationOnce((_question, { onCancel }) => onCancel());

    const run = transformRunner(undefined, 'src');

    await expect(run).rejects.toThrow('process.exit unexpectedly called with "1"');
    expect(execa).not.toHaveBeenCalled();
  });
});
