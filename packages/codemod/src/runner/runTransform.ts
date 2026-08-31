import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { describeError, ExecutionError } from '../errors.ts';
import { transformPackageJson } from '../transforms/mobileToRoot/transformPackageJson.ts';
import { transformSource } from '../transforms/mobileToRoot/transformSource.ts';
import type { FileResult, ManualNote, PackageJsonChange, RunResult, SourceChange } from '../types.ts';

export type RunTransformOptions = {
  files: readonly string[];
  cwd: string;
  dryRun: boolean;
};

type FileOutcome = {
  text: string;
  changes: SourceChange[];
  dependencies: PackageJsonChange[];
  reasons: string[];
};

function transformFile(file: string, original: string): FileOutcome {
  if (path.basename(file) === 'package.json') {
    const result = transformPackageJson(original);

    return {
      text: result.text,
      changes: [],
      dependencies: result.changes,
      reasons: result.manual.map(note => note.reason),
    };
  }

  const result = transformSource(original, file);

  return { text: result.code, changes: result.changes, dependencies: [], reasons: [] };
}

export async function runTransform({ files, cwd, dryRun }: RunTransformOptions): Promise<RunResult> {
  const changed: FileResult[] = [];
  const manual: ManualNote[] = [];
  let scanned = 0;

  for (const file of files) {
    const relative = path.relative(cwd, file);

    try {
      scanned += 1;

      const original = await readFile(file, 'utf8');
      const outcome = transformFile(file, original);

      for (const reason of outcome.reasons) {
        manual.push({ file: relative, reason });
      }

      if (outcome.text === original) {
        continue;
      }

      if (!dryRun) {
        await writeFile(file, outcome.text, 'utf8');
      }

      changed.push({ file: relative, changes: outcome.changes, dependencies: outcome.dependencies });
    } catch (error) {
      // Name the file: a bare "Unexpected end of JSON input" is unactionable, and the
      // run is not atomic, so the user needs to know where it stopped.
      throw new ExecutionError(`Failed on ${relative}: ${describeError(error)}`);
    }
  }

  return { scanned, changed, manual };
}
