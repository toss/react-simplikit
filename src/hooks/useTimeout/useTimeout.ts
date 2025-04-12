import { useEffect } from 'react';

import { usePreservedCallback } from '../usePreservedCallback/index.ts';

/**
 * @description
 * `useTimeout` is a React hook that executes a callback function after a specified delay.
 * It manages `window.setTimeout` in accordance with the React lifecycle, ensuring cleanup on unmount or when dependencies change.
 *
 * @param {() => void} callback - The function to be executed after the delay.
 * @param {number} [delay=0] - The time in milliseconds to wait before executing the callback.
 *
 * @example
 * // Updating a title after a delay
 * import { useTimeout } from 'react-simplikit';
 * import { useState } from 'react';
 *
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
 */

export function useTimeout(callback: () => void, delay = 0) {
  const preservedCallback = usePreservedCallback(callback);

  useEffect(() => {
    const timeoutId = window.setTimeout(preservedCallback, delay);
    return () => window.clearTimeout(timeoutId);
  }, [delay, preservedCallback]);
}
