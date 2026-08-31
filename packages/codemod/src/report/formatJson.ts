import { TRANSFORM_NAME } from '../constants.ts';
import type { FileResult, ManualNote, RunResult } from '../types.ts';

// Field names and meanings here are a public interface. Renaming one is an
// automation-facing breaking change, not a refactor.
export type JsonReport = {
  transform: string;
  dryRun: boolean;
  scanned: number;
  changed: FileResult[];
  manual: ManualNote[];
};

export function formatJson(result: RunResult, dryRun: boolean): string {
  const report: JsonReport = {
    transform: TRANSFORM_NAME,
    dryRun,
    scanned: result.scanned,
    changed: result.changed,
    manual: result.manual,
  };

  return JSON.stringify(report, null, 2);
}
