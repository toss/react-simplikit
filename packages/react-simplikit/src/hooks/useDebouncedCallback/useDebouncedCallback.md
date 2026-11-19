# useDebouncedCallback

`useDebouncedCallback` is a React hook that returns a debounced version of the provided callback function.
It helps optimize event handling by delaying function execution and grouping multiple calls into one.
The debounced function takes the same arguments as `callback` and forwards the ones from the last call.

Note that if both 'leading' and 'trailing' are set, the function will be called at both the start and end of the delay period. However, it must be called at least twice within debounceMs interval for this to happen, since one debounced function call cannot trigger the function twice.

Pending calls are cancelled when the component unmounts or when `debounceMs`, `leading`, or `trailing` changes.
Calling `.cancel()` only cancels a pending call; it does not stop work that `callback` has already started.
The next call after `.cancel()` starts a new sequence, so it runs immediately when `leading` is `true`.

## Interface

```ts
function useDebouncedCallback<F extends (...args: any[]) => unknown>(
  options: Object
): ((...args: Parameters<F>) => void) & { cancel: () => void };
```

### Parameters

<Interface
  required
  name="options"
  type="Object"
  description="The options object."
  :nested="[
    {
      name: 'options.callback',
      type: 'F',
      required: true,
      description: 'The function to debounce.',
    },
    {
      name: 'options.debounceMs',
      type: 'number',
      required: true,
      description:
        'The number of milliseconds to delay the function execution.',
    },
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
  type="((...args: Parameters<F>) => void) & { cancel: () => void }"
  description="A debounced function that takes the same arguments as <code>callback</code>. It also includes a <code>cancel</code> method to cancel any pending debounced execution."
/>

## Example

```tsx
import { useDebouncedCallback } from 'react-simplikit';
import { useState } from 'react';

function SearchInput() {
  const [query, setQuery] = useState('');
  const setQueryDebounced = useDebouncedCallback({
    callback: setQuery,
    debounceMs: 300,
  });

  return (
    <>
      <input onChange={e => setQueryDebounced(e.target.value)} />
      <button type="button" onClick={() => setQueryDebounced.cancel()}>
        Cancel pending update
      </button>
      <p>Searching for: {query}</p>
    </>
  );
}
```
