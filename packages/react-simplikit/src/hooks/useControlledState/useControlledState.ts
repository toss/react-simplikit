import { type Dispatch, type SetStateAction, useCallback, useEffect, useRef, useState } from 'react';

import { usePreservedCallback } from '../usePreservedCallback/index.ts';

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
  const controlled = valueProp !== undefined;
  const value = controlled ? valueProp : uncontrolledState;
  const preservedOnChange = usePreservedCallback((next: T) => onChange?.(next));

  // Uncontrolled updates go through React's queue so function updates apply in order.
  // onChange fires here, after commit, because the updater must stay pure (StrictMode runs it twice).
  const prevUncontrolledRef = useRef(uncontrolledState);
  useEffect(
    function notifyUncontrolledChange() {
      if (controlled === true) return;
      if (equalityFn(prevUncontrolledRef.current, uncontrolledState) === true) return;
      prevUncontrolledRef.current = uncontrolledState;
      preservedOnChange(uncontrolledState);
    },
    [controlled, uncontrolledState, equalityFn, preservedOnChange]
  );

  const setValue = useCallback(
    (next: SetStateAction<T>) => {
      if (controlled === false) {
        setUncontrolledState(prev => {
          const nextValue = isSetStateAction(next) ? next(prev) : next;
          return equalityFn(prev, nextValue) === true ? prev : nextValue;
        });
        return;
      }

      // Computed from the committed `value` on purpose: two function updates in the same tick
      // see the same `prev`. Tracking the pending value in a ref needs a forced re-render to
      // reset it, which loops when the parent rejects a change the caller re-issues every render.
      const nextValue = isSetStateAction(next) ? next(value) : next;

      if (equalityFn(value, nextValue) === true) return;
      if (nextValue === undefined) {
        // Keep the notify effect from reporting this again once the parent hands control back.
        prevUncontrolledRef.current = nextValue;
        setUncontrolledState(nextValue);
      }
      onChange?.(nextValue);
    },
    [controlled, onChange, equalityFn, value]
  );

  return [value, setValue];
}

type PrevStateChangeFunction<T> = (oldValue: T) => T;

function isSetStateAction<T>(next: SetStateAction<T>): next is PrevStateChangeFunction<T> {
  return typeof next === 'function';
}
