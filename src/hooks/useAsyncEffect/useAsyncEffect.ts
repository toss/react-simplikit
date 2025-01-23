import { DependencyList, useEffect } from 'react';

/**
 * @description
 * useAsyncEffect is a hook for handling async effects in React components.
 * Follows the same cleanup pattern as useEffect.
 *
 * @param effect - An async function to be executed in useEffect pattern.
 * @param deps - A dependency array.
 *
 * @example
 * useAsyncEffect(async () => {
 *   const data = await fetchData();
 *   setData(data);
 *
 *   return () => {
 *     // cleanup logic
 *   };
 * }, [dependency]);
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
