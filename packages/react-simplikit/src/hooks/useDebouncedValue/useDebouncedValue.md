# useDebouncedValue

`useDebouncedValue` is a React hook that returns a debounced copy of the given value. The caller keeps owning the state; the hook only delays how quickly the returned value follows it. The returned value updates `wait` milliseconds after the last change, which is useful for deriving a search query or a validation input from fast-changing state.

On the first render and on the server the value is returned as is. A change is never scheduled on mount, so with `leading: true` the first change after mount is applied immediately. If both `leading` and `trailing` are `false`, the returned value never updates.

## Interface

```ts
function useDebouncedValue<T>(
  value: T,
  wait: number,
  options: DebounceOptions
): T;
```

### Parameters

<Interface
  required
  name="value"
  type="T"
  description="The value to debounce."
/>

<Interface
  required
  name="wait"
  type="number"
  description="The number of milliseconds to wait after the last change before updating."
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
        'If <code>true</code>, the first change after an idle period is applied immediately.',
    },
    {
      name: 'options.trailing',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        'If <code>true</code>, the last change is applied after <code>wait</code> milliseconds.',
    },
  ]"
/>

### Return Value

<Interface name="" type="T" description="debounced value." />

## Example

```tsx
import { useDebouncedValue } from 'react-simplikit';
import { useState } from 'react';

function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 300);

  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <SearchResults query={debouncedQuery} />
    </>
  );
}
```
