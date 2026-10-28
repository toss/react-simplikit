# useThrottledCallback

`useThrottledCallback` is a React hook that returns a throttled version of the provided callback function.
The throttled callback will only be invoked at most once per specified interval.

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
        'If <code>true</code>, allows a pending call to run after the delay with the latest value.',
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
  const setScrollTopThrottled = useThrottledCallback({
    onChange: setScrollTop,
    throttleMs: 200,
  });

  return (
    <div onScroll={e => setScrollTopThrottled(e.currentTarget.scrollTop)}>
      <p>Scrolled {scrollTop}px</p>
    </div>
  );
}
```
