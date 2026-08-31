import { TRANSFORM_NAME } from '../constants.ts';
import type { RunResult } from '../types.ts';

export function formatJson(result: RunResult, dryRun: boolean): string {
  return JSON.stringify({ transform: TRANSFORM_NAME, dryRun, ...result }, null, 2);
}
