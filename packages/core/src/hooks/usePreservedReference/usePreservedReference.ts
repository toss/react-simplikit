import { useMemo, useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type NotNullishValue = {};

/**
 * @description
 * `usePreservedReference` is a React hook that helps maintain the reference of a value
 * when it hasn't changed, while ensuring you can safely use the latest state.
 * It prevents unnecessary re-renders while always allowing access to the latest data.
 *
 * @template {NotNullishValue} T - The type of target to be referenced.
 *
 * @param {T} value - The value to maintain the reference for. It returns a new reference
 *   if the state value changes after comparison.
 * @param {(a: T, b: T) => boolean} [areValuesEqual] - An optional function to determine
 *   if two values are equal. By default, it uses `JSON.stringify` for comparison.
 *
 * @returns {T} Returns the same reference if the value is considered equal to the previous one,
 *   otherwise returns a new reference.
 *
 * @example
 * import { usePreservedReference } from 'react-simplikit';
 * import { useState } from 'react';
 *
 * function ExampleComponent() {
 *   const [state, setState] = useState({ key: 'value' });
 *
 *   const preservedState = usePreservedReference(state);
 *
 *   return <div>{preservedState.key}</div>;
 * }
 *
 * @example
 * import { usePreservedReference } from 'react-simplikit';
 * import { useState } from 'react';
 *
 * function ExampleComponent() {
 *   const [state, setState] = useState({ key: 'value' });
 *
 *   const preservedState = usePreservedReference(state, (a, b) => a.key === b.key);
 *
 *   return <div>{preservedState.key}</div>;
 * }
 */
export function usePreservedReference<T extends NotNullishValue>(
  value: T,
  areValuesEqual: (a: T, b: T) => boolean = areDeeplyEqual
): T {
  const ref = useRef(value);

  return useMemo(() => {
    if (!areValuesEqual(ref.current, value)) {
      ref.current = value;
    }
    return ref.current;
  }, [areValuesEqual, value]);
}

function areDeeplyEqual<T extends NotNullishValue>(x: T, y: T) {
  return JSON.stringify(x) === JSON.stringify(y);
}
