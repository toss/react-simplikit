import { useEffect } from 'react';

import { usePreservedCallback } from './usePreservedCallback.ts';

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
  const preservedCallback = usePreservedCallback(callback);

  useEffect(() => {
    const timeoutId = window.setTimeout(preservedCallback, delay);

    return () => window.clearTimeout(timeoutId);
  }, [delay, preservedCallback]);
}
