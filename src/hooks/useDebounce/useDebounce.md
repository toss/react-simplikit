# useDebounce

`useDebounce` is a React hook that returns a debounced version of the provided callback function. It helps optimize event handling by delaying function execution and grouping multiple calls into one.

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
function SearchInput() {
  const [query, setQuery] = useState('');

  const debouncedSearch = useDebounce((value: string) => {
    // Actual API call
    searchAPI(value);
  }, 300);

  return (
    <input
      value={query}
      onChange={e => {
        setQuery(e.target.value);
        debouncedSearch(e.target.value);
      }}
      placeholder="Enter search term"
    />
  );
}
```
