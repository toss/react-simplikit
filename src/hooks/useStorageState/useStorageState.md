# useStorageState

A React hook that functions like `useState` but persists the state value in browser storage. The value is retained across page reloads and can be shared between tabs when using `localStorage`.

## Interface
```ts
function useStorageState(
  key: string,
  options: Object,
): [
  state: Serializable<T> | undefined,
  setState: (value: SetStateAction<Serializable<T> | undefined>) => void,
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
      required: 'false',
      defaultValue: 'localStorage',
      description:
        'The storage type (<code>localStorage</code> or <code>sessionStorage</code>). Defaults to <code>localStorage</code>.',
    },
    {
      name: 'options.defaultValue',
      type: 'T',
      required: 'false',
      description: 'The initial value if no existing value is found.',
    },
  ]"
/>

### Return Value

<Interface
  name=""
  type="[state: Serializable<T> | undefined, setState: (value: SetStateAction<Serializable<T> | undefined>) => void]"
  description="tuple:"
  :nested="[
    {
      name: 'state',
      type: 'Serializable<T> | undefined',
      required: 'false',
      description: 'The current state value retrieved from storage.',
    },
    {
      name: 'setState',
      type: '(value: SetStateAction<Serializable<T> | undefined>) => void',
      required: 'false',
      description: 'A function to update and persist the state.',
    },
  ]"
/>


## Example

```tsx
// Counter with persistent state
import { useStorageState } from 'react-simplikit';

function Counter() {
  const [count, setCount] = useStorageState<number>('counter', {
    defaultValue: 0,
  });

  return <button onClick={() => setCount(prev => prev + 1)}>Count: {count}</button>;
}
```
  