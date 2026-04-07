# useToggle

`useToggle` is a React hook that simplifies managing a boolean state. It provides a function to toggle the state between `true` and `false`.

## Interface

```ts
function useToggle(
  initialValue: boolean = false
): [state: boolean, toggle: () => void];
```

### Parameters

<Interface
  name="initialValue"
  type="boolean"
  description="The initial state value. Defaults to <code>false</code>."
/>

### Return Value

<Interface
  name=""
  type="[state: boolean, toggle: () => void]"
  description="tuple:"
  :nested="[
    {
      name: 'state',
      type: 'boolean',
      description: 'The current state value.',
    },
    {
      name: 'toggle',
      type: '() => void',
      description: 'A function to toggle the state.',
    },
  ]"
/>

## Example

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
