import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { describeFailure } from '../errors.ts';
import type { PackageJsonChange } from '../mobileToRoot/transformPackageJson.ts';
import { transformPackageJson } from '../mobileToRoot/transformPackageJson.ts';
import { transformSource } from '../mobileToRoot/transformSource.ts';
import type { SourceChange } from '../mobileToRoot/types.ts';

export type FileResult =
  | { kind: 'source'; file: string; changes: SourceChange[] }
  | { kind: 'manifest'; file: string; dependencies: PackageJsonChange[] };

export type ManualNote = {
  file: string;
  line: number | undefined;
  reason: string;
};

export type FileFailure = {
  file: string;
  reason: string;
};

export type RunResult = {
  scanned: number;
  changed: FileResult[];
  manual: ManualNote[];
  failed: FileFailure[];
};

type RunTransformOptions = {
  files: readonly string[];
  cwd: string;
  dryRun: boolean;
  debug: boolean;
};

type FileNote = { line: number | undefined; reason: string };

type FileOutcome = { text: string; notes: FileNote[] } & (
  | { kind: 'source'; changes: SourceChange[] }
  | { kind: 'manifest'; dependencies: PackageJsonChange[] }
);

function transformFile(file: string, original: string): FileOutcome {
  if (path.basename(file) === 'package.json') {
    const result = transformPackageJson(original);

    return {
      kind: 'manifest',
      text: result.text,
      dependencies: result.changes,
      notes: result.manual.map(reason => ({ line: undefined, reason })),
    };
  }

  const result = transformSource(original, file);

  return { kind: 'source', text: result.code, changes: result.changes, notes: result.notes };
}

export async function runTransform({ files, cwd, dryRun, debug }: RunTransformOptions): Promise<RunResult> {
  const changed: FileResult[] = [];
  const manual: ManualNote[] = [];
  const failed: FileFailure[] = [];

  for (const file of files) {
    // A target outside the current directory relativizes to a chain of `..` segments
    // that is longer and harder to read than the path itself, so keep the absolute one.
    const fromCwd = path.relative(cwd, file);
    const relative = fromCwd.startsWith('..') ? file : fromCwd;

    try {
      const original = await readFile(file, 'utf8');
      const outcome = transformFile(file, original);

      for (const note of outcome.notes) {
        manual.push({ file: relative, line: note.line, reason: note.reason });
      }

      if (outcome.text === original) {
        continue;
      }

      if (!dryRun) {
        await writeFile(file, outcome.text, 'utf8');
      }

      changed.push(
        outcome.kind === 'manifest'
          ? { kind: 'manifest', file: relative, dependencies: outcome.dependencies }
          : { kind: 'source', file: relative, changes: outcome.changes }
      );
    } catch (error) {
      const stack = debug && error instanceof Error ? error.stack : undefined;
      const reason = describeFailure(error);

      failed.push({ file: relative, reason: stack === undefined ? reason : `${reason}\n${stack}` });
    }
  }

  return { scanned: files.length, changed, manual, failed };
}
