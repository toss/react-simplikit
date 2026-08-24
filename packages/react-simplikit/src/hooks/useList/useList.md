# useList

A React hook that manages an array as state. Provides efficient state management and stable action functions.

## Interface

```ts
function useList<T>(initialState?: T[]): UseListReturn<T>;
```

### Parameters

<Interface
  name="initialState"
  type="T[]"
  description="Initial array state. Defaults to an empty array."
/>

### Return Value

Returns a tuple `[list, actions]`.

<Interface name="list" type="ReadonlyArray<T>" description="The current array state." />

<Interface name="actions.push" type="(value: T) => void" description="Appends a value to the end of the list." />
<Interface name="actions.insertAt" type="(index: number, value: T) => void" description="Inserts a value at the specified index." />
<Interface name="actions.updateAt" type="(index: number, value: T) => void" description="Updates the value at the specified index." />
<Interface name="actions.removeAt" type="(index: number) => void" description="Removes the value at the specified index." />
<Interface name="actions.setAll" type="(values: T[]) => void" description="Replaces the entire list with a new array." />
<Interface name="actions.reset" type="() => void" description="Resets the list to its initial state." />

## Example

```tsx
import { useList } from 'react-simplikit';

function TodoList() {
  const [todos, actions] = useList<string>(['Buy milk', 'Walk the dog']);

  return (
    <div>
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            {todo}
            <button onClick={() => actions.removeAt(index)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={() => actions.push('New todo')}>Add</button>
      <button onClick={() => actions.reset()}>Reset</button>
    </div>
  );
}
```
