# useStorageState

`useStorageState` is a React that functions like `useState` but persists the state value in browser storage.
The value is retained across page reloads and can be shared between tabs when using `localStorage`.

## Interface

```ts
function useStorageState<T>(
  key: string,
  options?: Object
): StorageStateReturn<Serializable<T> | undefined>;
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
  type="StorageStateReturn<Serializable<T> | undefined>"
  description="An object containing:"
  :nested="[
    {
      name: 'value',
      type: 'Serializable<T> | undefined',
      required: false,
      description: 'The current state value retrieved from storage.',
    },
    {
      name: 'setValue',
      type: '(value: SetStateAction<Serializable<T> | undefined>) => void',
      required: false,
      description: 'Updates and persists the state.',
    },
    {
      name: 'refresh',
      type: '() => void',
      required: false,
      description: 'Refreshes the state from storage.',
    },
  ]"
/>

## Example

```tsx
// Counter with persistent state
import { useStorageState } from 'react-simplikit';

function Counter() {
  const { value: count, setValue: setCount } = useStorageState<number>(
    'counter',
    {
      defaultValue: 0,
    }
  );

  return (
    <button onClick={() => setCount(prev => prev + 1)}>Count: {count}</button>
  );
}
```
