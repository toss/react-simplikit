import { ChangeEvent, ChangeEventHandler, useCallback, useState } from 'react';

/**
 * @description
 * `useInputState` is a React hook that manages an input state with optional value transformation.
 *
 * @param {string} [initialValue=""] - The initial value of the input. Defaults to an empty string (`""`).
 * @param {(value: string) => string} [transformValue=(v: string) => v] - A function to transform the input value.
 *   Defaults to an identity function that returns the input unchanged.
 *
 * @returns {[value: string, onChange: ChangeEventHandler<HTMLInputElement>]} A tuple containing:
 * - value `string` - The current state value;
 * - onChange `ChangeEventHandler<HTMLInputElement>` - A function to update the state;
 *
 * @example
 * function Example() {
 *   const [value, onChange] = useInputState('');
 *   return <input type="text" value={value} onChange={onChange} />;
 * }
 */
export function useInputState(initialValue = '', transformValue: (value: string) => string = echo) {
  const [value, setValue] = useState(initialValue);

  const handleValueChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
      setValue(transformValue(value));
    },
    [transformValue]
  );

  return [value, handleValueChange] as const;
}

function echo(v: string) {
  return v;
}
