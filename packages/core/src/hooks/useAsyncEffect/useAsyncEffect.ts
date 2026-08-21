import { DependencyList, useEffect } from 'react';

/**
 * @description
 * `useAsyncEffect` is a React hook for handling asynchronous side effects in React components.
 * It follows the same cleanup pattern as `useEffect` while ensuring async operations are handled safely.
 *
 * An `AbortController` is created for each effect run, and its `signal` is passed to the effect.
 * When the component unmounts or the dependencies change, the signal is aborted, so in-flight async
 * operations (such as `fetch`) can be cancelled without extra boilerplate.
 *
 * @param {(signal: AbortSignal) => Promise<void | (() => void)>} effect - An asynchronous function executed in the `useEffect` pattern.
 *   It receives an `AbortSignal` that is aborted on cleanup, and can optionally return a cleanup function.
 * @param {DependencyList} [deps] - A dependency array.
 *   The effect will re-run whenever any value in this array changes. If omitted, it runs on every component re-render.
 * @param {unknown} [reason] - An optional reason passed to `AbortController.abort(reason)` when the effect is cleaned up.
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
 *
 * // Cancel in-flight requests via the AbortSignal. The signal aborts on unmount or
 * // dependency change, so handle the resulting AbortError yourself.
 * useAsyncEffect(async signal => {
 *   try {
 *     const response = await fetch('/api/data', { signal });
 *     setData(await response.json());
 *   } catch (error) {
 *     if (error instanceof Error && error.name === 'AbortError') return;
 *     throw error;
 *   }
 * }, [dependencies]);
 */

export function useAsyncEffect(
  effect: (signal: AbortSignal) => Promise<void | (() => void)>,
  deps?: DependencyList,
  reason?: unknown
) {
  useEffect(() => {
    const abortController = new AbortController();
    let cleanup: (() => void) | void;
    let isCleaned = false;

    effect(abortController.signal).then(result => {
      cleanup = result;
      if (isCleaned) {
        cleanup?.();
      }
    });

    return () => {
      isCleaned = true;
      abortController.abort(reason);
      cleanup?.();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
