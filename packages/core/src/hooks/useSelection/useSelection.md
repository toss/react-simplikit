# useSelection

`useSelection` is a React hook that manages multi-selection state over a list of items. It provides functions to select, deselect, and toggle items, along with utilities like `selectAll`, `toggleAll`, `isAllSelected`, and `isSomeSelected`.

## Interface

```ts
function useSelection<T>(
  items: ReadonlyArray<T>,
  options?: UseSelectionOptions<T>
): UseSelectionReturn<T>;
```

### Parameters

<Interface
  required
  name="items"
  type="ReadonlyArray<T>"
  description="The list of items to manage selection for."
/>

<Interface
  name="options"
  type="UseSelectionOptions<T>"
  description="Optional configuration for the hook."
  :nested="[
    {
      name: 'options.defaultSelected',
      type: 'ReadonlyArray<T>',
      required: false,
      description: 'Items that are selected by default. Values not present in items are ignored.',
    },
  ]"
/>

### Return Value

<Interface
  name=""
  type="UseSelectionReturn<T>"
  description="An object containing the current selection state and action functions."
  :nested="[
    {
      name: 'selected',
      type: 'ReadonlyArray<T>',
      required: false,
      description: 'Array of currently selected items, ordered as they appear in items.',
    },
    {
      name: 'select',
      type: '(value: T) => void',
      required: false,
      description: 'Add a value to the selection. No-op if the value is already selected.',
    },
    {
      name: 'deselect',
      type: '(value: T) => void',
      required: false,
      description: 'Remove a value from the selection. No-op if the value is not selected.',
    },
    {
      name: 'toggle',
      type: '(value: T) => void',
      required: false,
      description: 'Toggle a value in the selection.',
    },
    {
      name: 'isSelected',
      type: '(value: T) => boolean',
      required: false,
      description: 'Check if a value is currently selected.',
    },
    {
      name: 'selectAll',
      type: '() => void',
      required: false,
      description: 'Select all items.',
    },
    {
      name: 'deselectAll',
      type: '() => void',
      required: false,
      description: 'Clear the selection.',
    },
    {
      name: 'toggleAll',
      type: '() => void',
      required: false,
      description: 'If all items are selected, deselect all. Otherwise select all.',
    },
    {
      name: 'isAllSelected',
      type: 'boolean',
      required: false,
      description: 'True if all items are selected and the list is non-empty.',
    },
    {
      name: 'isSomeSelected',
      type: 'boolean',
      required: false,
      description: 'True if at least one but not all items are selected.',
    },
  ]"
/>

## Example

```tsx
import { useSelection } from 'react-simplikit';

function FileList() {
  const files = ['report.pdf', 'photo.png', 'notes.txt'];
  const {
    selected,
    toggle,
    toggleAll,
    isSelected,
    isAllSelected,
    isSomeSelected,
  } = useSelection(files);

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={isAllSelected}
          ref={el => {
            if (el) el.indeterminate = isSomeSelected;
          }}
          onChange={toggleAll}
        />
        Select all
      </label>
      {files.map(file => (
        <label key={file}>
          <input
            type="checkbox"
            checked={isSelected(file)}
            onChange={() => toggle(file)}
          />
          {file}
        </label>
      ))}
      <p>{selected.length} file(s) selected</p>
    </div>
  );
}
```
