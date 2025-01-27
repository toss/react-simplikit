import { useCallback, useState } from 'react';

/**
 *
 * @description
 * useBooleanState is a React hook that helps manage a boolean state easily. It provides functionalities to set the state to true, set it to false, and toggle the state.
 *
 * @param defaultValue - It's the initial value of the state. The default value is false.
 *
 * @returns Returns a `readonly [boolean, () => void, () => void, () => void]` tuple:
 *
 * 1. boolean: The current state value
 * 2. () => void: A function to set the state to true
 * 3. () => void: A function to set the state to false
 * 4. () => void: A function to toggle the state
 *
 * @example
 * const [open, openBottomSheet, closeBottomSheet, toggleBottomSheet] = useBooleanState(false);
 */
export const useBooleanState = (defaultValue = false): readonly [boolean, () => void, () => void, () => void] => {
  const [bool, setBool] = useState(defaultValue);

  const setTrue = useCallback(() => {
    setBool(true);
  }, []);

  const setFalse = useCallback(() => {
    setBool(false);
  }, []);

  const toggle = useCallback(() => {
    setBool(b => !b);
  }, []);

  return [bool, setTrue, setFalse, toggle] as const;
};
