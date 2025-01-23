import { useCallback, useEffect, useRef } from 'react';

/**
 * @description
 * A React hook that preserves the reference of a callback function while ensuring it always
 * uses the latest state or props. This helps prevent unnecessary re-renders and simplifies
 * dependency management when stable callback references are needed.
 *
 * @param callback - The callback function to preserve. It always references
 * the latest state or props, even when the component re-renders.
 *
 * @returns A function with the same signature as the input callback. The returned
 * function maintains a stable reference while accessing the latest state or props.
 *
 * @example
 * import { usePreservedCallback } from 'reactive-kit';
 * import { useState } from 'react';
 *
 * function Counter() {
 *   const [count, setCount] = useState(0);
 *
 *   const handleClick = usePreservedCallback(() => {
 *     console.log(`Current count: ${count}`);
 *     setCount(count + 1);
 *   });
 *
 *   return <button onClick={handleClick}>Click me</button>;
 * }
 *
 * @example
 * // Passing a stable callback reference to a child component
 * import { usePreservedCallback } from 'reactive-kit';
 * import { useState } from 'react';
 *
 * function Parent() {
 *   const [count, setCount] = useState(0);
 *
 *   const increment = usePreservedCallback(() => {
 *     setCount(prev => prev + 1);
 *   });
 *
 *   return <Child onIncrement={increment} />;
 * }
 *
 * function Child({ onIncrement }: { onIncrement: () => void }) {
 *   return <button onClick={onIncrement}>Increment</button>;
 * }
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
