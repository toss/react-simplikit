# useList

A React hook that manages an array as state. Provides efficient state management and stable action functions.

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
  description="tuple containing the array state and actions to manipulate it."
  :nested="[
    {
      name: 'list',
      type: 'ReadonlyArray<T>',
      required: false,
      description: 'The current array state.',
    },
    {
      name: 'actions.push',
      type: '(value: T) => void',
      required: false,
      description: 'Appends a value to the end of the list.',
    },
    {
      name: 'actions.insertAt',
      type: '(index: number, value: T) => void',
      required: false,
      description: 'Inserts a value at the specified index.',
    },
    {
      name: 'actions.updateAt',
      type: '(index: number, value: T) => void',
      required: false,
      description: 'Updates the value at the specified index.',
    },
    {
      name: 'actions.removeAt',
      type: '(index: number) => void',
      required: false,
      description: 'Removes the value at the specified index.',
    },
    {
      name: 'actions.setAll',
      type: '(values: T[]) => void',
      required: false,
      description: 'Replaces the entire list with a new array.',
    },
    {
      name: 'actions.reset',
      type: '() => void',
      required: false,
      description: 'Resets the list to its initial state.',
    },
  ]"
/>

## Example

```tsx
const [list, actions] = useList<string>(['apple', 'banana']);

// Add an item
actions.push('cherry');

// Insert at index
actions.insertAt(1, 'grape');

// Update at index
actions.updateAt(0, 'orange');

// Remove at index
actions.removeAt(2);

// Replace all
actions.setAll(['kiwi', 'mango']);

// Reset to initial state
actions.reset();
```
