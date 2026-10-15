/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo } from 'react';

import { usePreservedCallback } from '../../usePreservedCallback/usePreservedCallback.ts';

import { throttle } from './throttle.ts';

type ThrottleOptions = {
  leading?: boolean;
  trailing?: boolean;
};

/**
 * An internal React hook shared by throttle-related hooks.
 * It throttles the provided callback and manages execution timing and cancellation of pending calls.
 *
 * It limits how frequently consecutive calls execute based on the `throttleMs` interval.
 * Pending calls are cancelled when the component unmounts or when `throttleMs`, `leading`,
 * or `trailing` changes.
 *
 * `.cancel()` only cancels a pending callback; it does not stop work that has already started.
 */
export function useThrottle<F extends (...args: any[]) => any>(
  callback: F,
  throttleMs: number,
  { leading = true, trailing = true }: ThrottleOptions = {}
) {
  const preservedCallback = usePreservedCallback(callback);

  const edges = useMemo(() => {
    const _edges: Array<'leading' | 'trailing'> = [];
    if (leading) {
      _edges.push('leading');
    }

    if (trailing) {
      _edges.push('trailing');
    }

    return _edges;
  }, [leading, trailing]);

  const throttledCallback = useMemo(
    () => throttle(preservedCallback, throttleMs, { edges }),
    [preservedCallback, throttleMs, edges]
  );

  useEffect(() => {
    return () => {
      throttledCallback.cancel();
    };
  }, [throttledCallback]);

  return throttledCallback;
}
