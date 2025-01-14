# useToggle

useToggle is a React hook that helps manage a boolean state easily. It provides functionalities to toggle the state.

## Interface

```ts
function useToggle(defaultValue?: boolean): readonly [
  boolean, // Current state value
  () => void, // Function to toggle the state
];
```

### Parameters

- `defaultValue` (`boolean`): It's the initial value of the state. The default value is false.

### Returns

Returns a `readonly [boolean, () => void]` tuple:

1. boolean: The current state value.
2. () => void: A function to toggle the state.

## Examples

```tsx
import { useToggle } from 'reactie';

function Component() {
  const [open, toggle] = useToggle(false);

  return (
    <div>
      <p>Bottom Sheet state: {open ? 'opened' : 'closed'}</p>
      <button onClick={toggle}>Toggle</button>
    </div>
  );
}
```
