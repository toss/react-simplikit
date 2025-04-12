/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef } from 'react';
/**
 * @description
 * `usePreservedCallback` is a React hook that maintains a stable reference to a callback function
 * while ensuring it always has access to the latest state or props. This prevents unnecessary re-renders
 * and simplifies dependency management when passing callbacks to child components or handling event listeners.
 *
 * @param {(...args: any[]) => any} callback - The function to preserve.
 *   It always references the latest state or props, even when the component re-renders.
 *
 * @returns {(...args: any[]) => any} A function with the same signature as the input callback.
 *   The returned function maintains a stable reference while accessing the latest state or props.
 *
 * @example
 * import { usePreservedCallback } from 'react-simplikit';
 * import { useState } from 'react';
 *
 * function Counter() {
 *   const [count, setCount] = useState(0);
 *
 *   const handleClick = usePreservedCallback(() => {
 *     console.log(`Current count: ${count}`);
 *     setCount(prev => prev + 1);
 *   });
 *
 *   return <button onClick={handleClick}>Click me</button>;
 * }
 */
export function usePreservedCallback<Arguments extends any[] = any[], ReturnValue = unknown>(
  callback: (...args: Arguments) => ReturnValue
) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback((...args: Arguments) => {
    return callbackRef.current(...args);
  }, []);
}
