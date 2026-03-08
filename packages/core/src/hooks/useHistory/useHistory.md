# useHistory

`useHistory` is a React hook that tracks the change history of a value and provides undo/redo functionality. Each time `setValue` is called, the value is recorded in the history stack, and you can navigate through past values using `undo` and `redo`.

## Interface

```ts
function useHistory<T>(
  initialValue: T,
  options?: { capacity?: number }
): {
  value: T;
  setValue: (value: T) => void;
  history: readonly T[];
  pointer: number;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  clear: () => void;
};
```

### Parameters

<Interface
  name="initialValue"
  type="T"
  description="The initial value to track."
/>

<Interface
  name="options"
  type="{ capacity?: number }"
  description="Configuration options."
  :nested="[
    {
      name: 'capacity',
      type: 'number',
      required: false,
      description: 'The maximum number of history entries to keep. When exceeded, the oldest entry is removed. Defaults to unlimited.',
    },
  ]"
/>

### Return Value

<Interface
  name=""
  type="object"
  description="An object containing:"
  :nested="[
    {
      name: 'value',
      type: 'T',
      required: false,
      description: 'The current value.',
    },
    {
      name: 'setValue',
      type: '(value: T) => void',
      required: false,
      description: 'A function to set a new value and record it in the history.',
    },
    {
      name: 'history',
      type: 'readonly T[]',
      required: false,
      description: 'A readonly array of all recorded values.',
    },
    {
      name: 'pointer',
      type: 'number',
      required: false,
      description: 'The current position in the history stack.',
    },
    {
      name: 'undo',
      type: '() => void',
      required: false,
      description: 'A function to revert to the previous value.',
    },
    {
      name: 'redo',
      type: '() => void',
      required: false,
      description: 'A function to move forward to the next value.',
    },
    {
      name: 'canUndo',
      type: 'boolean',
      required: false,
      description: 'Whether there is a previous value to revert to.',
    },
    {
      name: 'canRedo',
      type: 'boolean',
      required: false,
      description: 'Whether there is a next value to move forward to.',
    },
    {
      name: 'clear',
      type: '() => void',
      required: false,
      description: 'A function to clear the history and reset to the current value.',
    },
  ]"
/>

## Example

```tsx
function TextEditor() {
  const { value, setValue, undo, redo, canUndo, canRedo } = useHistory('');

  return (
    <div>
      <input value={value} onChange={e => setValue(e.target.value)} />
      <button onClick={undo} disabled={!canUndo}>
        Undo
      </button>
      <button onClick={redo} disabled={!canRedo}>
        Redo
      </button>
    </div>
  );
}
```

```tsx
function Counter() {
  const { value, setValue, undo, canUndo, clear } = useHistory(0, {
    capacity: 10,
  });

  return (
    <div>
      <p>Count: {value}</p>
      <button onClick={() => setValue(value + 1)}>Increment</button>
      <button onClick={undo} disabled={!canUndo}>
        Undo
      </button>
      <button onClick={clear}>Clear History</button>
    </div>
  );
}
```
