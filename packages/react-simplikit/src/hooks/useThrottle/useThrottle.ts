import { useThrottle as internalUseThrottle } from '../_internal/useThrottle/useThrottle.ts';

/**
 * @description
 * `useThrottle` is a React hook that creates a throttled version of a callback function.
 * This is useful for limiting the rate at which a function can be called,
 * such as when handling scroll or resize events.
 *
 * @template {(...args: any[]) => unknown} F - The type of the callback function.
 * @param {F} callback - The function to be throttled.
 * @param {number} throttleMs  - The number of milliseconds to throttle invocations to.
 * @param {ThrottleOptions} [options] - Options to control the behavior of the throttle.
 * @param {boolean} [options.leading=true] - If `true`, allows an immediate call at the start of a throttle window.
 * @param {boolean} [options.trailing=true] - If `true`, allows a pending call to run after the delay with the latest arguments.
 * @returns {F & { cancel: () => void }} - Returns the throttled function with a `cancel` method to cancel pending executions.
 *
 * @example
 * const throttledScroll = useThrottle(() => {
 *   console.log('Scroll event');
 * }, 200, { leading: true, trailing: true });
 *
 * useEffect(() => {
 *   window.addEventListener('scroll', throttledScroll);
 *   return () => {
 *     window.removeEventListener('scroll', throttledScroll);
 *     throttledScroll.cancel();
 *   };
 * }, [throttledScroll]);
 *
 * @deprecated This hook will be removed in v2.
 * Use [`useThrottledCallback`](/hooks/useThrottledCallback) to throttle a callback,
 * [`useThrottledState`](/hooks/useThrottledState) to throttle a state update,
 * or [`useThrottledValue`](/hooks/useThrottledValue) to get a throttled value.
 */
export const useThrottle = internalUseThrottle;
