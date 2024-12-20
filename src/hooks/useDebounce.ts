import { useEffect } from 'react';
import { useMemo } from 'react';

import { debounce } from '../_internal/debounce.ts';

interface DebounceOptions {
  leading?: boolean;
  trailing?: boolean;
}

export function useDebounce<F extends (...args: unknown[]) => unknown>(
  callback: F,
  wait: number,
  options: DebounceOptions = {}
) {
  // TODO: const preservedCallback = usePreservedCallback(callback);
  const preservedCallback = callback;

  const { leading, trailing = true } = options;

  const edges = useMemo(() => {
    const edges: Array<'leading' | 'trailing'> = [];
    if (leading) {
      edges.push('leading');
    }

    if (trailing) {
      edges.push('trailing');
    }

    return edges;
  }, [leading, trailing]);

  const debounced = useMemo(() => {
    return debounce(preservedCallback, wait, edges);
  }, [preservedCallback, wait, edges]);

  useEffect(() => {
    return () => {
      debounced.cancel();
    };
  }, [debounced]);

  return debounced;
}
