# useSet

A React hook that manages a Set as state. Provides efficient state management and stable action functions.

## Interface

```ts
function useSet<T>(
  initialState?: SetOrValues<T>
): [Omit<Set<T>, 'add' | 'clear' | 'delete'>, SetActions<T>];
```

### Parameters

<Interface
  name="initialState"
  type="Set<T> | T[]"
  description="Initial Set state (Set object or array of values). Defaults to an empty Set."
/>

### Return Value

<Interface
  name=""
  type="[Set, SetActions]"
  description="A tuple containing the Set state and actions to manipulate it."
  :nested="[
    {
      name: '[0]',
      type: 'Omit<Set<T>, add | clear | delete>',
      required: false,
      description: 'The current Set state with mutation methods hidden.',
    },
    {
      name: '[1].add',
      type: '(value: T) => void',
      required: false,
      description: 'Adds a value to the set.',
    },
    {
      name: '[1].remove',
      type: '(value: T) => void',
      required: false,
      description: 'Removes a value from the set.',
    },
    {
      name: '[1].toggle',
      type: '(value: T) => void',
      required: false,
      description: 'Adds the value if absent, removes it if present.',
    },
    {
      name: '[1].setAll',
      type: '(values: Set<T> | T[]) => void',
      required: false,
      description: 'Replaces all values in the set.',
    },
    {
      name: '[1].reset',
      type: '() => void',
      required: false,
      description: 'Resets the set to its initial state.',
    },
  ]"
/>

## Example

```tsx
function TagSelector() {
  const [selectedTags, { add, remove, toggle }] = useSet<string>(['react']);

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
