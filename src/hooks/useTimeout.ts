import { useCallback, useEffect, useRef } from 'react';

/**
 *
 *
 *
 * @description
 * A convenient hook for using window.setTimeout.
 *
 * `useTimeout` executes a callback function after a specified delay.
 * Please refer to the example below for the correct usage of `useTimeout`.
 *
 * @example
 * function Example() {
 *   const [title, setTitle] = useState('');
 *
 *   useTimeout(() => {
 *     setTitle('Searching for products...');
 *   }, 2000);
 *
 *   useTimeout(() => {
 *     setTitle('Almost done...');
 *   }, 4000);
 *
 *   return <div>{title}</div>;
 * }
 *
 */

export function useTimeout(callback: () => void, delay = 0) {
  const savedCallback = usePreservedCallback(callback);

  useEffect(() => {
    const timeoutId = window.setTimeout(savedCallback, delay);

    return () => window.clearTimeout(timeoutId);
  }, [delay, savedCallback]);
}

// temporary implementation
function usePreservedCallback<Callback extends (...args: any[]) => any>(callback: Callback) {
  const callbackRef = useRef<Callback>(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback((...args: any[]) => {
    return callbackRef.current(...args);
  }, []) as Callback;
}
