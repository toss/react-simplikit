import { useEffect, useRef, useState } from 'react';

import { useDebounce } from '../useDebounce/index.ts';

type DebounceOptions = {
  leading?: boolean;
  trailing?: boolean;
};

/**
 * @description
 * `useDebouncedValue` is a React hook that returns a debounced copy of the given value.
 * The caller keeps owning the state; the hook only delays how quickly the returned value follows it.
 * The returned value updates `wait` milliseconds after the last change, which is useful for
 * deriving a search query or a validation input from fast-changing state.
 *
 * On the first render and on the server the value is returned as is. A change is never scheduled
 * on mount, so with `leading: true` the first change after mount is applied immediately.
 * If both `leading` and `trailing` are `false`, the returned value never updates.
 *
 * The value is compared by reference. Passing a new object or array on every render keeps
 * the returned value updating every `wait` milliseconds; stabilize the reference first, for
 * example with `usePreservedReference`.
 *
 * @template T - The type of the value.
 * @param {T} value - The value to debounce.
 * @param {number} wait - The number of milliseconds to wait after the last change before updating.
 * @param {DebounceOptions} [options] - Configuration options for debounce behavior.
 * @param {boolean} [options.leading=false] - If `true`, the first change after an idle period is applied immediately.
 * @param {boolean} [options.trailing=true] - If `true`, the last change is applied after `wait` milliseconds.
 *
 * @returns {T} The debounced value.
 *
 * @example
 * import { useDebouncedValue } from 'react-simplikit';
 * import { useState } from 'react';
 *
 * function SearchInput() {
 *   const [query, setQuery] = useState('');
 *   const debouncedQuery = useDebouncedValue(query, 300);
 *
 *   return (
 *     <>
 *       <input value={query} onChange={e => setQuery(e.target.value)} />
 *       <SearchResults query={debouncedQuery} />
 *     </>
 *   );
 * }
 */
export function useDebouncedValue<T>(
  value: T,
  wait: number,
  { leading = false, trailing = true }: DebounceOptions = {}
): T {
  const [debouncedValue, setDebouncedValue] = useState(() => value);
  const debounced = useDebounce((next: T) => setDebouncedValue(() => next), wait, { leading, trailing });
  const lastForwardedRef = useRef(value);

  useEffect(
    function forwardChangedValue() {
      const unchanged = Object.is(lastForwardedRef.current, value);
      const settled = Object.is(value, debouncedValue);
      if (unchanged && settled) {
        return;
      }

      lastForwardedRef.current = value;
      debounced(value);
    },
    [value, debouncedValue, debounced]
  );

  return debouncedValue;
}
