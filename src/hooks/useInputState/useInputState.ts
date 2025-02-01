import { ChangeEventHandler, useCallback, useState } from 'react';

/**
 * @description
 * `useInputState` is a React hook that manages an input state.
 *
 * @param initialValue - The initial value of the input. Default value is empty string.
 * @param transformValue - The function to transform the input value. Default value is identity function.
 *
 * @example
 * import { useInputState } from 'reactive-kit';
 *
 * function Example() {
 *   const [value, setValue] = useInputState('');
 *   return <input type="text" value={value} onChange={setValue} />;
 * }
 */
export function useInputState(initialValue = '', transformValue: (value: string) => string = echo) {
  const [value, setValue] = useState(initialValue);

  const handleValueChange: ChangeEventHandler<HTMLElement & { value: string }> = useCallback(
    ({ target: { value } }) => {
      setValue(transformValue(value));
    },
    [transformValue]
  );

  return [value, handleValueChange] as const;
}

function echo(v: string) {
  return v;
}
