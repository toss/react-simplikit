# useDebouncedCallback

`useDebouncedCallback` is a React hook that returns a debounced version of the provided callback function.
It helps optimize event handling by delaying function execution and grouping multiple calls into one.

Note that if both 'leading' and 'trailing' are set, the function will be called at both the start and end of the delay period. However, it must be called at least twice within debounceMs interval for this to happen, since one debounced function call cannot trigger the function twice.

## Interface

```ts
function useDebouncedCallback<T>(
  onChange: (newValue: T) => void,
  debounceMs: number,
  options?: DebounceOptions
): (nextValue: T) => void;
```

### Parameters

<Interface
  required
  name="onChange"
  type="(newValue: T) => void"
  description="The callback to debounce. A call with the same value as the last forwarded one is skipped."
/>

<Interface
  required
  name="debounceMs"
  type="number"
  description="The debounce delay in milliseconds."
/>

<Interface
  name="options"
  type="DebounceOptions"
  description="Optional edge behavior."
  :nested="[
    {
      name: 'options.leading',
      type: 'boolean',
      required: false,
      defaultValue: 'false',
      description:
        'If <code>true</code>, the function is called at the start of the sequence.',
    },
    {
      name: 'options.trailing',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        'If <code>true</code>, the function is called at the end of the sequence.',
    },
  ]"
/>

### Return Value

<Interface
  name=""
  type="(nextValue: T) => void"
  description="A debounced function that forwards the value to <code>onChange</code>."
/>

## Example

```tsx
import { useDebouncedCallback } from 'react-simplikit';
import { useState } from 'react';

function SearchInput() {
  const [query, setQuery] = useState('');
  const setQueryDebounced = useDebouncedCallback(setQuery, 300);

  return (
    <>
      <input onChange={e => setQueryDebounced(e.target.value)} />
      <p>Searching for: {query}</p>
    </>
  );
}
```
