# useStorageState

`useStorageState` is a React hook that functions like `useState` but persists the state value in browser storage.
The value is retained across page reloads and can be shared between tabs when using `localStorage`.

Without `serializer` and `deserializer`, the value is stored as JSON and must be JSON-serializable all the way down:
a `Date`, `Map`, class instance or function anywhere in it throws when it is set, and `defaultValue` is checked on mount.
Pass both functions to store any other type. The stored string is not validated when it is read back.
The value read back is reused until the stored string changes, so call `refresh` when `deserializer` changes what it returns.

## Interface

```ts
function useStorageState<T>(
  key: string,
  options?: Object
): readonly [state: T | undefined, actions: StorageStateActions<T | undefined>];
```

### Parameters

<Interface
  required
  name="key"
  type="string"
  description="The key used to store the value in storage."
/>

<Interface
  name="options"
  type="Object"
  description="Configuration options for storage behavior."
  :nested="[
    {
      name: 'options.storage',
      type: 'Storage',
      required: false,
      defaultValue: 'localStorage',
      description:
        'The storage type (<code>localStorage</code> or <code>sessionStorage</code>). Defaults to <code>localStorage</code>.',
    },
    {
      name: 'options.defaultValue',
      type: 'T',
      required: false,
      description: 'The initial value if no existing value is found.',
    },
    {
      name: 'options.serializer',
      type: '(value: T) => string',
      required: false,
      description:
        'Converts the value to a string. Pass it together with <code>deserializer</code>.',
    },
    {
      name: 'options.deserializer',
      type: '(value: string) => T',
      required: false,
      description:
        'Converts the stored string back to a value. Pass it together with <code>serializer</code>.',
    },
  ]"
/>

### Return Value

<Interface
  name=""
  type="readonly [state: T | undefined, actions: StorageStateActions<T | undefined>]"
  description="A tuple containing the state and actions to change it."
  :nested="[
    {
      name: 'state',
      type: 'T | undefined',
      required: false,
      description:
        'The current state value retrieved from storage. It is <code>T</code> when <code>defaultValue</code> is given.',
    },
    {
      name: 'actions.setValue',
      type: '(value: SetStateAction<T | undefined>) => void',
      required: false,
      description: 'A function to update and persist the state.',
    },
    {
      name: 'actions.refresh',
      type: '() => void',
      required: false,
      description: 'Reads the value from storage again without writing to it.',
    },
  ]"
/>

## Example

```tsx
// Counter with persistent state
import { useStorageState } from 'react-simplikit';

function Counter() {
  const [count, { setValue }] = useStorageState('counter', {
    defaultValue: 0,
  });

  return (
    <button onClick={() => setValue(prev => prev + 1)}>Count: {count}</button>
  );
}
```
