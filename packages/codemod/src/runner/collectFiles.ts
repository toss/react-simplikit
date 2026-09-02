import fastGlob from 'fast-glob';
import { lstat } from 'node:fs/promises';
import path from 'node:path';

import { UsageError } from '../errors.ts';

const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.mts', '.cts', '.js', '.jsx', '.mjs', '.cjs']);

const DEFAULT_IGNORE = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/out/**',
  '**/coverage/**',
  '**/.next/**',
  '**/.yarn/**',
  '**/.git/**',
  '**/.pnp.*',
];

export type CollectFilesOptions = {
  paths: readonly string[];
  ignore: readonly string[];
  includePackageJson: boolean;
  cwd: string;
};

export async function collectFiles({ paths, ignore, includePackageJson, cwd }: CollectFilesOptions): Promise<string[]> {
  const patterns: string[] = [];

  for (const target of paths) {
    const absolute = path.resolve(cwd, target);
    const stats = await lstat(absolute).catch(() => undefined);

    if (stats === undefined) {
      throw new UsageError(`Path not found: ${target}. Pass a file or directory that exists.`);
    }

    const base = fastGlob.convertPathToPattern(absolute);

    patterns.push(stats.isDirectory() ? `${base}/**/*` : base);
  }

  const base = fastGlob.convertPathToPattern(cwd);
  const scoped = ignore.map(pattern => {
    // A leading `./` joins into `/./`, which micromatch never matches.
    const relative = pattern.startsWith('./') ? pattern.slice(2) : pattern;

    return relative.startsWith('**/') ? relative : `${base}/${relative}`;
  });

  const files = await fastGlob(patterns, {
    ignore: [...DEFAULT_IGNORE, ...scoped],
    absolute: true,
    dot: true,
    followSymbolicLinks: false,
  });

  return files
    .filter(file =>
      path.basename(file) === 'package.json' ? includePackageJson : SOURCE_EXTENSIONS.has(path.extname(file))
    )
    .toSorted();
}
