# useInputState

`useInputState` is a React hook that manages an input state.

## Interface

```ts
function useInputState(initialValue: string, transformValue: (value: string) => string = echo): void;
```

### Parameters

- `initialValue` (`string`): The initial value of the input, default value is empty string.
- `transformValue` (`(value: string) => string`): The function to transform the input value.

### Returns

Returns a `readonly [string, (value: string) => void]` tuple:

1. string: The current state value.
2. (value: string) => void: A function to set the state to true.

## Examples

### Basic
```tsx
import { useInputState } from 'reactive-kit';

function Example() {
  const [value, setValue] = useInputState('');

  return (
      <input type="text" value={value} onChange={setValue} />
  );
}
```

### Make uppercase value

```tsx
import { useInputState } from 'reactive-kit';

function Example() {
  const [value, setValue] = useInputState('', v => v.toUpperCase());

  return <input type="text" value={value} onChange={setValue} />;
}
```
