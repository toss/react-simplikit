export class UsageError extends Error {}

export function describeError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function describeFailure(error: unknown): string {
  if (error instanceof SyntaxError) {
    return 'The file is not valid JSON. Fix it by hand, then run the codemod again.';
  }

  if (error instanceof Error && 'code' in error && error.code === 'EACCES') {
    return 'No write permission for this file. Grant it, or exclude the path with --ignore.';
  }

  return describeError(error);
}
