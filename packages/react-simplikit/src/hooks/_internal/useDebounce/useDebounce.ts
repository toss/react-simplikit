/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { useMemo } from 'react';

import { usePreservedCallback } from '../../usePreservedCallback/usePreservedCallback.ts';

import { debounce, DebouncedFunction } from './debounce.ts';

type DebounceOptions = {
  leading?: boolean;
  trailing?: boolean;
};

/**
 * An internal React hook shared by debounce-related hooks.
 * It debounces the provided callback and manages execution timing and cancellation of pending calls.
 *
 * With the default options, the last call runs after `debounceMs` milliseconds without another call.
 * Pending calls are cancelled when the component unmounts or when `debounceMs`, `leading`,
 * or `trailing` changes.
 *
 * `.cancel()` only cancels a pending callback; it does not stop work that has already started.
 */
export function useDebounce<F extends (...args: any[]) => unknown>(
  callback: F,
  debounceMs: number,
  options: DebounceOptions = {}
): DebouncedFunction<F> {
  const preservedCallback = usePreservedCallback(callback) as F;

  const { leading = false, trailing = true } = options;

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

  const debounced = useMemo(() => {
    return debounce<F>(preservedCallback, debounceMs, { edges });
  }, [preservedCallback, debounceMs, edges]);

  useEffect(
    function cancelDebouncedOnUnmount() {
      return () => {
        debounced.cancel();
      };
    },
    [debounced]
  );

  return debounced;
}
