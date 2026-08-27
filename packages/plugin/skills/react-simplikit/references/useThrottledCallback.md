# useThrottledCallback

`useThrottledCallback` is a React hook that returns a throttled version of the provided callback function. The throttled callback will only be invoked at most once per specified interval.

## Interface

```ts
function useThrottledCallback(options: Object): Function;
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
      description: 'The callback function to throttle.',
    },
    {
      name: 'options.timeThreshold',
      type: 'number',
      required: true,
      description: 'The number of milliseconds to throttle invocations to.',
    },
    {
      name: 'options.edges',
      type: 'Array<\'leading\' | \'trailing\'>',
      required: false,
      defaultValue: '[\'leading\', \'trailing\']',
      description:
        'An optional array specifying whether the function should be invoked on the leading edge, trailing edge, or both.',
    },
  ]"
/>

### Return Value

<Interface
  name=""
  type="Function"
  description="throttled function that limits invoking the callback."
/>

## Example

```tsx
function ScrollTracker() {
  const throttledScroll = useThrottledCallback({
    onChange: (scrollY: number) => console.log(scrollY),
    timeThreshold: 200,
  });
  return <div onScroll={e => throttledScroll(e.currentTarget.scrollTop)} />;
}
```
