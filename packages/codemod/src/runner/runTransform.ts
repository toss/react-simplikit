import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { describeError } from '../errors.ts';
import { transformPackageJson } from '../transforms/mobileToRoot/transformPackageJson.ts';
import { transformSource } from '../transforms/mobileToRoot/transformSource.ts';
import type { FileFailure, FileResult, ManualNote, PackageJsonChange, RunResult, SourceChange } from '../types.ts';

export type RunTransformOptions = {
  files: readonly string[];
  cwd: string;
  dryRun: boolean;
};

type FileOutcome = {
  text: string;
  changes: SourceChange[];
  dependencies: PackageJsonChange[];
  manual: string[];
};

function transformFile(file: string, original: string): FileOutcome {
  if (path.basename(file) === 'package.json') {
    const result = transformPackageJson(original);

    return { text: result.text, changes: [], dependencies: result.changes, manual: result.manual };
  }

  const result = transformSource(original, file);

  return { text: result.code, changes: result.changes, dependencies: [], manual: [] };
}

export async function runTransform({ files, cwd, dryRun }: RunTransformOptions): Promise<RunResult> {
  const changed: FileResult[] = [];
  const manual: ManualNote[] = [];
  const failed: FileFailure[] = [];

  for (const file of files) {
    const relative = path.relative(cwd, file);

    try {
      const original = await readFile(file, 'utf8');
      const outcome = transformFile(file, original);

      for (const reason of outcome.manual) {
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
      failed.push({ file: relative, reason: describeError(error) });
    }
  }

  return { scanned: files.length, changed, manual, failed };
}
