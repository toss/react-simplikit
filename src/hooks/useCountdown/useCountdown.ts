import { useCallback, useEffect } from 'react';

import { useBooleanState } from '../useBooleanState/index.ts';
import { useCounter } from '../useCounter/index.ts';
import { useInterval } from '../useInterval/index.ts';

type UseCountdownOptions = {
  countStop?: number;
  interval?: number;
  isIncrement?: boolean;
  onCountChange?: (count: number) => void;
  onComplete?: () => void;
};

type UseCountdownControllers = {
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
};

type UseCountdownReturn = [number, UseCountdownControllers];

/**
 * @description
 * `useCountdown` is a React hook that manages a countdown timer.
 * It provides functions to start, pause, resume, and reset the countdown.
 *
 * @param {number} countStart - Starting value for the countdown
 * @param {UseCountdownOptions} options - Countdown options
 * @param {number} [options.countStop=0] - Value at which the countdown stops (default: 0)
 * @param {number} [options.interval=1000] - Interval between counts (in milliseconds, default: 1000)
 * @param {boolean} [options.isIncrement=false] - Whether to use increment mode (default: false, decreasing mode)
 * @param {function} [options.onCountChange] - Callback function that is called whenever the count changes
 * @param {function} [options.onComplete] - Callback function that is called when the countdown completes
 *
 * @returns {UseCountdownReturn} [count, controllers]
 * - count `number` - Current count value
 * - controllers `UseCountdownControllers` - Countdown control functions
 *   - start `() => void` - Function to start the countdown (resets first, then starts)
 *   - pause `() => void` - Function to pause the countdown
 *   - resume `() => void` - Function to resume the paused countdown
 *   - reset `() => void` - Function to reset the countdown (stops and returns to initial value)
 *
 * @example
 * import { useCountdown } from 'react-simplikit';
 *
 * function Timer() {
 *   const [count, { start, pause, resume, reset }] = useCountdown(60, {
 *     countStop: 0,
 *     interval: 1000,
 *     onCountChange: (count) => console.log(`Current count: ${count}`),
 *     onComplete: () => console.log('Countdown complete!'),
 *   });
 *
 *   return (
 *     <div>
 *       <p>Time remaining: {count} seconds</p>
 *       <button type="button" onClick={start}>Start</button>
 *       <button type="button" onClick={pause}>Pause</button>
 *       <button type="button" onClick={resume}>Resume</button>
 *       <button type="button" onClick={reset}>Reset</button>
 *     </div>
 *   );
 * }
 */
export function useCountdown(
  countStart: number,
  { countStop = 0, interval = 1000, isIncrement = false, onCountChange, onComplete }: UseCountdownOptions
): UseCountdownReturn {
  const { count, increment: incrementCount, decrement: decrementCount, reset: resetCount } = useCounter(countStart);
  const [isCountdownRunning, resumeCountdown, pauseCountdown] = useBooleanState(false);

  const countdownCallback = useCallback(() => {
    const nextCount = isIncrement ? count + 1 : count - 1;
    const isCompleted = nextCount === countStop;

    if (isIncrement) {
      incrementCount();
    } else {
      decrementCount();
    }

    if (isCompleted) {
      pauseCountdown();
      onComplete?.();
    }
  }, [count, countStop, isIncrement, incrementCount, decrementCount, pauseCountdown, onComplete]);

  const resetCountdown = useCallback(() => {
    pauseCountdown();
    resetCount();
  }, [pauseCountdown, resetCount]);

  const startCountdown = useCallback(() => {
    resetCountdown();
    resumeCountdown();
  }, [resetCountdown, resumeCountdown]);

  useInterval(countdownCallback, {
    delay: interval,
    enabled: isCountdownRunning,
  });

  useEffect(() => {
    onCountChange?.(count);
  }, [count, onCountChange]);

  return [
    count,
    {
      start: startCountdown,
      pause: pauseCountdown,
      resume: resumeCountdown,
      reset: resetCountdown,
    },
  ];
}
