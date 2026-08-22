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
  // Unlike the other opt-outs here, this body breaks no Rule of React — it compiles cleanly
  // once the `react-hooks/exhaustive-deps` suppression below is removed. React Compiler
  // refuses to optimize any function carrying a React ESLint suppression, and that
  // suppression is unavoidable because `deps` is forwarded from the caller. Revisit if the
  // compiler ever narrows that bail-out.
  'use no memo';

  useEffect(() => {
    let cleanup: (() => void) | void;
    let isCleaned = false;

    effect().then(result => {
      cleanup = result;
      if (isCleaned) {
        cleanup?.();
      }
    });

    return () => {
      isCleaned = true;
      cleanup?.();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
