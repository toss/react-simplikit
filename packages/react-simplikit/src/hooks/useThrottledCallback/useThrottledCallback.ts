import type { CallerTypedArgs } from '../../_internal/types.ts';
import { useThrottle } from '../_internal/useThrottle/useThrottle.ts';

type UseThrottledCallbackOptions<F extends (...args: CallerTypedArgs) => unknown> = {
  callback: F;
  throttleMs: number;
  leading?: boolean;
  trailing?: boolean;
};

/**
 * @description
 * `useThrottledCallback` is a React hook that returns a throttled version of the provided callback function.
 * The throttled callback will only be invoked at most once per specified interval.
 * The throttled function takes the same arguments as `callback`, and a trailing call uses the arguments from the latest call.
 *
 * Pending calls are cancelled when the component unmounts or when `throttleMs`, `leading`, or `trailing` changes.
 * Calling `.cancel()` only cancels a pending call; it does not stop work that `callback` has already started.
 * The next call after `.cancel()` starts a new window, so it runs immediately when `leading` is `true`.
 *
 * @template {(...args: any[]) => unknown} F - The type of the callback function.
 * @param {Object} options - The options object.
 * @param {F} options.callback - The function to throttle.
 * @param {number} options.throttleMs - The number of milliseconds to throttle invocations to.
 * @param {boolean} [options.leading=true] - If `true`, allows an immediate call at the start of a throttle window.
 * @param {boolean} [options.trailing=true] - If `true`, allows a pending call to run after the delay with the latest arguments.
 *
 * @returns {((...args: Parameters<F>) => void) & { cancel: () => void }} A throttled function that takes the same arguments as `callback`.
 *   It also includes a `cancel` method to cancel any pending throttled execution.
 *
 * @example
 * import { useThrottledCallback } from 'react-simplikit';
 * import { useState } from 'react';
 *
 * function ScrollPosition() {
 *   const [scrollTop, setScrollTop] = useState(0);
 *   const setScrollTopThrottled = useThrottledCallback({ callback: setScrollTop, throttleMs: 200 });
 *
 *   return (
 *     <div onScroll={e => setScrollTopThrottled(e.currentTarget.scrollTop)}>
 *       <p>Scrolled {scrollTop}px</p>
 *     </div>
 *   );
 * }
 */
export function useThrottledCallback<F extends (...args: CallerTypedArgs) => unknown>({
  callback,
  throttleMs,
  leading = true,
  trailing = true,
}: UseThrottledCallbackOptions<F>): {
  (...args: Parameters<F>): void;
  cancel: () => void;
} {
  return useThrottle(callback, throttleMs, { leading, trailing });
}
