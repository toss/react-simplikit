import type { PackageJsonChange } from './mobileToRoot/transformPackageJson.ts';
import type { FileResult, RunResult } from './runner/runTransform.ts';
import { MIN_RUNTIME_VERSION, MOBILE_PACKAGE_NAME, ROOT_PACKAGE_NAME, TRANSFORM_NAME } from './constants.ts';

function describeDependency(change: PackageJsonChange) {
  const added = change.added === null ? '' : ` +${ROOT_PACKAGE_NAME}@${change.added}`;

  return `${change.field}: -${change.removed}${added}`;
}

function describeFile(file: FileResult) {
  if (file.kind === 'source') {
    return file.changes.map(change => `${change.kind}:${change.line}`).join(', ');
  }

  return file.dependencies.length === 0 ? 'rewritten' : file.dependencies.map(describeDependency).join(', ');
}

function summarize({ changed, failed, manual, scanned }: RunResult, dryRun: boolean) {
  if (changed.length > 0) {
    return [
      `${dryRun ? 'Would change' : 'Changed'} ${changed.length} of ${scanned} files:`,
      ...changed.map(file => `  ${file.file} (${describeFile(file)})`),
    ];
  }

  const nothingToReport = manual.length === 0 && failed.length === 0;

  return [
    nothingToReport
      ? `Scanned ${scanned} files. No file imports ${MOBILE_PACKAGE_NAME}.`
      : `Scanned ${scanned} files. No file was rewritten.`,
  ];
}

function nextSteps({ changed }: RunResult, dryRun: boolean) {
  if (changed.length === 0) {
    return [];
  }

  const install = dryRun
    ? `Nothing was written. Run without --dry-run to apply, then install at least ${ROOT_PACKAGE_NAME}@${MIN_RUNTIME_VERSION}.`
    : `Imports now resolve from ${ROOT_PACKAGE_NAME}. Install at least ${ROOT_PACKAGE_NAME}@${MIN_RUNTIME_VERSION} and reinstall so the lockfile catches up.`;
  const rewroteSource = !dryRun && changed.some(file => file.kind === 'source');
  const lintHint = rewroteSource
    ? [
        `Then run your formatter or linter fix on the changed files: import-order rules place ${ROOT_PACKAGE_NAME} differently from ${MOBILE_PACKAGE_NAME}.`,
      ]
    : [];

  return ['', install, ...lintHint];
}

export function formatHuman(result: RunResult, dryRun: boolean): string {
  const { failed, manual } = result;

  const failures =
    failed.length === 0
      ? []
      : ['', 'Could not be processed:', ...failed.map(failure => `  ${failure.file}: ${failure.reason}`)];
  const followUps =
    manual.length === 0
      ? []
      : [
          '',
          'Needs a manual follow-up:',
          ...manual.map(note => `  ${note.file}${note.line === undefined ? '' : `:${note.line}`} — ${note.reason}`),
        ];

  return [...summarize(result, dryRun), ...failures, ...followUps, ...nextSteps(result, dryRun)].join('\n');
}

export function formatJson(result: RunResult, dryRun: boolean): string {
  return JSON.stringify({ transform: TRANSFORM_NAME, dryRun, ...result }, null, 2);
}
