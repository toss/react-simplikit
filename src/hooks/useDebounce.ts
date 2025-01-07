import { useEffect } from 'react';
import { useMemo } from 'react';

import { debounce } from '../_internal/debounce.ts';

import { usePreservedCallback } from './usePreservedCallback.ts';

interface DebounceOptions {
  leading?: boolean;
  trailing?: boolean;
}

/**
 * `useDebounce` is a hook that returns a debounced version of the provided callback function
 *
 * @param callback Function to debounce
 * @param wait Time in milliseconds to delay
 * @param options Configuration options for debounce behavior
 * @returns Debounced function that will delay invoking the callback
 *
 * @example
 * function SearchInput() {
 *   const [query, setQuery] = useState('');
 *
 *   const debouncedSearch = useDebounce((value: string) => {
 *     // Actual API call
 *     searchAPI(value);
 *   }, 300);
 *
 *   return (
 *     <input
 *       value={query}
 *       onChange={e => {
 *         setQuery(e.target.value);
 *         debouncedSearch(e.target.value);
 *       }}
 *       placeholder="Enter search term"
 *     />
 *   );
 * }
 */
export function useDebounce<F extends (...args: unknown[]) => unknown>(
  callback: F,
  wait: number,
  options: DebounceOptions = {}
) {
  // TODO: Replace with usePreservedCallback for proper callback memoization
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
