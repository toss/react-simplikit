import fastGlob from 'fast-glob';
import { stat } from 'node:fs/promises';
import path from 'node:path';

import { UsageError } from '../errors.ts';

const SOURCE_EXTENSIONS = ['ts', 'tsx', 'mts', 'cts', 'js', 'jsx', 'mjs', 'cjs'];

// Directories whose contents are generated or vendored: rewriting them is either
// useless (regenerated on the next build) or actively wrong (someone else's code).
export const DEFAULT_IGNORE = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/out/**',
  '**/coverage/**',
  '**/.next/**',
  '**/.yarn/**',
  '**/.git/**',
];

export type CollectFilesOptions = {
  paths: readonly string[];
  ignore: readonly string[];
  includePackageJson: boolean;
  cwd: string;
};

export async function collectFiles({ paths, ignore, includePackageJson, cwd }: CollectFilesOptions): Promise<string[]> {
  const patterns: string[] = [];
  const direct: string[] = [];

  for (const target of paths) {
    const absolute = path.resolve(cwd, target);
    const stats = await stat(absolute).catch(() => undefined);

    if (stats === undefined) {
      throw new UsageError(`Path not found: ${target}. Pass a file or directory that exists.`);
    }

    if (!stats.isDirectory()) {
      direct.push(absolute);
      continue;
    }

    // convertPathToPattern escapes glob metacharacters that are legal in a real
    // directory name, so a path containing `(` or `[` still matches itself.
    const base = fastGlob.convertPathToPattern(absolute);

    patterns.push(`${base}/**/*.{${SOURCE_EXTENSIONS.join(',')}}`);

    if (includePackageJson) {
      patterns.push(`${base}/**/package.json`);
    }
  }

  const globbed =
    patterns.length === 0
      ? []
      : await fastGlob(patterns, {
          ignore: [...DEFAULT_IGNORE, ...ignore],
          absolute: true,
          followSymbolicLinks: false,
        });

  return [...new Set([...direct, ...globbed])].toSorted();
}
