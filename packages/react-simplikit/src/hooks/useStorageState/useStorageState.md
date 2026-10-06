# useStorageState

`useStorageState` is a React that functions like `useState` but persists the state value in browser storage.
The value is retained across page reloads and can be shared between tabs when using `localStorage`.

## Interface

```ts
function useStorageState<T>(
  key: string,
  options?: Object
): readonly [
  state: Serializable<T> | undefined,
  actions: StorageStateActions<Serializable<T> | undefined>,
];
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
      type: 'Function',
      required: false,
      description: 'A function to serialize the state value to a string.',
    },
    {
      name: 'options.deserializer',
      type: 'Function',
      required: false,
      description: 'A function to deserialize the state value from a string.',
    },
  ]"
/>

### Return Value

<Interface
  name=""
  type="readonly [state: Serializable<T> | undefined, actions: StorageStateActions<Serializable<T> | undefined>]"
  description="A tuple containing the state and actions to change it."
  :nested="[
    {
      name: 'state',
      type: 'Serializable<T> | undefined',
      required: false,
      description: 'The current state value retrieved from storage.',
    },
    {
      name: 'actions.setValue',
      type: '(value: SetStateAction<Serializable<T> | undefined>) => void',
      required: false,
      description: 'A function to update and persist the state.',
    },
    {
      name: 'actions.refresh',
      type: '() => void',
      required: false,
      description: 'A function to refresh the state from storage.',
    },
  ]"
/>

## Example

```tsx
// Counter with persistent state
import { useStorageState } from 'react-simplikit';

function Counter() {
  const [count, { setValue }] = useStorageState<number>('counter', {
    defaultValue: 0,
  });

  return (
    <button onClick={() => setValue(prev => prev + 1)}>Count: {count}</button>
  );
}
```
