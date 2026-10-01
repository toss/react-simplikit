# useThrottledCallback

`useThrottledCallback` is a React hook that returns a throttled version of the provided callback function.
The throttled callback will only be invoked at most once per specified interval.

## Interface

```ts
function useThrottledCallback<T>(
  onChange: (newValue: T) => void,
  throttleMs: number,
  options?: ThrottleOptions
): (nextValue: T) => void;
```

### Parameters

<Interface
  required
  name="onChange"
  type="(newValue: T) => void"
  description="The callback to throttle. A call with the same value as the last forwarded one is skipped."
/>

<Interface
  required
  name="throttleMs"
  type="number"
  description="The throttle interval in milliseconds."
/>

<Interface
  name="options"
  type="ThrottleOptions"
  description="Optional edge behavior."
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
  type="(nextValue: T) => void"
  description="A throttled function that forwards the value to <code>onChange</code> at most once per interval."
/>

## Example

```tsx
import { useThrottledCallback } from 'react-simplikit';
import { useState } from 'react';

function ScrollPosition() {
  const [scrollTop, setScrollTop] = useState(0);
  const setScrollTopThrottled = useThrottledCallback(setScrollTop, 200);

  return (
    <div onScroll={e => setScrollTopThrottled(e.currentTarget.scrollTop)}>
      <p>Scrolled {scrollTop}px</p>
    </div>
  );
}
```
