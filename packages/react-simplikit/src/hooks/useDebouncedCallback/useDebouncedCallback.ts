import type { CallerTypedArgs } from '../../_internal/types.ts';
import { useDebounce } from '../_internal/useDebounce/useDebounce.ts';

type UseDebouncedCallbackOptions<F extends (...args: CallerTypedArgs) => unknown> = {
  callback: F;
  debounceMs: number;
  leading?: boolean;
  trailing?: boolean;
};

/**
 * @description
 * `useDebouncedCallback` is a React hook that returns a debounced version of the provided callback function.
 * It helps optimize event handling by delaying function execution and grouping multiple calls into one.
 * The debounced function takes the same arguments as `callback` and forwards the ones from the last call.
 *
 * Note that if both 'leading' and 'trailing' are set, the function will be called at both the start and end of the delay period. However, it must be called at least twice within debounceMs interval for this to happen, since one debounced function call cannot trigger the function twice.
 *
 * Pending calls are cancelled when the component unmounts or when `debounceMs`, `leading`, or `trailing` changes.
 * Calling `.cancel()` only cancels a pending call; it does not stop work that `callback` has already started.
 * The next call after `.cancel()` starts a new sequence, so it runs immediately when `leading` is `true`.
 *
 * @template {(...args: any[]) => unknown} F - The type of the callback function.
 * @param {Object} options - The options object.
 * @param {F} options.callback - The function to debounce.
 * @param {number} options.debounceMs - The number of milliseconds to delay the function execution.
 * @param {boolean} [options.leading=false] - If `true`, the function is called at the start of the sequence.
 * @param {boolean} [options.trailing=true] - If `true`, the function is called at the end of the sequence.
 *
 * @returns {((...args: Parameters<F>) => void) & { cancel: () => void }} A debounced function that takes the same arguments as `callback`.
 *   It also includes a `cancel` method to cancel any pending debounced execution.
 *
 * @example
 * import { useDebouncedCallback } from 'react-simplikit';
 * import { useState } from 'react';
 *
 * function SearchInput() {
 *   const [query, setQuery] = useState('');
 *   const setQueryDebounced = useDebouncedCallback({ callback: setQuery, debounceMs: 300 });
 *
 *   return (
 *     <>
 *       <input onChange={e => setQueryDebounced(e.target.value)} />
 *       <button type="button" onClick={() => setQueryDebounced.cancel()}>
 *         Cancel pending update
 *       </button>
 *       <p>Searching for: {query}</p>
 *     </>
 *   );
 * }
 */
export function useDebouncedCallback<F extends (...args: CallerTypedArgs) => unknown>({
  callback,
  debounceMs,
  leading = false,
  trailing = true,
}: UseDebouncedCallbackOptions<F>): {
  (...args: Parameters<F>): void;
  cancel: () => void;
} {
  return useDebounce(callback, debounceMs, { leading, trailing });
}
