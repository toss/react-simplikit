/* eslint-disable react-hooks/refs -- Tracking "the value from the previous render" requires
   comparing and updating refs during render; that is the hook's entire contract, not an
   oversight. Scoped to the file because every ref access in it is part of that contract.
   The matching `'use no memo'` directive below keeps React Compiler off this hook, but does
   not silence this rule. Narrow this to line-level suppressions if anything that is not part
   of the previous-value contract is ever added to this file. */
import { useRef } from 'react';

const strictEquals = <T>(prev: T, next: T) => prev === next;

/**
 * @description
 * `usePrevious` is a React hook that returns the previous value of the input state.
 * It preserves the previous value unchanged when re-renders occur without state changes.
 * If the state is an object or requires custom change detection, a `compare` function can be provided.
 * By default, state changes are detected using `prev === next`.
 *
 * @template T - The type of the state.
 * @param {T} state - The state whose previous value is to be tracked.
 * @param {(prev: T, next: T) => boolean} [compare] - An optional comparison function to determine if the state has changed.
 *
 * @returns {T} The previous value of the state.
 *
 * @example
 * const [count, setCount] = useState(0);
 * // initial value of previousCount is `0`
 * const previousCount = usePrevious(count);
 */
export function usePrevious<T>(state: T, compare: (prev: T, next: T) => boolean = strictEquals): T {
  // Without `'use no memo'`, React Compiler throws when `panicThreshold` is not `'none'`
  // because this hook intentionally reads and updates refs during render.
  'use no memo';

  const prevRef = useRef<T>(state);
  const currentRef = useRef<T>(state);
  const isFirstRender = useRef<boolean>(true);

  if (isFirstRender.current) {
    isFirstRender.current = false;
    return prevRef.current;
  }

  if (!compare(currentRef.current, state)) {
    prevRef.current = currentRef.current;
    currentRef.current = state;
  }

  return prevRef.current;
}
