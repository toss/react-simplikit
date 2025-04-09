# useToggle

`useToggle` is a React hook that simplifies managing a boolean state.
It provides a function to toggle the state between `true` and `false`.

## Interface

```ts
function useToggle(initialValue: boolean = false): readonly [
  boolean, // Current state value
  () => void, // Function to toggle the state
];
```

### Parameters

- `initialValue` (`boolean`): It's the initial value of the state. The default value is false.

### Returns

Returns a `readonly [boolean, () => void]` tuple:

- `boolean`: The current state value.
- `() => void`: A function to toggle the state.

## Examples

```tsx
import { useToggle } from 'react-simplikit';

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
