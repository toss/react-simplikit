/* eslint-disable @typescript-eslint/no-explicit-any */
import { DependencyList, useEffect, useRef } from 'react';

import { usePreservedCallback } from '../usePreservedCallback/index.ts';

/**
 * @description
 * `useCallbackOncePerRender` is a React hook that ensures a callback function is executed only once, regardless of how many times it's called.
 *  This is useful for one-time operations that should not be repeated, even if the component re-renders.
 *
 * @param {() => void} callback - The callback function to be executed once.
 * @param {DependencyList} deps - Dependencies array that will trigger a new one-time execution when changed.
 *
 * @returns {(...args: any[]) => void} A memoized function that will only execute once until dependencies change.
 *
 * @example
 * import { useCallbackOncePerRender } from 'react-simplikit';
 *
 * function Component() {
 *   const handleOneTimeEvent = useCallbackOncePerRender(() => {
 *     console.log('This will only run once');
 *   }, []);
 *
 *   return <button onClick={handleOneTimeEvent}>Click me</button>;
 * }
 *
 * @example
 * // With dependencies
 * function TrackingComponent({ userId }: { userId: string }) {
 *   const trackUserVisit = useCallbackOncePerRender(() => {
 *     analytics.trackVisit(userId);
 *   }, [userId]);
 *
 *   useEffect(() => {
 *     trackUserVisit();
 *   }, [trackUserVisit]);
 *
 *   return <div>User page</div>;
 * }
 */
export function useCallbackOncePerRender<F extends (...args: any[]) => void>(callback: F, deps: DependencyList) {
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
