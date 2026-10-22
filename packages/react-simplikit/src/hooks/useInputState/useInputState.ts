import { ChangeEvent, ChangeEventHandler, useCallback, useState } from 'react';

type InputLikeElement = HTMLInputElement | HTMLTextAreaElement;

type InitialValue = string | (() => string);

/**
 * @description
 * `useInputState` is a React hook that manages an input state with optional value transformation.
 * The returned `onChange` handler works with both `<input>` and `<textarea>` elements.
 *
 * @param {string | (() => string)} [initialValue=""] - The initial value of the input. Defaults to an empty string (`""`).
 * @param {(nextValue: string, previousValue: string) => string} [transformValue=(nextValue: string) => nextValue]
 * - A function to transform the input value. The previous state value is available as its second argument.
 *   Defaults to an identity function that returns the next input unchanged.
 *
 * @returns {[value: string, onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>]} A tuple containing:
 * - value `string` - The current state value;
 * - onChange `ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>` - A function to update the state;
 *
 * @example
 * function Example() {
 *   const [value, onChange] = useInputState('');
 *   return (
 *     <>
 *       <input type="text" value={value} onChange={onChange} />
 *       <textarea value={value} onChange={onChange} />
 *     </>
 *   );
 * }
 */
export function useInputState(
  initialValue: InitialValue = '',
  transformValue: (nextValue: string, previousValue: string) => string = echo
) {
  const [value, setValue] = useState(initialValue);

  const handleValueChange: ChangeEventHandler<InputLikeElement> = useCallback(
    ({ target: { value: nextValue } }: ChangeEvent<InputLikeElement>) => {
      setValue(transformValue(nextValue, value));
    },
    [transformValue, value]
  );

  return [value, handleValueChange] as const;
}

function echo(nextValue: string) {
  return nextValue;
}
