import { DependencyList, useEffect } from 'react';

/**
 * @description
 * `useAsyncEffect` is a React hook for handling asynchronous side effects in React components.
 * It follows the same cleanup pattern as `useEffect` while ensuring async operations are handled safely.
 *
 * @param {() => Promise<void | (() => void)>} [effect] - An asynchronous function executed in the `useEffect` pattern.
 *   This function can optionally return a cleanup function.
 * @param {DependencyList} [deps] - A dependency array.
 *   The effect will re-run whenever any value in this array changes. If omitted, it runs only once when the component mounts.
 *
 * @example
 * useAsyncEffect(async () => {
 *   const data = await fetchData();
 *   setData(data);
 *
 *   return () => {
 *     console.log('Cleanup on unmount or dependencies change');
 *   };
 * }, [dependencies]);
 */

export function useAsyncEffect(effect: () => Promise<void | (() => void)>, deps?: DependencyList) {
  useEffect(() => {
    let cleanup: (() => void) | void;

    effect().then(result => {
      cleanup = result;
    });

    return () => {
      cleanup?.();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
