import { Dispatch, SetStateAction, useRef, useState } from 'react';

import { useThrottle } from '../_internal/useThrottle/useThrottle.ts';

type ThrottleOptions = {
  leading?: boolean;
  trailing?: boolean;
};

const UPDATER_FORWARDED = Symbol('UPDATER_FORWARDED');

/**
 * @description
 * `useThrottledState` is a React hook that manages state and returns a throttled setter.
 * With the default options, the first setter call is applied immediately, and subsequent calls
 * are throttled using `throttleMs`, with the last pending value applied on the trailing edge.
 * It is useful for limiting state updates from frequent events, such as scrolling.
 *
 * The initial value is returned as is on the first render and on the server. No update is scheduled
 * on mount, so with `leading: true` the first setter call after mount is applied immediately.
 * If both `leading` and `trailing` are `false`, the state never updates.
 *
 * Pending updates are cancelled when the component unmounts or when `throttleMs`, `leading`, or
 * `trailing` changes.
 *
 * @template T - The type of the state value.
 * @param {T} initialValue - The initial state value, used only on the first render.
 * @param {number} throttleMs - The length of the throttle window in milliseconds.
 * @param {ThrottleOptions} [options] - Configuration options for throttle behavior.
 * @param {boolean} [options.leading=true] - If `true`, allows an immediate update at the start of a throttle window.
 * @param {boolean} [options.trailing=true] - If `true`, allows a pending update to run after the delay with the latest value.
 *
 * @returns {[state: T, setState: Dispatch<SetStateAction<T>>]} A tuple:
 * - state `T` - The current state value;
 * - setState `Dispatch<SetStateAction<T>>` - A throttled setter that accepts the next state value or an updater function;
 *
 * @example
 * import { useThrottledState } from 'react-simplikit';
 *
 * function ScrollPosition() {
 *   const [scrollTop, setScrollTop] = useThrottledState(0, 200);
 *
 *   return (
 *     <div onScroll={e => setScrollTop(e.currentTarget.scrollTop)}>
 *       <p>Scrolled {scrollTop}px</p>
 *     </div>
 *   );
 * }
 */
export function useThrottledState<T>(
  initialValue: T,
  throttleMs: number,
  { leading = true, trailing = true }: ThrottleOptions = {}
): [T, Dispatch<SetStateAction<T>>] {
  const [throttledValue, setThrottledValue] = useState(() => initialValue);
  const lastForwardedRef = useRef<T | typeof UPDATER_FORWARDED>(initialValue);

  function forwardChangedValue(value: SetStateAction<T>) {
    if (typeof value === 'function') {
      lastForwardedRef.current = UPDATER_FORWARDED;
      setThrottledValue(value);
      return;
    }

    const unchanged = Object.is(lastForwardedRef.current, value);
    const settled = Object.is(value, throttledValue);
    if (unchanged && settled) {
      return;
    }

    lastForwardedRef.current = value;
    setThrottledValue(() => value);
  }

  const throttled = useThrottle((next: SetStateAction<T>) => forwardChangedValue(next), throttleMs, {
    leading,
    trailing,
  });

  return [throttledValue, throttled];
}
