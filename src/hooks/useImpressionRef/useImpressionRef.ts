import { useRef } from 'react';

import { useIntersectionObserver } from '../useIntersectionObserver/index.ts';
import { usePreservedCallback } from '../usePreservedCallback/index.ts';
import { useVisibilityEvent } from '../useVisibilityEvent/index.ts';

import { useDebouncedCallback } from './useDebouncedCallback.ts';

export type UseImpressionRefOptions = Partial<{
  onImpressionStart: () => void;
  onImpressionEnd: () => void;
  rootMargin: string;
  areaThreshold: number;
  timeThreshold: number;
}>;

/**
 * @description
 * `useImpressionRef` is a custom hook that measures the time a specific DOM element is visible on the screen and executes callbacks when the element enters or exits the viewport.
 * This hook uses `IntersectionObserver` and the `Visibility API` to track the element's visibility.
 *
 * @param options - An options object for tracking the element's visibility.
 *                  - `onImpressionStart`: Callback function executed when the element enters the view
 *                  - `onImpressionEnd`: Callback function executed when the element exits the view
 *                  - `timeThreshold`: Minimum time the element must be visible (in milliseconds)
 *                  - `areaThreshold`: Minimum ratio of the element that must be visible (0 to 1)
 *                  - `rootMargin`: Margin to adjust the detection area
 *
 * @returns A function to set the element. Attach this function to the `ref` attribute, and the callbacks will be executed whenever the element's visibility changes.
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
  const impressionEventHandler = useDebouncedCallback({
    timeThreshold,
    onChange: impressed => {
      (impressed ? impressionStartHandler : impressionEndHandler)();
    },
  });

  useVisibilityEvent(documentVisible => {
    if (!isIntersectingRef.current) {
      return;
    }

    impressionEventHandler(documentVisible === 'visible');
  });

  return useIntersectionObserver<Element>(
    entry => {
      if (document.visibilityState === 'hidden') {
        return;
      }

      const currentRatio = entry.intersectionRatio;
      const isIntersecting = areaThreshold === 0 ? entry.isIntersecting : currentRatio >= areaThreshold;

      isIntersectingRef.current = isIntersecting;
      impressionEventHandler(isIntersecting);
    },
    { rootMargin, threshold: areaThreshold }
  );
}
