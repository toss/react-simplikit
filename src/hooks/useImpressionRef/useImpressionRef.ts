import { useRef } from 'react';

import { useIntersectionObserver } from '../useIntersectionObserver/index.ts';
import { usePreservedCallback } from '../usePreservedCallback/index.ts';
import { useVisibilityEvent } from '../useVisibilityEvent/index.ts';

import { useDebouncedCallback } from './useDebouncedCallback.ts';

export type UseImpressionRefOptions = {
  onImpressionStart?: () => void;
  onImpressionEnd?: () => void;
  rootMargin?: string;
  areaThreshold?: number;
  timeThreshold?: number;
};

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
