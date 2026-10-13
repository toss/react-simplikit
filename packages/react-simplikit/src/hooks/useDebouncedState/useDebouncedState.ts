import { Dispatch, SetStateAction, useRef, useState } from 'react';

import { useDebounce } from '../useDebounce/index.ts';

type DebounceOptions = {
  leading?: boolean;
  trailing?: boolean;
};

/**
 * @description
 * `useDebouncedState` is a React hook that manages state and returns a debounced setter.
 * With the default options, the state updates `debounceMs` milliseconds after the last setter call.
 * It is useful for applying only the last value from a series of rapid update requests, such as search input.
 *
 * The initial value is returned as is on the first render and on the server. No update is scheduled
 * on mount, so with `leading: true` the first setter call after mount is applied immediately.
 * If both `leading` and `trailing` are `false`, the state never updates.
 *
 * Pending updates are cancelled when the component unmounts or when `debounceMs`, `leading`, or
 * `trailing` changes.
 *
 * @template T - The type of the state value.
 * @param {T} initialValue - The initial state value, used only on the first render.
 * @param {number} debounceMs - The number of milliseconds to wait after the last setter call before updating.
 * @param {DebounceOptions} [options] - Configuration options for debounce behavior.
 * @param {boolean} [options.leading=false] - If `true`, the first setter call after an idle period is applied immediately.
 * @param {boolean} [options.trailing=true] - If `true`, the last value is applied after `debounceMs` milliseconds.
 *
 * @returns {[state: T, setState: Dispatch<SetStateAction<T>>]} A tuple:
 * - state `T` - The current state value;
 * - setState `Dispatch<SetStateAction<T>>` - A debounced setter that accepts the next state value or an updater function;
 *
 * @example
 * import { useDebouncedState } from 'react-simplikit';
 *
 * function SearchInput() {
 *   const [query, setQuery] = useDebouncedState('', 300);
 *
 *   return (
 *     <>
 *       <label>
 *         Search
 *         <input onChange={event => setQuery(event.target.value)} />
 *       </label>
 *       <output aria-live="polite">{query}</output>
 *     </>
 *   );
 * }
 */
export function useDebouncedState<T>(
  initialValue: T,
  debounceMs: number,
  { leading = false, trailing = true }: DebounceOptions = {}
): [T, Dispatch<SetStateAction<T>>] {
  const [debouncedValue, setDebouncedValue] = useState(() => initialValue);
  const lastForwardedRef = useRef(initialValue);

  function forwardChangedValue(value: SetStateAction<T>) {
    if (typeof value === 'function') {
      setDebouncedValue(value);
      return;
    }

    const unchanged = Object.is(lastForwardedRef.current, value);
    const settled = Object.is(value, debouncedValue);
    if (unchanged && settled) {
      return;
    }

    lastForwardedRef.current = value;
    setDebouncedValue(() => value);
  }

  const debounced = useDebounce((next: SetStateAction<T>) => forwardChangedValue(next), debounceMs, {
    leading,
    trailing,
  });

  return [debouncedValue, debounced];
}
