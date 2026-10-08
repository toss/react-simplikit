import { useCallback, useMemo, useState } from 'react';

type InitialValue = boolean | (() => boolean);

type BooleanStateActions = {
  setTrue: () => void;
  setFalse: () => void;
  toggle: () => void;
};

/**
 * @description
 * `useBooleanState` is a React hook that simplifies managing a boolean state.
 * It provides functions to set the state to `true`, set it to `false`, and toggle its value.
 *
 * @param {boolean | (() => boolean)} [initialValue=false] - The initial value of the state. Defaults to `false`.
 *
 * @returns {readonly [state: boolean, actions: BooleanStateActions]} A tuple containing the state and actions to change it.
 * - state `boolean` - The current state value;
 * - actions.setTrue `() => void` - A function to set the state to `true`;
 * - actions.setFalse `() => void` - A function to set the state to `false`;
 * - actions.toggle `() => void` - A function to toggle the state;
 *
 * @example
 * const [open, { setTrue: openBottomSheet, setFalse: closeBottomSheet }] = useBooleanState(false);
 */
export function useBooleanState(initialValue: InitialValue = false): readonly [boolean, BooleanStateActions] {
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

  const actions = useMemo<BooleanStateActions>(() => ({ setTrue, setFalse, toggle }), [setTrue, setFalse, toggle]);

  return [bool, actions] as const;
}
