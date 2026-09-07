import { useRef } from 'react';

import { useThrottle } from '../useThrottle/index.ts';

type ThrottleOptions = {
  edges?: Array<'leading' | 'trailing'>;
};

/**
 * Marks that no value has been forwarded to `onChange` yet.
 *
 * The hook skips redundant invocations by comparing against the last forwarded value, but it
 * receives no initial value from the caller. Seeding that comparison with `false` would treat the
 * first `false` as redundant and swallow it, so an unreachable sentinel is used instead.
 */
const NOT_INVOKED = Symbol('NOT_INVOKED');

/**
 * @description
 * `useThrottledCallback` is a React hook that returns a throttled version of the provided callback function.
 * The throttled callback will only be invoked at most once per specified interval.
 *
 * @template T - The type of the value passed to `onChange`.
 * @param {Object} options - The options object.
 * @param {(newValue: T) => void} options.onChange - The callback to throttle. A call with the same value as the last forwarded one is skipped.
 * @param {number} options.timeThreshold - The number of milliseconds to throttle invocations to.
 * @param {Array<'leading' | 'trailing'>} [options.edges=['leading', 'trailing']] - An optional array specifying whether the function should be invoked on the leading edge, trailing edge, or both.
 *
 * @returns {(nextValue: T) => void} A throttled function that forwards the value to `onChange` at most once per interval.
 *
 * @example
 * import { useThrottledCallback } from 'react-simplikit';
 * import { useState } from 'react';
 *
 * function ScrollPosition() {
 *   const [scrollTop, setScrollTop] = useState(0);
 *   const setScrollTopThrottled = useThrottledCallback({ onChange: setScrollTop, timeThreshold: 200 });
 *
 *   return (
 *     <div onScroll={e => setScrollTopThrottled(e.currentTarget.scrollTop)}>
 *       <p>Scrolled {scrollTop}px</p>
 *     </div>
 *   );
 * }
 */
export function useThrottledCallback<T>({
  onChange,
  timeThreshold,
  edges = ['leading', 'trailing'],
}: ThrottleOptions & {
  onChange: (newValue: T) => void;
  timeThreshold: number;
}): (nextValue: T) => void {
  const lastForwardedRef = useRef<T | typeof NOT_INVOKED>(NOT_INVOKED);

  return useThrottle(
    (nextValue: T) => {
      if (nextValue === lastForwardedRef.current) {
        return;
      }

      onChange(nextValue);

      lastForwardedRef.current = nextValue;
    },
    timeThreshold,
    { edges }
  );
}
