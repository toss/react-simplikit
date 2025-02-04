# useBooleanState

`useBooleanState` is a React hook that simplifies managing a boolean state.  
It provides functions to set the state to `true`, set it to `false`, and toggle its value.  
This hook makes handling boolean states more intuitive and concise.

## Interface

```ts
function useBooleanState(defaultValue?: boolean): readonly [
  boolean, // Current state value
  () => void, // Function to set the state to true
  () => void, // Function to set the state to false
  () => void, // Function to toggle the state
];
```

### Parameters

- `defaultValue` (`boolean`): It's the initial value of the state. The default value is `false`.

### Returns

Returns a `readonly [boolean, () => void, () => void, () => void]` tuple:

- `boolean`: The current state value.
- `() => void`: A function to set the state to `true`.
- `() => void`: A function to set the state to `false`.
- `() => void`: A function to toggle the state.

## Examples

```tsx
import { useBooleanState } from 'reactive-kit';

function Component() {
  const [open, openBottomSheet, closeBottomSheet, toggleBottomSheet] = useBooleanState(false);

  return (
    <div>
      <p>Bottom Sheet state: {open ? 'opened' : 'closed'}</p>
      <button onClick={openBottomSheet}>Open</button>
      <button onClick={closeBottomSheet}>Close</button>
      <button onClick={toggleBottomSheet}>Toggle</button>
    </div>
  );
}
```
