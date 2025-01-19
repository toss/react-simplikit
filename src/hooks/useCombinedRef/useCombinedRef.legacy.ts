/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { useCallback, useEffect, useMemo, useRef } from 'react';
import debounce from 'lodash.debounce';

import { usePreservedCallback } from '../usePreservedCallback/index.ts';
import { useRefEffect } from '../useRefEffect/useRefEffect.legacy.ts';
// import { usePreservedCallback } from '../react/use-preserved-callback';
// import { useRefEffect } from '../react/use-ref-effect';
// import { noop } from '../utils/noop';

/**
 *
 * @description
 * `useImpressionRef` Hook에 전달할 수 있는 옵션의 타입입니다.
 */
export type UseImpressionRefOptions = {
  onImpressionStart?: () => void;
  onImpressionEnd?: () => void;
  rootMargin?: string;
  /*
   * 몇 퍼센트 이상 화면에 표시되면 "보인다"고 생각할지 결정합니다.
   * 예를 들어, 0.5가 주어지면 0.5 이상이 보여졌을 때 `onImpressionStart`, 이하가 보여졌을 때 `onImpressionEnd`가 호출됩니다.
   * @default 0
   */
  areaThreshold?: number;
  /*
   * 몇 밀리세컨드 이상 화면에 표시되거나 사라져야 실제로 값을 업데이트할지 결정합니다.
   * 예를 들어, 값이 2000이면 2초 사이에 요소의 표시 상태가 바뀌어도 첫 상태와 끝 상태가 같다면 이벤트가 호출되지 않습니다.
   * @default 0
   */
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

  useDocumentVisibilityChange(documentVisible => {
    if (!isIntersectingRef.current) {
      return;
    }

    setDebouncedIsImpressed(documentVisible);
  });

  return intersectionObserverRef;
}

function useDocumentVisibilityChange(_callback: (isVisible: boolean) => void) {
  const callback = usePreservedCallback(_callback);

  useEffect(() => {
    const handleVisibilityChange = () => {
      callback(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [callback]);
}

function useIntersectionObserver<Element extends HTMLElement>(
  _callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit
) {
  const callback = usePreservedCallback(_callback);
  const observer = useMemo(() => {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry) {
        return;
      }

      callback(entry);
    }, options);

    return observer;
  }, [callback, options]);

  const ref = useRefEffect<Element>(
    element => {
      observer?.observe(element);

      return () => {
        observer?.unobserve(element);
      };
    },
    [callback, options]
  );

  return ref;
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
