/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { useMemo } from 'react';

import { usePreservedCallback } from '../usePreservedCallback/index.ts';

import { debounce } from './debounce.ts';

type DebounceOptions = {
  leading?: boolean;
  trailing?: boolean;
};

/**
 * @description
 * `useDebounce` is a React hook that returns a debounced version of the provided callback function.
 * It helps optimize event handling by delaying function execution and grouping multiple calls into one.
 *
 * @template {(...args: any[]) => unknown} F - The type of the callback function.
 * @param {F} callback - The function to debounce.
 * @param {number} wait - The number of milliseconds to delay the function execution.
 * @param {DebounceOptions} [options] - Configuration options for debounce behavior.
 * @param {boolean} [options.leading=false] - If `true`, the function is called at the start of the sequence.
 * @param {boolean} [options.trailing=true] - If `true`, the function is called at the end of the sequence.
 *
 * @returns {F & { cancel: () => void }} A debounced function that delays invoking the callback.
 *   It also includes a `cancel` method to cancel any pending debounced execution.
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
export function useDebounce<F extends (...args: any[]) => unknown>(
  callback: F,
  wait: number,
  options: DebounceOptions = {}
) {
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
    return debounce<F>(preservedCallback, wait, { edges });
  }, [preservedCallback, wait, edges]);

  useEffect(() => {
    return () => {
      debounced.cancel();
    };
  }, [debounced]);

  return debounced;
}
