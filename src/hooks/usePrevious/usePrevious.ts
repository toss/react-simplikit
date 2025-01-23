import { useEffect, useRef } from 'react';

const strictEquals = <T>(prev: T | undefined, next: T) => prev === next;

/**
 * @description
 * Returns the previous value of the input state.
 * If re-rendering occured but value of state is not changed, the previous value will not be updated.
 * If the state is of object type or if a customized logic is needed to detect changes in value, pass `compare` function to second parameter.
 * If no compare function is provided, the default comparison `prev === next` will be used.
 *
 * @template T - The type of state.
 * @param {T} state - The state to get previous value.
 * @param {(prev: T, next: T) => boolean} compare - The comparison function to detect that state has been changed
 * 
 * @returns previous value of the state
 * 
 * @example
 * const [count, setCount] = useState(0);
 *
 * // initial value of previousCount is `0`
 * const previousCount = usePrevious(count);
 *
 * setUnrelated(prev => prev + 1); // previous: 0
 *
 * setCount(prev => prev + 1); // count: 2, previous: 1
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
