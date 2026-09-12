/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { useMemo } from 'react';

import { usePreservedCallback } from '../usePreservedCallback/index.ts';

import { debounce, DebouncedFunction } from './debounce.ts';

type DebounceOptions = {
  leading?: boolean;
  trailing?: boolean;
};

/**
 * @description
 * `useDebounce` is a React hook that returns a debounced version of the provided callback function.
 * It helps optimize event handling by delaying function execution and grouping multiple calls into one.
 *
 * With the default options, the last call runs after `wait` milliseconds without another call.
 * Pending calls are cancelled on unmount or when the debounce instance changes.
 * Calling `.cancel()` only cancels a pending callback, not an already-started network request.
 * The example displays the submitted query locally; replace `setSubmittedQuery` with your
 * application's search callback when connecting a server.
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
 * import { useState } from 'react';
 * import { useDebounce } from 'react-simplikit';
 *
 * export function SearchInput() {
 *   const [query, setQuery] = useState('');
 *   const [submittedQuery, setSubmittedQuery] = useState('');
 *   const debouncedSearch = useDebounce(setSubmittedQuery, 300);
 *
 *   return (
 *     <section>
 *       <label>
 *         Search
 *         <input
 *           value={query}
 *           onChange={event => {
 *             setQuery(event.target.value);
 *             debouncedSearch(event.target.value);
 *           }}
 *         />
 *       </label>
 *       <output aria-live="polite">{submittedQuery}</output>
 *       <button type="button" onClick={() => debouncedSearch.cancel()}>
 *         Cancel pending update
 *       </button>
 *     </section>
 *   );
 * }
 */
export function useDebounce<F extends (...args: any[]) => unknown>(
  callback: F,
  wait: number,
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
    return debounce<F>(preservedCallback, wait, { edges });
  }, [preservedCallback, wait, edges]);

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
