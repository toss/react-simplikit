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
    return debounce(preservedCallback, wait, edges);
  }, [preservedCallback, wait, edges]);

  useEffect(() => {
    return () => {
      debounced.cancel();
    };
  }, [debounced]);

  return debounced;
}
