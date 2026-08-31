import { TRANSFORM_NAME } from '../constants.ts';
import type { RunResult } from '../types.ts';

// `scanned`, `changed` and `manual` come straight off the run. These field names are a
// public interface: renaming one is an automation-facing breaking change.
export function formatJson(result: RunResult, dryRun: boolean): string {
  return JSON.stringify({ transform: TRANSFORM_NAME, dryRun, ...result }, null, 2);
}
