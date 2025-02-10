import { useEffect, useMemo } from 'react';

import { usePreservedCallback } from '../usePreservedCallback/index.ts';
import { usePreservedReference } from '../usePreservedReference/index.ts';

import { throttle } from './throttle.ts';

type ThrottleOptions = {
  leading?: boolean;
  trailing?: boolean;
};

/**
 * @description
 * A React hook that creates a throttled version of a callback function.
 * This is useful for limiting the rate at which a function can be called,
 * such as when handling scroll or resize events.
 *
 * @template F - The type of the callback function.
 * @param {F} callback - The function to be throttled.
 * @param {number} wait - The number of milliseconds to throttle invocations to.
 * @param {ThrottleOptions} [options] - Options to control the behavior of the throttle.
 * @param {boolean} [options.leading=false] - If true, the function is invoked on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true] - If true, the function is invoked on the trailing edge of the timeout.
 * @returns {F & { cancel: () => void }} - Returns the throttled function with a `cancel` method to cancel pending executions.
 *
 * @example
 * const throttledScroll = useThrottle(() => {
 *   console.log('Scroll event');
 * }, 200);
 *
 * useEffect(() => {
 *   window.addEventListener('scroll', throttledScroll);
 *   return () => {
 *     window.removeEventListener('scroll', throttledScroll);
 *     throttledScroll.cancel();
 *   };
 * }, [throttledScroll]);
 */
export function useThrottle<F extends (...args: any[]) => any>(
  callback: F,
  wait: number,
  options: ThrottleOptions = {}
) {
  const preservedCallback = usePreservedCallback(callback);
  const { leading = false, trailing = true } = usePreservedReference(options);

  const edges = useMemo(() => {
    const _edges: Array<'leading' | 'trailing'> = [];
    if (leading) {
      _edges.push('leading');
    }

    if (trailing) {
      _edges.push('trailing');
    }

    return _edges;
  }, [leading, trailing]);

  const throttledCallback = useMemo(() => {
    return throttle(preservedCallback, wait, { edges });
  }, [preservedCallback, wait, edges]);

  useEffect(
    () => () => {
      throttledCallback.cancel();
    },
    [throttledCallback]
  );

  return throttledCallback;
}
