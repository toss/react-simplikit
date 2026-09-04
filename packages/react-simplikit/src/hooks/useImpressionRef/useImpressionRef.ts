import { useEffect, useRef } from 'react';

import { useDebouncedCallback } from '../useDebouncedCallback/useDebouncedCallback.ts';
import { useIntersectionObserver } from '../useIntersectionObserver/index.ts';
import { usePreservedCallback } from '../usePreservedCallback/index.ts';
import { useVisibilityEvent } from '../useVisibilityEvent/index.ts';

export type UseImpressionRefOptions = Partial<{
  onImpressionStart: () => void;
  onImpressionEnd: () => void;
  rootMargin: string;
  areaThreshold: number;
  timeThreshold: number;
}>;

/**
 * @description
 * `useImpressionRef` is a React hook that measures the time a specific DOM element is visible on the screen and executes callbacks when the element enters or exits the viewport.
 * It uses `IntersectionObserver` and the `Visibility API` to track the element's visibility.
 *
 * @param {UseImpressionRefOptions} options - Options for tracking the element's visibility.
 * @param {() => void} [options.onImpressionStart] - Callback function executed when the element enters the view
 * @param {() => void} [options.onImpressionEnd] - Callback function executed when the element exits the view
 * @param {number} [options.timeThreshold=0] - Minimum time the element must be visible (in milliseconds)
 * @param {number} [options.areaThreshold=0] - Minimum ratio of the element that must be visible (0 to 1)
 * @param {string} options.rootMargin - Margin to adjust the detection area
 *
 * @returns {(element: Element | null) => void} A function to set the element. Attach this function to the `ref` attribute, and the callbacks will be executed whenever the element's visibility changes.
 *
 * @example
 * import { useImpressionRef } from 'react-simplikit';
 *
 * function Component() {
 *   const ref = useImpressionRef<HTMLDivElement>({
 *     onImpressionStart: () => console.log('Element entered view'),
 *     onImpressionEnd: () => console.log('Element exited view'),
 *     timeThreshold: 1000,
 *     areaThreshold: 0.5,
 *   });
 *
 *   return <div ref={ref}>Track my visibility!</div>;
 * }
 */
export function useImpressionRef<Element extends HTMLElement>({
  onImpressionStart = () => {},
  onImpressionEnd = () => {},
  rootMargin,
  areaThreshold = 0,
  timeThreshold = 0,
}: UseImpressionRefOptions) {
  const impressionStartHandler = usePreservedCallback(onImpressionStart);
  const impressionEndHandler = usePreservedCallback(onImpressionEnd);

  const isIntersectingRef = useRef(false);
  // The last value handed to the debounced handler, which is not the same as the last one delivered.
  // The unmount effect below needs to know an end was requested even while it is still on the timer.
  const requestedImpressionRef = useRef(false);
  // An element that was never impressed can still report `false` (it starts outside the viewport,
  // or the tab is hidden before it ever intersects); an end without a start must not be emitted.
  const hasImpressionStartedRef = useRef(false);
  const impressionEventHandler = useDebouncedCallback({
    timeThreshold,
    onChange: (impressed: boolean) => {
      if (impressed) {
        hasImpressionStartedRef.current = true;
        impressionStartHandler();
        return;
      }

      if (hasImpressionStartedRef.current) {
        hasImpressionStartedRef.current = false;
        impressionEndHandler();
      }
    },
    leading: true,
  });

  const requestImpressionChange = (impressed: boolean) => {
    requestedImpressionRef.current = impressed;
    impressionEventHandler(impressed);
  };

  // The end event goes through a debounce, so a short impression can still be waiting on the timer when
  // the element unmounts (a row scrolling out of a virtualised list). `useDebounce` cancels pending calls
  // on unmount, which would drop the event, so emit it here instead.
  useEffect(
    function emitPendingImpressionEndOnUnmount() {
      return () => {
        if (hasImpressionStartedRef.current && !requestedImpressionRef.current) {
          hasImpressionStartedRef.current = false;
          impressionEndHandler();
        }
      };
    },
    [impressionEndHandler]
  );

  useVisibilityEvent(documentVisible => {
    if (!isIntersectingRef.current) {
      return;
    }

    requestImpressionChange(documentVisible === 'visible');
  });

  return useIntersectionObserver<Element>(
    entry => {
      if (document.visibilityState === 'hidden') {
        return;
      }

      const currentRatio = entry.intersectionRatio;
      const isIntersecting = areaThreshold === 0 ? entry.isIntersecting : currentRatio >= areaThreshold;

      isIntersectingRef.current = isIntersecting;
      requestImpressionChange(isIntersecting);
    },
    { rootMargin, threshold: areaThreshold }
  );
}
