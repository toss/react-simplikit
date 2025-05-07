import { useCallback, useState } from 'react';

type UseCounterOptions = {
  min?: number;
  max?: number;
  step?: number;
};

type UseCounterReturn = {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setCount: (value: number | ((prev: number) => number)) => void;
};

/**
 * @description
 * `useCounter` is a React hook that manages a numeric counter state with increment, decrement, and reset capabilities.
 * Optionally, you can provide minimum and maximum values to constrain the counter's range.
 *
 * @param {number} [initialValue=0] - Initial value for the counter. Defaults to 0.
 * @param {UseCounterOptions} options - The options for the counter.
 * @param {number} [options.min] - Minimum value the counter can reach. If not provided, there is no lower limit.
 * @param {number} [options.max] - Maximum value the counter can reach. If not provided, there is no upper limit.
 * @param {number} [options.step=1] - Value to increment or decrement by. Defaults to 1.
 *
 * @returns {UseCounterReturn} An object with count value and control functions.
 * - count `number` - The current count value;
 * - increment `() => void` - A function to increment the count;
 * - decrement `() => void` - A function to decrement the count;
 * - reset `() => void` - A function to reset the count to the initial value;
 * - setCount `(value: number | ((prev: number) => number)) => void` - A function to set the count to a specific value or a function that returns a new value;
 *
 * @example
 * import { useCounter } from 'react-simplikit';
 *
 * function ShoppingCart() {
 *   const { count, increment, decrement, reset } = useCounter(1, {
 *     min: 1,
 *     max: 10,
 *   });
 *
 *   return (
 *     <div>
 *       <span>Quantity: {count}</span>
 *       <button type="button" onClick={decrement}>-</button>
 *       <button type="button" onClick={increment}>+</button>
 *       <button type="button" onClick={reset}>Reset</button>
 *     </div>
 *   );
 * }
 */
export function useCounter(initialValue = 0, { min, max, step = 1 }: UseCounterOptions = {}): UseCounterReturn {
  const validateValue = (value: number): number => {
    let validatedValue = value;

    if (min !== undefined && validatedValue < min) {
      validatedValue = min;
    }

    if (max !== undefined && validatedValue > max) {
      validatedValue = max;
    }

    return validatedValue;
  };

  const [count, setCountState] = useState<number>(() => validateValue(initialValue));

  const validateValueMemoized = useCallback(validateValue, [min, max]);

  const setCount = useCallback(
    (value: number | ((prev: number) => number)) => {
      setCountState(prev => {
        const nextValue = typeof value === 'function' ? value(prev) : value;

        return validateValueMemoized(nextValue);
      });
    },
    [validateValueMemoized]
  );

  const increment = useCallback(() => {
    setCount(prev => prev + step);
  }, [setCount, step]);

  const decrement = useCallback(() => {
    setCount(prev => prev - step);
  }, [setCount, step]);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [setCount, initialValue]);

  return {
    count,
    increment,
    decrement,
    reset,
    setCount,
  };
}
