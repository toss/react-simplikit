import { useEffect } from 'react';

import { usePreservedCallback } from '../usePreservedCallback/index.ts';

type IntervalOptions =
  | number
  | {
      delay: number;
      immediate?: boolean;
      enabled?: boolean;
    };

/**
 * @description
 * `useInterval` is a React hook that executes a function periodically.
 *
 * @param callback - The function to be executed periodically.
 * @param options - Configure the interval timing and behavior.
 * @param options.delay - The interval duration in milliseconds. When null, the interval won't be executed.
 * @param options.immediate - When true, executes immediately. When false, waits for the first delay before execution.
 * @param options.enabled - When false, the interval won't be executed.
 *
 * @example
 * import { useInterval } from 'reactive-kit';
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
export function useInterval(callback: () => void, options: IntervalOptions) {
  const delay = typeof options === 'number' ? options : options.delay;
  const immediate = typeof options === 'number' ? false : options.immediate;
  const enabled = typeof options === 'number' ? true : (options.enabled ?? true);

  const preservedCallback = usePreservedCallback(callback);

  useEffect(() => {
    if (immediate === true && enabled) {
      preservedCallback();
    }
  }, [immediate, preservedCallback, enabled]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const id = window.setInterval(preservedCallback, delay);
    return () => window.clearInterval(id);
  }, [delay, preservedCallback, enabled]);
}
