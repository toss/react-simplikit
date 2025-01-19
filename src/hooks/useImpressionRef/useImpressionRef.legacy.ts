import { useCallback, useEffect, useRef } from 'react';
import debounce from 'lodash.debounce';

import { useVisibilityEvent } from '../../../dist/index';
import { useIntersectionObserver } from '../useIntersectionObserver/useIntersectionObserver.legacy.ts';
import { usePreservedCallback } from '../usePreservedCallback/index.ts';

export type UseImpressionRefOptions = {
  onImpressionStart?: () => void;
  onImpressionEnd?: () => void;
  rootMargin?: string;
  areaThreshold?: number;
  timeThreshold?: number;
};

export function useImpressionRef<Element extends HTMLElement>({
  onImpressionStart: _onImpressionStart,
  onImpressionEnd: _onImpressionEnd,
  timeThreshold = 0,
  rootMargin,
  areaThreshold: intersectThreshold = 0,
}: UseImpressionRefOptions) {
  const onImpressionStart = usePreservedCallback(_onImpressionStart ?? noop);
  const onImpressionEnd = usePreservedCallback(_onImpressionEnd ?? noop);

  const isIntersectingRef = useRef(false);
  const setDebouncedIsImpressed = useSetDebouncedBooleanValue({
    onValueChange: isImpressed => {
      if (isImpressed) {
        onImpressionStart();
      } else {
        onImpressionEnd();
      }
    },
    timeThreshold,
  });

  const intersectionObserverRef = useIntersectionObserver<Element>(
    entry => {
      if (document.visibilityState === 'hidden') {
        return;
      }

      const currentRatio = entry.intersectionRatio;
      const isIntersecting = intersectThreshold === 0 ? entry.isIntersecting : currentRatio >= intersectThreshold;

      isIntersectingRef.current = isIntersecting;
      setDebouncedIsImpressed(isIntersecting);
    },
    {
      rootMargin,
      threshold: intersectThreshold,
    }
  );

  useVisibilityEvent(documentVisible => {
    if (!isIntersectingRef.current) {
      return;
    }

    setDebouncedIsImpressed(documentVisible === 'visible');
  });

  return intersectionObserverRef;
}

function useSetDebouncedBooleanValue(options: { onValueChange: (newValue: boolean) => void; timeThreshold: number }) {
  const { onValueChange, timeThreshold } = options;
  const handleValueChange = usePreservedCallback(onValueChange);
  const ref = useRef({ value: false, cancelPrevDebounce: () => {} });

  const setDebouncedValue = useCallback(
    (newValue: boolean) => {
      if (newValue === ref.current.value) {
        return;
      }

      const debounced = debounce(() => {
        handleValueChange(newValue);
        ref.current.value = newValue;
      }, timeThreshold);

      ref.current.cancelPrevDebounce();
      debounced();
      ref.current.cancelPrevDebounce = debounced.cancel;
    },
    [handleValueChange, timeThreshold]
  );

  useEffect(() => {
    const current = ref.current;
    return () => {
      current.cancelPrevDebounce();
    };
  }, []);

  return setDebouncedValue;
}

function noop() {}
