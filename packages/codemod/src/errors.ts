/** A bad invocation. The CLI exits 2 on this and 1 on anything else thrown. */
export class UsageError extends Error {}

/** A message for anything thrown, including the non-`Error` values a library may reject with. */
export function describeError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
