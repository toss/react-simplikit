/* eslint-disable @typescript-eslint/no-explicit-any */
// Simplified version of https://github.com/toss/es-toolkit/blob/main/src/function/debounce.ts

export type DebouncedFunction<F extends (...args: any[]) => void> = {
  (...args: Parameters<F>): void;
  cancel: () => void;
};

export function debounce<F extends (...args: any[]) => void>(
  func: F,
  debounceMs: number,
  edges?: Array<'leading' | 'trailing'>
): DebouncedFunction<F> {
  let pendingThis: any = undefined;
  let pendingArgs: Parameters<F> | null = null;

  const leading = edges != null && edges.includes('leading');
  const trailing = edges == null || edges.includes('trailing');

  const invoke = () => {
    if (pendingArgs !== null) {
      func.apply(pendingThis, pendingArgs);
      pendingThis = undefined;
      pendingArgs = null;
    }
  };

  const onTimerEnd = () => {
    if (trailing) {
      invoke();
    }

    cancel();
  };

  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const schedule = () => {
    if (timeoutId != null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      timeoutId = null;

      onTimerEnd();
    }, debounceMs);
  };

  const cancelTimer = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  const cancel = () => {
    cancelTimer();
    pendingThis = undefined;
    pendingArgs = null;
  };

  const debounced = function (this: any, ...args: Parameters<F>) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    pendingThis = this;
    pendingArgs = args;

    const isFirstCall = timeoutId == null;

    schedule();

    if (leading && isFirstCall) {
      invoke();
    }
  };

  debounced.cancel = cancel;

  return debounced;
}
