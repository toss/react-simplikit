# useBooleanState

useBooleanState is a React hook that helps manage a boolean state easily. It provides functionalities to set the state to true, set it to false, and toggle the state.

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

- `defaultValue` (`boolean`): It's the initial value of the state. The default value is false.

### 반환 값

Returns a `readonly [boolean, () => void, () => void, () => void]` tuple:

1. boolean: The current state value.
2. () => void: A function to set the state to true.
3. () => void: A function to set the state to false.
4. () => void: A function to toggle the state.

## Examples

```tsx
import { useBooleanState } from 'reactie';

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
