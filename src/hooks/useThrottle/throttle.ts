/* eslint-disable @typescript-eslint/no-explicit-any */
// Simplified version of https://github.com/toss/es-toolkit/blob/main/src/function/throttle.ts

import { debounce } from '../useDebounce/debounce.ts';

type ThrottleOptions = {
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
  let pendingAt: number | null = null;

  const debounced = debounce(func, throttleMs, { edges });

  const throttled = function (...args: Parameters<F>) {
    if (pendingAt == null) {
      pendingAt = Date.now();
    } else {
      if (Date.now() - pendingAt >= throttleMs) {
        pendingAt = Date.now();
        debounced.cancel();
        debounced(...args);
      }
    }

    debounced(...args);
  };

  throttled.cancel = debounced.cancel;

  return throttled;
}
