# useThrottledCallback

`useThrottledCallback` is a React hook that returns a throttled version of the provided callback function. The throttled callback will only be invoked at most once per specified interval.

## Interface

```ts
function useThrottledCallback<T>(options: Object): (nextValue: T) => void;
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
      type: '(newValue: T) => void',
      required: true,
      description:
        'The callback to throttle. A call with the same value as the last forwarded one is skipped.',
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
  type="(nextValue: T) => void"
  description="throttled function that forwards the value to <code>onChange</code> at most once per interval."
/>

## Example

```tsx
import { useThrottledCallback } from 'react-simplikit';
import { useState } from 'react';

function ScrollPosition() {
  const [scrollTop, setScrollTop] = useState(0);
  const setScrollTopThrottled = useThrottledCallback({
    onChange: setScrollTop,
    timeThreshold: 200,
  });

  return (
    <div onScroll={e => setScrollTopThrottled(e.currentTarget.scrollTop)}>
      <p>Scrolled {scrollTop}px</p>
    </div>
  );
}
```
