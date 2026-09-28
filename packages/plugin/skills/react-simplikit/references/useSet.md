# useSet

A React hook that manages a Set as state.
Provides efficient state management and stable action functions.

## Interface

```ts
function useSet<T>(initialState: SetOrValues<T> = new Set()): UseSetReturn<T>;
```

### Parameters

<Interface
  name="initialState"
  type="SetOrValues<T>"
  description="Initial Set state (Set object or array of values)."
/>

### Return Value

<Interface
  name=""
  type="UseSetReturn<T>"
  description="An object containing the Set state and actions to manipulate it."
  :nested="[
    {
      name: 'set',
      type: 'Omit<Set<T>, \'add\' | \'clear\' | \'delete\'>',
      required: false,
      description: 'The current Set state with mutation methods hidden.',
    },
    {
      name: 'add',
      type: '(value: T) => void',
      required: false,
      description: 'Adds a value to the set.',
    },
    {
      name: 'remove',
      type: '(value: T) => void',
      required: false,
      description: 'Removes a value from the set.',
    },
    {
      name: 'toggle',
      type: '(value: T) => void',
      required: false,
      description: 'Adds the value if absent, removes it if present.',
    },
    {
      name: 'setAll',
      type: '(values: Set<T> | T[]) => void',
      required: false,
      description: 'Replaces all values in the set.',
    },
    {
      name: 'reset',
      type: '() => void',
      required: false,
      description: 'Resets the set to its initial state.',
    },
  ]"
/>

## Example

```tsx
import { useSet } from 'react-simplikit';

function TagSelector() {
  const { set: selectedTags, add, remove, toggle } = useSet<string>(['react']);

  return (
    <div>
      {['react', 'vue', 'svelte'].map(tag => (
        <button key={tag} onClick={() => toggle(tag)}>
          {selectedTags.has(tag) ? '✓' : ''} {tag}
        </button>
      ))}
    </div>
  );
}
```
