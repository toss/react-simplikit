/* eslint-disable @typescript-eslint/no-explicit-any */
import { DependencyList, useEffect, useRef } from 'react';

import { usePreservedCallback } from '../usePreservedCallback/index.ts';

/**
 * @description
 * `useCallbackOnce` is a React hook that runs a callback only once until `deps` change, no matter how many times the returned function is called.
 *  This is useful for one-time operations that should not be repeated, even if the component re-renders.
 *
 * @template {(...args: any[]) => void} F - The type of the callback function.
 * @param {F} callback - The callback function to be executed once. It receives the arguments passed to the returned function.
 * @param {DependencyList} deps - Dependencies array. When it changes, the returned function can run the callback once more.
 *
 * @returns {(...args: Parameters<F>) => void} A function whose reference never changes. It runs the callback only once until `deps` change.
 *
 * @example
 * import { useCallbackOnce } from 'react-simplikit';
 *
 * function Component() {
 *   const handleOneTimeEvent = useCallbackOnce(() => {
 *     console.log('This will only run once');
 *   }, []);
 *
 *   return <button onClick={handleOneTimeEvent}>Click me</button>;
 * }
 *
 * @example
 * // With dependencies
 * function TrackingComponent({ userId }: { userId: string }) {
 *   const trackUserVisit = useCallbackOnce(() => {
 *     analytics.trackVisit(userId);
 *   }, [userId]);
 *
 *   useEffect(() => {
 *     trackUserVisit();
 *   }, [trackUserVisit, userId]);
 *
 *   return <div>User page</div>;
 * }
 */
export function useCallbackOnce<F extends (...args: any[]) => void>(callback: F, deps: DependencyList) {
  // Same reason as `useAsyncEffect`: the body itself is compiler-clean, but React Compiler
  // bails on any function carrying a React ESLint suppression, and the
  // `react-hooks/exhaustive-deps` suppression below is unavoidable for a caller-supplied `deps`.
  'use no memo';

  const hasFired = useRef(false);

  useEffect(() => {
    hasFired.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return usePreservedCallback((...args: Parameters<F>) => {
    if (hasFired.current) {
      return;
    }

    callback(...args);
    hasFired.current = true;
  });
}
