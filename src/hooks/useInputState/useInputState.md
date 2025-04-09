# useInputState

`useInputState` is a React hook that simplifies managing an input state.
It allows you to control the state of an input field and optionally transform the input value.

## Interface

```ts
function useInputState(
  initialValue: string,
  transformValue: (value: string) => string = echo
): readonly [string, (value: string) => void];
```

### Parameters

- `initialValue` (`string`): The initial value of the input. Defaults to an empty string (`""`).
- `transformValue` (`(value: string) => string`): A function to transform the input value before updating the state.  
  By default, it returns the value unchanged.

### Returns

Returns a `readonly [string, (value: string) => void]` tuple:

- `string`: The current state value.
- `(value: string) => void`: A function to set the state.

## Examples

### Basic

```tsx
import { useInputState } from 'react-simplikit';

function Example() {
  const [value, setValue] = useInputState('');

  return <input type="text" value={value} onChange={setValue} />;
}
```

### Make uppercase value

```tsx
import { useInputState } from 'react-simplikit';

function Example() {
  const [value, setValue] = useInputState('', v => v.toUpperCase());

  return <input type="text" value={value} onChange={setValue} />;
}
```
