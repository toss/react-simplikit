# useDebouncedState

`useDebouncedState` is a React hook that manages state and returns a debounced setter.
With the default options, the state updates `debounceMs` milliseconds after the last setter call.
It is useful for applying only the last value from a series of rapid update requests, such as search input.

The initial value is returned as is on the first render and on the server. No update is scheduled
on mount, so with `leading: true` the first setter call after mount is applied immediately.
If both `leading` and `trailing` are `false`, the state never updates.

Pending updates are cancelled when the component unmounts or when `debounceMs`, `leading`, or
`trailing` changes.

## Interface

```ts
function useDebouncedState<T>(
  initialValue: T,
  debounceMs: number,
  options?: DebounceOptions
): [state: T, setState: Dispatch<SetStateAction<T>>];
```

### Parameters

<Interface
  required
  name="initialValue"
  type="T"
  description="The initial state value, used only on the first render."
/>

<Interface
  required
  name="debounceMs"
  type="number"
  description="The number of milliseconds to wait after the last setter call before updating."
/>

<Interface
  name="options"
  type="DebounceOptions"
  description="Configuration options for debounce behavior."
  :nested="[
    {
      name: 'options.leading',
      type: 'boolean',
      required: false,
      defaultValue: 'false',
      description:
        'If <code>true</code>, the first setter call after an idle period is applied immediately.',
    },
    {
      name: 'options.trailing',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        'If <code>true</code>, the last value is applied after <code>debounceMs</code> milliseconds.',
    },
  ]"
/>

### Return Value

<Interface
  name=""
  type="[state: T, setState: Dispatch<SetStateAction<T>>]"
  description="A tuple:"
  :nested="[
    {
      name: 'state',
      type: 'T',
      required: false,
      description: 'The current state value.',
    },
    {
      name: 'setState',
      type: 'Dispatch<SetStateAction<T>>',
      required: false,
      description:
        'A debounced setter that accepts the next state value or an updater function.',
    },
  ]"
/>

## Example

```tsx
import { useDebouncedState } from 'react-simplikit';

function SearchInput() {
  const [query, setQuery] = useDebouncedState('', 300);

  return (
    <>
      <label>
        Search
        <input onChange={event => setQuery(event.target.value)} />
      </label>
      <output aria-live="polite">{query}</output>
    </>
  );
}
```
