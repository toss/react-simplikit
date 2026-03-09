# useThrottledCallback

`useThrottledCallback` is a React hook that returns a throttled version of the provided callback function. The throttled callback will only be invoked at most once per specified interval.

## Interface

```ts
function useThrottledCallback<F extends (...args: any[]) => any>(
  callback: F,
  wait: number,
  options?: { edges?: Array<'leading' | 'trailing'> }
): F & { cancel: () => void };
```

### Parameters

<Interface
  required
  name="callback"
  type="F"
  description="The function to throttle."
/>

<Interface
  required
  name="wait"
  type="number"
  description="The number of milliseconds to throttle invocations to."
/>

<Interface
  name="options"
  type="{ edges?: Array<'leading' | 'trailing'> }"
  description="Options to control the behavior of the throttle."
  :nested="[
    {
      name: 'options.edges',
      type: 'Array<\'leading\' | \'trailing\'>',
      required: false,
      defaultValue: '[\'leading\', \'trailing\']',
      description:
        'An optional array specifying whether the function should be invoked on the leading edge, trailing edge, or both. <br />: The initial value is <code>[\'leading\', \'trailing\']</code>.',
    },
  ]"
/>

### Return Value

<Interface
  name=""
  type="F & { cancel: () => void }"
  description="Returns the throttled function with a <code>cancel</code> method to cancel any pending invocation."
/>

## Example

```tsx
function SearchInput() {
  const throttledSearch = useThrottledCallback((query: string) => {
    console.log('Searching for:', query);
  }, 300);

  return <input onChange={e => throttledSearch(e.target.value)} />;
}
```
