import { useRef } from 'react';

const strictEquals = <T>(prev: T | undefined, next: T) => prev === next;

/**
 * @description
 * `usePrevious` is a React hook that returns the previous value of the input state.
 * It preserves the previous value unchanged when re-render occur without state changes.
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
