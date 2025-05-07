/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo } from 'react';

import { usePreservedCallback } from '../usePreservedCallback/index.ts';
import { usePreservedReference } from '../usePreservedReference/index.ts';

import { throttle } from './throttle.ts';

/**
 * @description
 * `useThrottle` is a React hook that creates a throttled version of a callback function.
 * This is useful for limiting the rate at which a function can be called,
 * such as when handling scroll or resize events.
 *
 * @template {(...args: any[]) => any} F - The type of the callback function.
 * @param {F} callback - The function to be throttled.
 * @param {number} wait - The number of milliseconds to throttle invocations to.
 * @param {{ edges?: Array<'leading' | 'trailing'> }} [options] - Options to control the behavior of the throttle.
 * @param {Array<'leading' | 'trailing'>} [options.edges=['leading', 'trailing']] - An optional array specifying whether the function should be invoked on the leading edge, trailing edge, or both.
 * @returns {F & { cancel: () => void }} - Returns the throttled function with a `cancel` method to cancel pending executions.
 *
 * @example
 * const throttledScroll = useThrottle(() => {
 *   console.log('Scroll event');
 * }, 200, { edges: ['leading', 'trailing'] });
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
  options?: Parameters<typeof throttle>[2]
) {
  const preservedCallback = usePreservedCallback(callback);
  const preservedOptions = usePreservedReference(options ?? {});

  const throttledCallback = useMemo(
    () => throttle(preservedCallback, wait, preservedOptions),
    [preservedOptions, preservedCallback, wait]
  );

  useEffect(() => {
    return () => {
      throttledCallback.cancel();
    };
  }, [throttledCallback]);

  return throttledCallback;
}
