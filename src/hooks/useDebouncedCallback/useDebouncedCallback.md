# useDebouncedCallback

`useDebouncedCallback` is a React hook that returns a debounced version of the provided callback function. It helps optimize event handling by delaying function execution and grouping multiple calls into one. Note that if both 'leading' and 'trailing' are set, the function will be called at both the start and end of the delay period. However, it must be called at least twice within debounceMs interval for this to happen, since one debounced function call cannot trigger the function twice.

## Interface

```ts
function useDebouncedCallback(options: Object): Function;
```

### Parameters

<Interface
  required
  name="options"
  type="Object"
  description="The options object."
  :nested="[
    {
      name: 'options.onChange',
      type: 'Function',
      required: true,
      description: 'The callback function to debounce.',
    },
    {
      name: 'options.timeThreshold',
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
  type="Function"
  description="debounced function that delays invoking the callback."
/>

## Example

```tsx
function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedSetQuery = useDebouncedCallback({
    onChange: setQuery,
    timeThreshold: 100,
  });
  return (
    <input type="text" onChange={e => debouncedSetQuery(e.target.value)} />
  );
}
```
