import { MIN_RUNTIME_VERSION, MOBILE_PACKAGE_NAME, ROOT_PACKAGE_NAME } from '../constants.ts';
import type { FileResult, RunResult } from '../types.ts';

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
  if (result.changed.length === 0) {
    return `Scanned ${result.scanned} files. No file imports ${MOBILE_PACKAGE_NAME}. Nothing to change.`;
  }

  // Naming each file is the point: the user's next step is reading the diff.
  const lines = [`${dryRun ? 'Would change' : 'Changed'} ${result.changed.length} of ${result.scanned} files:`];

  for (const file of result.changed) {
    lines.push(`  ${file.file} (${describeFile(file)})`);
  }

  if (result.manual.length > 0) {
    lines.push('', 'Needs a manual follow-up:');

    for (const note of result.manual) {
      lines.push(`  ${note.file}: ${note.reason}`);
    }
  }

  // A dry run wrote nothing, so it must not describe the tree as already migrated.
  lines.push(
    '',
    dryRun
      ? `Nothing was written. Run without --dry-run to apply, then install at least ${ROOT_PACKAGE_NAME}@${MIN_RUNTIME_VERSION}.`
      : `Imports now resolve from ${ROOT_PACKAGE_NAME}. Install at least ${ROOT_PACKAGE_NAME}@${MIN_RUNTIME_VERSION} and reinstall so the lockfile catches up.`
  );

  return lines.join('\n');
}
