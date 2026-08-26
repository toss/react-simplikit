import { useMemo } from 'react';

import { usePreservedCallback } from '../usePreservedCallback/index.ts';
import { useRefEffect } from '../useRefEffect/index.ts';

/**
 * @deprecated This hook is deprecated as it depends on browser-specific APIs (IntersectionObserver).
 * react-simplikit is now focused on platform-independent, pure state/logic hooks.
 * This hook will be removed in a future major version.
 *
 * @description
 * `useIntersectionObserver` is a React hook that detects whether a specific DOM element is visible on the screen.
 * It uses the `IntersectionObserver` API to execute a callback when the element enters or exits the viewport.
 *
 * @param {(entry: IntersectionObserverEntry) => void} callback - A callback function that is executed when the visibility of the element changes.
 *   You can check `entry.isIntersecting` to determine if the element is in view.
 * @param {IntersectionObserverInit} options - Options for the `IntersectionObserver`.
 * @param {boolean} [options.root] - The element that is used as the viewport for checking visibility of the target.
 * @param {string} [options.rootMargin] - Margin around the root.
 * @param {number | number[]} [options.threshold] - Either a single number or an array of numbers which indicate at what percentage of the target's visibility the observer's callback should be executed.
 *
 * @returns {(element: Element | null) => void} A function to set the element. Attach this function to the `ref` attribute, and the `callback` will be executed whenever the element's visibility changes.
 *
 * @example
 * import { useIntersectionObserver } from 'react-simplikit';
 *
 * function Component() {
 *   const ref = useIntersectionObserver<HTMLDivElement>(
 *     entry => {
 *       if (entry.isIntersecting) {
 *         console.log('Element is in view:', entry.target);
 *       } else {
 *         console.log('Element is out of view:', entry.target);
 *       }
 *     },
 *     { threshold: 0.5 }
 *   );
 *
 *   return <div ref={ref}>Observe me!</div>;
 * }
 */
export function useIntersectionObserver<Element extends HTMLElement>(
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit
): (element: Element | null) => void {
  const preservedCallback = usePreservedCallback(callback);

  const observer = useMemo(() => {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    return new IntersectionObserver(([entry]) => {
      preservedCallback(entry);
    }, options);
  }, [preservedCallback, options]);

  return useRefEffect<Element>(
    element => {
      observer?.observe(element);

      return () => {
        observer?.unobserve(element);
      };
    },
    [preservedCallback, options]
  );
}
