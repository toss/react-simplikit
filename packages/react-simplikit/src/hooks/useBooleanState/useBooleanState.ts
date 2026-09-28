import { useCallback, useState } from 'react';

type InitialValue = boolean | (() => boolean);

/**
 * @description
 * `useBooleanState` is a React hook that simplifies managing a boolean state.
 * It provides functions to set the state to `true`, set it to `false`, and toggle its value.
 *
 * @param {boolean | (() => boolean)} [initialValue=false] - The initial value of the state. Defaults to `false`.
 *
 * @returns {{ value: boolean; setTrue: () => void; setFalse: () => void; toggle: () => void }} An object containing:
 * - value `boolean` - The current state value;
 * - setTrue `() => void` - A function to set the state to `true`;
 * - setFalse `() => void` - A function to set the state to `false`;
 * - toggle `() => void` - A function to toggle the state;
 *
 * @example
 * const { value: open, setTrue: openBottomSheet, setFalse: closeBottomSheet, toggle: toggleBottomSheet } = useBooleanState(false);
 */
export function useBooleanState(initialValue: InitialValue = false): {
  value: boolean;
  setTrue: () => void;
  setFalse: () => void;
  toggle: () => void;
} {
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

  return { value: bool, setTrue, setFalse, toggle };
}
