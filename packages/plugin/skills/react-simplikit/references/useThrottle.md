# useThrottle

`useThrottle` is a React hook that creates a throttled version of a callback function.
This is useful for limiting the rate at which a function can be called,
such as when handling scroll or resize events.

## Interface

```ts
function useThrottle<F extends (...args: any[]) => any>(
  callback: F,
  wait: number,
  options?: ThrottleOptions
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
  type="ThrottleOptions"
  description="Options to control the behavior of the throttle."
  :nested="[
    {
      name: 'options.leading',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        'If <code>true</code>, allows an immediate call at the start of a throttle window.',
    },
    {
      name: 'options.trailing',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        'If <code>true</code>, allows a pending call to run after the delay with the latest arguments.',
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
  { leading: true, trailing: true }
);

useEffect(() => {
  window.addEventListener('scroll', throttledScroll);
  return () => {
    window.removeEventListener('scroll', throttledScroll);
    throttledScroll.cancel();
  };
}, [throttledScroll]);
```
