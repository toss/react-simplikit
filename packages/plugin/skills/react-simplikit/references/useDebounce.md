# useDebounce

`useDebounce` is a React hook that returns a debounced version of the provided callback function. It helps optimize event handling by delaying function execution and grouping multiple calls into one.

With the default options, the last call runs after `wait` milliseconds without another call. Pending calls are cancelled on unmount or when the debounce instance changes. Calling `.cancel()` only cancels a pending callback, not an already-started network request. The example displays the submitted query locally; replace `setSubmittedQuery` with your application's search callback when connecting a server.

## Interface

```ts
function useDebounce<F extends (...args: any[]) => unknown>(
  callback: F,
  wait: number,
  options: DebounceOptions
): F & { cancel: () => void };
```

### Parameters

<Interface
  required
  name="callback"
  type="F"
  description="The function to debounce."
/>

<Interface
  required
  name="wait"
  type="number"
  description="The number of milliseconds to delay the function execution."
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
  type="F & { cancel: () => void }"
  description="debounced function that delays invoking the callback. It also includes a <code>cancel</code> method to cancel any pending debounced execution."
/>

## Example

```tsx
import { useState } from 'react';
import { useDebounce } from 'react-simplikit';

export function SearchInput() {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const debouncedSearch = useDebounce(setSubmittedQuery, 300);

  return (
    <section>
      <label>
        Search
        <input
          value={query}
          onChange={event => {
            setQuery(event.target.value);
            debouncedSearch(event.target.value);
          }}
        />
      </label>
      <output aria-live="polite">{submittedQuery}</output>
      <button type="button" onClick={() => debouncedSearch.cancel()}>
        Cancel pending update
      </button>
    </section>
  );
}
```
