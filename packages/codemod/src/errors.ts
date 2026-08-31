// Exit codes are a public interface: 2 means the invocation was wrong, 1 means the
// invocation was fine but the work failed. The CLI entrypoint reads `exitCode`.
export class UsageError extends Error {
  readonly exitCode = 2;

  constructor(message: string) {
    super(message);
    this.name = 'UsageError';
  }
}

export class ExecutionError extends Error {
  readonly exitCode = 1;

  constructor(message: string) {
    super(message);
    this.name = 'ExecutionError';
  }
}

/** A message for anything thrown, including the non-`Error` values a library may reject with. */
export function describeError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
