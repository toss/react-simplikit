import { useEffect, useRef } from 'react';

import { usePreservedCallback } from '../usePreservedCallback/index.ts';

type IntervalOptions = {
  immediate?: boolean;
  enabled?: boolean;
};

/**
 * @description
 * `useInterval` is a React hook that executes a function at a specified interval.
 * It is useful for timers, polling data, and other recurring tasks.
 *
 * @param {() => void} callback - The function to be executed periodically.
 * @param {number} delayMs - The interval duration in milliseconds.
 * @param {IntervalOptions} [options] - Configures the interval behavior.
 * @param {boolean} [options.immediate=false] - If `true`, executes immediately before starting the interval.
 * @param {boolean} [options.enabled=true] - If `false`, the interval will not run.
 *
 * @example
 * import { useInterval } from 'react-simplikit';
 * import { useState } from 'react';
 *
 * function Timer() {
 *   const [time, setTime] = useState(0);
 *
 *   useInterval(() => {
 *     setTime(prev => prev + 1);
 *   }, 1000);
 *
 *   return (
 *     <div>
 *       <p>{time} seconds</p>
 *     </div>
 *   );
 * }
 */
export function useInterval(callback: () => void, delayMs: number, options: IntervalOptions = {}) {
  const { immediate = false, enabled = true } = options;

  const preservedCallback = usePreservedCallback(callback);
  const immediateCalledRef = useRef(false);

  useEffect(
    function runImmediateCallback() {
      if (immediate !== true) {
        immediateCalledRef.current = false;
        return;
      }

      if (!enabled) {
        return;
      }

      if (immediateCalledRef.current) {
        return;
      }

      immediateCalledRef.current = true;
      preservedCallback();
    },
    [immediate, preservedCallback, enabled]
  );

  useEffect(
    function startInterval() {
      if (!enabled) {
        return;
      }

      const id = setInterval(preservedCallback, delayMs);
      return () => clearInterval(id);
    },
    [delayMs, preservedCallback, enabled]
  );
}
