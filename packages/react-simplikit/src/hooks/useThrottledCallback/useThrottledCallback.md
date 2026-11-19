# useThrottledCallback

`useThrottledCallback` is a React hook that returns a throttled version of the provided callback function.
The throttled callback will only be invoked at most once per specified interval.
The throttled function takes the same arguments as `callback`, and a trailing call uses the arguments from the latest call.

Pending calls are cancelled when the component unmounts or when `throttleMs`, `leading`, or `trailing` changes.
Calling `.cancel()` only cancels a pending call; it does not stop work that `callback` has already started.
The next call after `.cancel()` starts a new window, so it runs immediately when `leading` is `true`.

## Interface

```ts
function useThrottledCallback<F extends (...args: any[]) => unknown>(
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
      description: 'The function to throttle.',
    },
    {
      name: 'options.throttleMs',
      type: 'number',
      required: true,
      description: 'The number of milliseconds to throttle invocations to.',
    },
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
  type="((...args: Parameters<F>) => void) & { cancel: () => void }"
  description="A throttled function that takes the same arguments as <code>callback</code>. It also includes a <code>cancel</code> method to cancel any pending throttled execution."
/>

## Example

```tsx
import { useThrottledCallback } from 'react-simplikit';
import { useState } from 'react';

function ScrollPosition() {
  const [scrollTop, setScrollTop] = useState(0);
  const setScrollTopThrottled = useThrottledCallback({
    callback: setScrollTop,
    throttleMs: 200,
  });

  return (
    <div onScroll={e => setScrollTopThrottled(e.currentTarget.scrollTop)}>
      <p>Scrolled {scrollTop}px</p>
    </div>
  );
}
```
