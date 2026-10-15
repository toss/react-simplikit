/* eslint-disable @typescript-eslint/no-explicit-any */
// Simplified version of https://github.com/toss/es-toolkit/blob/main/src/function/throttle.ts

import { debounce } from '../useDebounce/debounce.ts';

type ThrottleOptions = {
  /**
   * An optional array specifying whether the function should be invoked on the leading edge, trailing edge, or both.
   * If `edges` includes "leading", the function will be invoked at the start of the delay period.
   * If `edges` includes "trailing", the function will be invoked at the end of the delay period.
   * If both "leading" and "trailing" are included, the function will be invoked at both the start and end of the delay period.
   * @default ["leading", "trailing"]
   */
  edges?: Array<'leading' | 'trailing'>;
};

type ThrottledFunction<F extends (...args: any[]) => void> = {
  (...args: Parameters<F>): void;
  cancel: () => void;
};

export function throttle<F extends (...args: any[]) => void>(
  func: F,
  throttleMs: number,
  { edges = ['leading', 'trailing'] }: ThrottleOptions = {}
): ThrottledFunction<F> {
  const leading = edges.includes('leading');
  const trailing = edges.includes('trailing');

  let pendingAt: number | null = null;
  // `true` while a call is waiting on the debounce timer. A trailing-only throttle uses it to tell a
  // continuous stream of calls (invoke at the window boundary) from a call after an idle period
  // (open a fresh window and invoke at its end). es-toolkit invokes at the boundary in both cases,
  // which makes a trailing-only throttle fire on the leading edge after it has been idle.
  let isPending = false;

  const debounced = debounce(
    function (this: ThisParameterType<F>, ...args: Parameters<F>) {
      pendingAt = Date.now();
      isPending = false;
      func.apply(this, args);
    },
    throttleMs,
    { edges }
  );

  const throttled = function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    if (pendingAt === null) {
      pendingAt = Date.now();
    }

    const windowElapsed = Date.now() - pendingAt >= throttleMs;

    if (windowElapsed && (leading || (trailing && isPending))) {
      pendingAt = Date.now();
      isPending = false;
      func.apply(this, args);

      // Re-arm the timer without arguments so the next call in this window does not count as a
      // leading call for the debounce.
      debounced.cancel();
      debounced.schedule();
      return;
    }

    if (windowElapsed) {
      pendingAt = Date.now();
    }

    isPending = true;
    debounced.apply(this, args);
  };

  throttled.cancel = () => {
    isPending = false;
    debounced.cancel();
  };

  return throttled;
}
