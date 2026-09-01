import { MIN_RUNTIME_VERSION, MOBILE_PACKAGE_NAME, ROOT_PACKAGE_NAME } from './constants.ts';
import type { FileResult, RunResult } from './types.ts';

function describeFile(file: FileResult): string {
  if (file.dependencies.length > 0) {
    return file.dependencies
      .map(change => {
        const added = change.added === undefined ? '' : ` +${ROOT_PACKAGE_NAME}@${change.added}`;

        return `${change.field}: -${change.removed}${added}`;
      })
      .join(', ');
  }

  return file.changes.map(change => `${change.kind}:${change.line}`).join(', ');
}

export function formatHuman(result: RunResult, dryRun: boolean): string {
  const { changed, failed, manual, scanned } = result;

  const lines =
    changed.length === 0
      ? [`Scanned ${scanned} files. No file imports ${MOBILE_PACKAGE_NAME}.`]
      : [
          `${dryRun ? 'Would change' : 'Changed'} ${changed.length} of ${scanned} files:`,
          ...changed.map(file => `  ${file.file} (${describeFile(file)})`),
        ];

  if (failed.length > 0) {
    lines.push('', 'Could not be processed:', ...failed.map(failure => `  ${failure.file}: ${failure.reason}`));
  }

  if (manual.length > 0) {
    lines.push(
      '',
      'Needs a manual follow-up:',
      ...manual.map(note => `  ${note.file}${note.line === undefined ? '' : `:${note.line}`} — ${note.reason}`)
    );
  }

  if (changed.length > 0) {
    lines.push(
      '',
      dryRun
        ? `Nothing was written. Run without --dry-run to apply, then install at least ${ROOT_PACKAGE_NAME}@${MIN_RUNTIME_VERSION}.`
        : `Imports now resolve from ${ROOT_PACKAGE_NAME}. Install at least ${ROOT_PACKAGE_NAME}@${MIN_RUNTIME_VERSION} and reinstall so the lockfile catches up.`
    );
  }

  return lines.join('\n');
}
