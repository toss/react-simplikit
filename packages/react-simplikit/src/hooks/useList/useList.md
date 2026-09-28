# useList

A React hook that manages an array as state.
Provides efficient state management and stable action functions.

## Interface

```ts
function useList<T>(initialState: T[] = []): UseListReturn<T>;
```

### Parameters

<Interface name="initialState" type="T[]" description="Initial array state." />

### Return Value

<Interface
  name=""
  type="UseListReturn<T>"
  description="An object containing the array state and actions to manipulate it."
  :nested="[
    {
      name: 'list',
      type: 'ReadonlyArray<T>',
      required: false,
      description: 'The current array state.',
    },
    {
      name: 'push',
      type: '(value: T) => void',
      required: false,
      description: 'Appends a value to the end of the list.',
    },
    {
      name: 'insertAt',
      type: '(index: number, value: T) => void',
      required: false,
      description: 'Inserts a value at the specified index.',
    },
    {
      name: 'updateAt',
      type: '(index: number, value: T) => void',
      required: false,
      description: 'Updates the value at the specified index.',
    },
    {
      name: 'removeAt',
      type: '(index: number) => void',
      required: false,
      description: 'Removes the value at the specified index.',
    },
    {
      name: 'setAll',
      type: '(values: T[]) => void',
      required: false,
      description: 'Replaces the entire list with a new array.',
    },
    {
      name: 'reset',
      type: '() => void',
      required: false,
      description: 'Resets the list to its initial state.',
    },
  ]"
/>

## Example

```tsx
const { list, push, insertAt, updateAt, removeAt, setAll, reset } =
  useList<string>(['apple', 'banana']);

// Add an item
push('cherry');

// Insert at index
insertAt(1, 'grape');

// Update at index
updateAt(0, 'orange');

// Remove at index
removeAt(2);

// Replace all
setAll(['kiwi', 'mango']);

// Reset to initial state
reset();
```
