import { DependencyList, useCallback, useRef } from 'react';

import { usePreservedCallback } from '../usePreservedCallback/index.ts';

export type CleanupCallback = () => void;

/**
 * @description
 * `useRefEffect` is a React hook that helps you set a reference to a specific DOM element and execute a callback whenever the element changes.
 * This hook calls a cleanup function whenever the element changes to prevent memory leaks.
 *
 * @param {(element: Element) => CleanupCallback | void} callback - A callback function that is executed when the element is set. This function can return a cleanup function.
 * @param {DependencyList} deps - An array of dependencies that define when the callback should be re-executed. The `callback` is re-executed whenever the `deps` change.
 *
 * @returns {(element: Element | null) => void} A function to set the element. Pass this function to the `ref` attribute, and the `callback` will be called whenever the element changes.
 *
 * @example
 * import { useRefEffect } from 'react-simplikit';
 *
 * function Component() {
 *   const ref = useRefEffect<HTMLDivElement>(element => {
 *     console.log('Element mounted:', element);
 *
 *     return () => {
 *       console.log('Element unmounted:', element);
 *     };
 *   }, []);
 *
 *   return <div ref={ref}>Basic Example</div>;
 * }
 */
export function useRefEffect<Element extends HTMLElement = HTMLElement>(
  callback: (element: Element) => CleanupCallback | void,
  deps: DependencyList
): (element: Element | null) => void {
  const preservedCallback = usePreservedCallback(callback);
  const cleanupCallbackRef = useRef<CleanupCallback>(() => {});

  const effect = useCallback(
    (element: Element | null) => {
      cleanupCallbackRef.current();
      cleanupCallbackRef.current = () => {};

      if (element == null) {
        return;
      }

      const cleanup = preservedCallback(element);

      if (typeof cleanup === 'function') {
        cleanupCallbackRef.current = cleanup;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [preservedCallback, ...deps]
  );

  return effect;
}
