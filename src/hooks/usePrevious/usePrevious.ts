import { useEffect, useRef } from 'react';

const strictEquals = <T>(prev: T | undefined, next: T) => prev === next;

/**
 * @description
 * Returns the previous value of the input state.  
 * If a re-render occurs but the state value does not change, the previous value remains unchanged.  
 * If the state is an object or requires custom change detection, a `compare` function can be provided.  
 * By default, state changes are detected using `prev === next`.
 *
 * @template T - The type of the state.
 * @param {T} state - The state whose previous value is to be tracked.
 * @param {(prev: T | undefined, next: T) => boolean} [compare] - An optional comparison function to determine if the state has changed.
 *
 * @returns {T | undefined} The previous value of the state.
 *
 * @example
 * const [count, setCount] = useState(0);
 * // initial value of previousCount is `0`
 * const previousCount = usePrevious(count);
 */
export function usePrevious<T>(state: T, compare: (prev: T, next: T) => boolean = strictEquals): T {
  const prevRef = useRef<T>(state);
  const currentRef = useRef<T>(state);
  const isFirstRender = useRef<boolean>(true);

  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  if (isFirstRender.current || compare(currentRef.current, state)) {
    return prevRef.current;
  }

  prevRef.current = currentRef.current;
  currentRef.current = state;

  return prevRef.current;
}
