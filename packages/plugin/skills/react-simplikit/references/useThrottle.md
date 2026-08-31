# useThrottle

`useThrottle` is a React hook that creates a throttled version of a callback function. This is useful for limiting the rate at which a function can be called, such as when handling scroll or resize events.

## Interface

```ts
function useThrottle<F extends (...args: any[]) => any>(
  callback: F,
  wait: number,
  options: { edges?: Array<'leading' | 'trailing'> }
): F & { cancel: () => void };
```

### Parameters

<Interface
  required
  name="callback"
  type="F"
  description="The function to be throttled."
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
        'An optional array specifying whether the function should be invoked on the leading edge, trailing edge, or both.',
    },
  ]"
/>

### Return Value

<Interface
  name=""
  type="F & { cancel: () => void }"
  description="Returns the throttled function with a <code>cancel</code> method to cancel pending executions."
/>

## Example

```tsx
const throttledScroll = useThrottle(
  () => {
    console.log('Scroll event');
  },
  200,
  { edges: ['leading', 'trailing'] }
);

useEffect(() => {
  window.addEventListener('scroll', throttledScroll);
  return () => {
    window.removeEventListener('scroll', throttledScroll);
    throttledScroll.cancel();
  };
}, [throttledScroll]);
```
