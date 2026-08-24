import React, { type Dispatch, type SetStateAction, useCallback, useReducer, useRef, useState } from 'react';

const useSafeInsertionEffect: typeof React.useLayoutEffect =
  /* c8 ignore next */
  typeof document !== 'undefined' ? (React['useInsertionEffect'] ?? React.useLayoutEffect) : () => {};

type ControlledState<T> = { value: T; defaultValue?: never } | { defaultValue: T; value?: T };

export type UseControlledStateProps<T> = ControlledState<T> & {
  onChange?: (value: T) => void;
  equalityFn?: (prev: T, next: T) => boolean;
};

/**
 * @description
 * `useControlledState` is a React hook that allows you to control both controlled and uncontrolled states.
 * If you pass the state to `value`, it will be a controlled state, and if you pass the state to `defaultValue`, it will be an uncontrolled state.
 * If both `value` and `defaultValue` are passed, `value` will take precedence.
 *
 * @param {Object} props
 * @param {T} [props.value] - The value of the state.
 * @param {T} [props.defaultValue] - The default value of the state.
 * @param {(value: T) => void} [props.onChange] - The callback function that is called when the state changes.
 * @param {(prev: T, next: T) => boolean} [props.equalityFn] - The function that is used to compare the previous and next values.
 *
 * @returns {[T, Dispatch<SetStateAction<T>>]} - The state and the setter function.
 *
 * @example
 * type ToggleProps = {
 *   value?: boolean;
 *   defaultValue?: boolean;
 *   onChange?: (value: boolean) => void;
 * }
 *
 * function Toggle({ value, defaultValue, onChange }: ToggleProps) {
 *  const [on, setOn] = useControlledState({
 *    value,
 *    defaultValue: defaultValue ?? false,
 *    onChange,
 *  });
 *
 *  return (
 *    <button onClick={() => setOn((prev) => !prev)}>
 *      {on ? 'ON' : 'OFF'}
 *    </button>
 *  )
 * }
 */
export function useControlledState<T>({
  value: valueProp,
  defaultValue,
  onChange,
  equalityFn = Object.is,
}: UseControlledStateProps<T>): [T, Dispatch<SetStateAction<T>>] {
  const [uncontrolledState, setUncontrolledState] = useState(defaultValue as T);
  const valueRef = useRef(uncontrolledState);

  const controlled = valueProp !== undefined;
  const value = controlled ? valueProp : uncontrolledState;

  // After each render, reset valueRef to the actual value.
  // This keeps the ref in sync with the actual value after optimistic updates.
  const [, triggerRerender] = useReducer(() => ({}), {});
  useSafeInsertionEffect(() => {
    valueRef.current = value;
  });

  const setValue = useCallback(
    (next: SetStateAction<T>) => {
      const nextValue = isSetStateAction(next) ? next(valueRef.current) : next;

      if (equalityFn(valueRef.current, nextValue) === true) return;

      valueRef.current = nextValue;
      // In controlled mode the parent may decide not to update the value
      // (e.g. conditional logic inside onChange).
      // Force a re-render so the effect above can resync the ref with the actual value.
      triggerRerender();

      if (controlled === false) setUncontrolledState(nextValue);
      if (controlled === true && nextValue === undefined) setUncontrolledState(nextValue);
      onChange?.(nextValue);
    },
    [controlled, onChange, equalityFn]
  );

  return [value, setValue];
}

type PrevStateChangeFunction<T> = (oldValue: T) => T;

function isSetStateAction<T>(next: SetStateAction<T>): next is PrevStateChangeFunction<T> {
  return typeof next === 'function';
}
