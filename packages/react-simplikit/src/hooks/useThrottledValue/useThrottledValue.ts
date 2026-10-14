import { useEffect, useRef, useState } from 'react';

import { useThrottle } from '../useThrottle/index.ts';

type ThrottleOptions = {
  leading?: boolean;
  trailing?: boolean;
};

/**
 * @description
 * `useThrottledValue` is a React hook that returns a throttled copy of the given value.
 * The caller keeps owning the state; the returned value follows it at most once per `throttleMs` milliseconds,
 * which is useful for driving expensive renders from scroll position, pointer position, or an element's
 * size on resize.
 *
 * On the first render and on the server the value is returned as is. A change is never scheduled
 * on mount, so the first change after mount is applied immediately when `leading` is `true`.
 * If both `leading` and `trailing` are `false`, the returned value never updates.
 *
 * The value is compared by reference. Passing a new object or array on every render keeps
 * the returned value updating every `throttleMs` milliseconds; stabilize the reference first, for
 * example with `usePreservedReference`.
 *
 * @template T - The type of the value.
 * @param {T} value - The value to throttle.
 * @param {number} throttleMs - The length of the throttle window in milliseconds.
 * @param {ThrottleOptions} [options] - Configuration options for throttle behavior.
 * @param {boolean} [options.leading=true] - If `true`, the first change in a window is applied immediately.
 * @param {boolean} [options.trailing=true] - If `true`, the last change in a window is applied `throttleMs` milliseconds after that change.
 *
 * @returns {T} The throttled value.
 *
 * @example
 * import { useThrottledValue } from 'react-simplikit';
 * import { useState } from 'react';
 *
 * function ScrollProgress() {
 *   const [scrollY, setScrollY] = useState(0);
 *   const throttledScrollY = useThrottledValue(scrollY, 100);
 *
 *   return (
 *     <div onScroll={e => setScrollY(e.currentTarget.scrollTop)}>
 *       <ProgressBar position={throttledScrollY} />
 *     </div>
 *   );
 * }
 */
export function useThrottledValue<T>(
  value: T,
  throttleMs: number,
  { leading = true, trailing = true }: ThrottleOptions = {}
): T {
  const [throttledValue, setThrottledValue] = useState(() => value);
  const throttled = useThrottle((next: T) => setThrottledValue(() => next), throttleMs, {
    leading,
    trailing,
  });
  const lastForwardedRef = useRef(value);

  useEffect(
    function forwardChangedValue() {
      const unchanged = Object.is(lastForwardedRef.current, value);
      const settled = Object.is(value, throttledValue);
      if (unchanged && settled) {
        return;
      }

      lastForwardedRef.current = value;
      throttled(value);
    },
    [value, throttledValue, throttled]
  );

  return throttledValue;
}
