import { useEffect, useRef } from 'react';

import { usePreservedCallback } from '../usePreservedCallback/index.ts';

type UseIntervalOptions = {
  onTick: () => void;
  delayMs: number;
  immediate?: boolean;
  enabled?: boolean;
};

/**
 * @description
 * `useInterval` is a React hook that executes a function at a specified interval.
 * It is useful for timers, polling data, and other recurring tasks.
 *
 * @param {Object} options - Configures the interval behavior.
 * @param {() => void} options.onTick - The function to be executed periodically.
 * @param {number} options.delayMs - The interval duration in milliseconds.
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
 *   useInterval({
 *     onTick: () => setTime(prev => prev + 1),
 *     delayMs: 1000,
 *   });
 *
 *   return (
 *     <div>
 *       <p>{time} seconds</p>
 *     </div>
 *   );
 * }
 */
export function useInterval({ onTick, delayMs, immediate = false, enabled = true }: UseIntervalOptions) {
  const preservedCallback = usePreservedCallback(onTick);
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
