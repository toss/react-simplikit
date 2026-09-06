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

type FileReport = Pick<RunResult, 'changed' | 'manual' | 'failed'>;

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

function displayNameOf(file: string, cwd: string) {
  const fromCwd = path.relative(cwd, file);

  return fromCwd.startsWith('..') ? file : fromCwd;
}

async function processFile(file: string, { cwd, dryRun, debug }: RunTransformOptions): Promise<FileReport> {
  const name = displayNameOf(file, cwd);
  let manual: ManualNote[] = [];

  try {
    const original = await readFile(file, 'utf8');
    const outcome = transformFile(file, original);

    manual = outcome.notes.map(note => ({ file: name, line: note.line, reason: note.reason }));

    if (outcome.text === original) {
      return { changed: [], manual, failed: [] };
    }

    if (!dryRun) {
      await writeFile(file, outcome.text, 'utf8');
    }

    const changed: FileResult =
      outcome.kind === 'manifest'
        ? { kind: 'manifest', file: name, dependencies: outcome.dependencies }
        : { kind: 'source', file: name, changes: outcome.changes };

    return { changed: [changed], manual, failed: [] };
  } catch (error) {
    const reason = describeFailure(error);
    const stack = debug && error instanceof Error ? error.stack : undefined;

    return {
      changed: [],
      manual,
      failed: [{ file: name, reason: stack === undefined ? reason : `${reason}\n${stack}` }],
    };
  }
}

export async function runTransform(options: RunTransformOptions): Promise<RunResult> {
  const reports: FileReport[] = [];

  for (const file of options.files) {
    reports.push(await processFile(file, options));
  }

  return {
    scanned: options.files.length,
    changed: reports.flatMap(report => report.changed),
    manual: reports.flatMap(report => report.manual),
    failed: reports.flatMap(report => report.failed),
  };
}
