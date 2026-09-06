import { useCallback, useState } from 'react';

type InitialValue = boolean | (() => boolean);

/**
 * @description
 * `useBooleanState` is a React hook that simplifies managing a boolean state.
 * It provides functions to set the state to `true`, set it to `false`, and toggle its value.
 *
 * @param {boolean | (() => boolean)} [initialValue=false] - The initial value of the state. Defaults to `false`.
 *
 * @returns {readonly [state: boolean, setTrue: () => void, setFalse: () => void, toggle: () => void]} A tuple containing:
 * - state `boolean` - The current state value;
 * - setTrue `() => void` - A function to set the state to `true`;
 * - setFalse `() => void` - A function to set the state to `false`;
 * - toggle `() => void` - A function to toggle the state;
 *
 * @example
 * const [open, openBottomSheet, closeBottomSheet, toggleBottomSheet] = useBooleanState(false);
 */
export function useBooleanState(
  initialValue: InitialValue = false
): readonly [boolean, () => void, () => void, () => void] {
  const [bool, setBool] = useState(initialValue);

  const setTrue = useCallback(() => {
    setBool(true);
  }, []);

  const setFalse = useCallback(() => {
    setBool(false);
  }, []);

  const toggle = useCallback(() => {
    setBool(prevBool => !prevBool);
  }, []);

  return [bool, setTrue, setFalse, toggle] as const;
}
