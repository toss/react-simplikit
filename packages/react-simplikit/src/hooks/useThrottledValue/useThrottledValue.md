# useThrottledValue

`useThrottledValue` is a React hook that returns a throttled copy of the given value. The caller keeps owning the state; the returned value follows it at most once per `wait` milliseconds, which is useful for driving expensive renders from scroll position, pointer position, or resize size.

On the first render and on the server the value is returned as is. A change is never scheduled on mount, so the first change after mount is applied immediately when `leading` is `true`. If both `leading` and `trailing` are `false`, the returned value never updates.

## Interface

```ts
function useThrottledValue<T>(
  value: T,
  wait: number,
  options: ThrottleOptions
): T;
```

### Parameters

<Interface
  required
  name="value"
  type="T"
  description="The value to throttle."
/>

<Interface
  required
  name="wait"
  type="number"
  description="The length of the throttle window in milliseconds."
/>

<Interface
  name="options"
  type="ThrottleOptions"
  description="Configuration options for throttle behavior."
  :nested="[
    {
      name: 'options.leading',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        'If <code>true</code>, the first change in a window is applied immediately.',
    },
    {
      name: 'options.trailing',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        'If <code>true</code>, the last change in a window is applied when the window ends.',
    },
  ]"
/>

### Return Value

<Interface name="" type="T" description="throttled value." />

## Example

```tsx
import { useThrottledValue } from 'react-simplikit';
import { useState } from 'react';

function ScrollProgress() {
  const [scrollY, setScrollY] = useState(0);
  const throttledScrollY = useThrottledValue(scrollY, 100);

  return (
    <div onScroll={e => setScrollY(e.currentTarget.scrollTop)}>
      <ProgressBar position={throttledScrollY} />
    </div>
  );
}
```
