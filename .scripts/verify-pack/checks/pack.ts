import { execSync } from 'node:child_process';
import path from 'node:path';

import { execWithOutput } from '../../utils/execWithOutput.ts';
import { getRootPath } from '../../utils/getRootPath.ts';
import { TargetPackage } from '../packages.ts';

export function buildAll(): Promise<void> {
  // `yarn run prepack` also builds examples/*, which is unrelated to publishing; scope to packages/* only.
  return execWithOutput('yarn', ['workspaces', 'foreach', '-Apt', '--include', 'packages/*', 'run', 'build'], {
    cwd: getRootPath(),
  });
}

export function packPackage(pkg: TargetPackage, destDir: string): { tgzPath: string } {
  const stdout = execSync(`npm pack --pack-destination ${JSON.stringify(destDir)}`, {
    cwd: path.join(getRootPath(), pkg.dir),
    encoding: 'utf8',
  });
  const filename = stdout.trim().split('\n').at(-1)!.trim();
  return { tgzPath: path.join(destDir, filename) };
}
