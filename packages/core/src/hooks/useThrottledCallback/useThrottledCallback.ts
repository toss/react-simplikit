import { useCallback, useEffect, useRef } from 'react';

import { usePreservedCallback } from '../usePreservedCallback/index.ts';
import { usePreservedReference } from '../usePreservedReference/index.ts';
import { throttle } from '../useThrottle/throttle.ts';

type ThrottleOptions = {
  edges?: Array<'leading' | 'trailing'>;
};

/**
 * @description
 * `useThrottledCallback` is a React hook that returns a throttled version of the provided callback function.
 * The throttled callback will only be invoked at most once per specified interval.
 *
 * @param {Object} options - The options object.
 * @param {Function} options.onChange - The callback function to throttle.
 * @param {number} options.timeThreshold - The number of milliseconds to throttle invocations to.
 * @param {Array<'leading' | 'trailing'>} [options.edges=['leading', 'trailing']] - An optional array specifying whether the function should be invoked on the leading edge, trailing edge, or both.
 *
 * @returns {Function} A throttled function that limits invoking the callback.
 *
 * @example
 * function ScrollTracker() {
 *   const throttledScroll = useThrottledCallback({
 *     onChange: (scrollY: number) => console.log(scrollY),
 *     timeThreshold: 200,
 *   });
 *   return <div onScroll={(e) => throttledScroll(e.currentTarget.scrollTop)} />;
 * }
 */
export function useThrottledCallback({
  onChange,
  timeThreshold,
  edges = ['leading', 'trailing'],
}: ThrottleOptions & {
  onChange: (newValue: boolean) => void;
  timeThreshold: number;
}) {
  const handleChange = usePreservedCallback(onChange);
  const ref = useRef({ value: false, clearPreviousThrottle: () => {} });

  useEffect(function cleanupThrottleOnUnmount() {
    const current = ref.current;
    return () => {
      current.clearPreviousThrottle();
    };
  }, []);

  const preservedEdges = usePreservedReference(edges);

  return useCallback(
    (nextValue: boolean) => {
      if (nextValue === ref.current.value) {
        return;
      }

      const throttled = throttle(
        () => {
          handleChange(nextValue);

          ref.current.value = nextValue;
        },
        timeThreshold,
        { edges: preservedEdges }
      );

      ref.current.clearPreviousThrottle();

      throttled();

      ref.current.clearPreviousThrottle = throttled.cancel;
    },
    [handleChange, timeThreshold, preservedEdges]
  );
}
