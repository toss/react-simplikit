import { useRef } from 'react';

import { useDebounce } from '../useDebounce/index.ts';

type DebounceOptions = {
  leading?: boolean;
  trailing?: boolean;
};

/**
 * Marks that no value has been forwarded to `onChange` yet.
 *
 * The hook skips redundant invocations by comparing against the last forwarded value, but it
 * receives no initial value from the caller. Seeding that comparison with a real value would treat
 * the first call of that value as redundant and swallow it, so an unreachable sentinel is used instead.
 */
const NOT_INVOKED = Symbol('NOT_INVOKED');

/**
 * @description
 * `useDebouncedCallback` is a React hook that returns a debounced version of the provided callback function.
 * It helps optimize event handling by delaying function execution and grouping multiple calls into one.
 *
 * Note that if both 'leading' and 'trailing' are set, the function will be called at both the start and end of the delay period. However, it must be called at least twice within debounceMs interval for this to happen, since one debounced function call cannot trigger the function twice.
 *
 * @template T - The type of the value passed to `onChange`.
 * @param {Object} options - The options object.
 * @param {(newValue: T) => void} options.onChange - The callback to debounce. A call with the same value as the last forwarded one is skipped.
 * @param {number} options.timeThreshold - The number of milliseconds to delay the function execution.
 * @param {boolean} [options.leading=false] - If `true`, the function is called at the start of the sequence.
 * @param {boolean} [options.trailing=true] - If `true`, the function is called at the end of the sequence.
 *
 * @returns {(nextValue: T) => void} A debounced function that forwards the value to `onChange`.
 *
 * @example
 * import { useDebouncedCallback } from 'react-simplikit';
 * import { useState } from 'react';
 *
 * function SearchInput() {
 *   const [query, setQuery] = useState('');
 *   const setQueryDebounced = useDebouncedCallback({ onChange: setQuery, timeThreshold: 300 });
 *
 *   return (
 *     <>
 *       <input onChange={e => setQueryDebounced(e.target.value)} />
 *       <p>Searching for: {query}</p>
 *     </>
 *   );
 * }
 */
export function useDebouncedCallback<T>({
  onChange,
  timeThreshold,
  leading = false,
  trailing = true,
}: DebounceOptions & {
  onChange: (newValue: T) => void;
  timeThreshold: number;
}): (nextValue: T) => void {
  const lastForwardedRef = useRef<T | typeof NOT_INVOKED>(NOT_INVOKED);

  return useDebounce(
    (nextValue: T) => {
      if (nextValue === lastForwardedRef.current) {
        return;
      }

      onChange(nextValue);

      lastForwardedRef.current = nextValue;
    },
    timeThreshold,
    { leading, trailing }
  );
}
