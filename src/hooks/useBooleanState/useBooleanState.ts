import { useCallback, useState } from 'react';

/**
 * @description
 * `useBooleanState` is a React hook that simplifies managing a boolean state. 
 * It provides functions to set the state to `true`, set it to `false`, and toggle its value.
 *
 * @param {boolean} [defaultValue=false] - The initial value of the state. Defaults to `false`.
 *
 * @returns {readonly [boolean, () => void, () => void, () => void]} A tuple containing:
 * - `boolean` - The current state value.
 * - `() => void` - A function to set the state to `true`.
 * - `() => void` - A function to set the state to `false`.
 * - `() => void` - A function to toggle the state.
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
