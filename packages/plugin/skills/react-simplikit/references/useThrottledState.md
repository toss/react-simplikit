# useThrottledState

`useThrottledState` is a React hook that manages state and returns a throttled setter.
With the default options, the first setter call is applied immediately, and subsequent calls
are throttled using `throttleMs`, with the last pending value applied on the trailing edge.
It is useful for limiting state updates from frequent events, such as scrolling.

The initial value is returned as is on the first render and on the server. No update is scheduled
on mount, so with `leading: true` the first setter call after mount is applied immediately.
If both `leading` and `trailing` are `false`, the state never updates.

Pending updates are cancelled when the component unmounts or when `throttleMs`, `leading`, or
`trailing` changes.

## Interface

```ts
function useThrottledState<T>(
  initialValue: T,
  throttleMs: number,
  options?: ThrottleOptions
): [state: T, setState: (nextValue: T) => void];
```

### Parameters

<Interface
  required
  name="initialValue"
  type="T"
  description="The initial state value, used only on the first render."
/>

<Interface
  required
  name="throttleMs"
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
        'If <code>true</code>, allows an immediate update at the start of a throttle window.',
    },
    {
      name: 'options.trailing',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        'If <code>true</code>, allows a pending update to run after the delay with the latest value.',
    },
  ]"
/>

### Return Value

<Interface
  name=""
  type="[state: T, setState: (nextValue: T) => void]"
  description="A tuple:"
  :nested="[
    {
      name: 'state',
      type: 'T',
      required: false,
      description: 'The current state value.',
    },
    {
      name: 'setState',
      type: '(nextValue: T) => void',
      required: false,
      description: 'A throttled setter that accepts the next state value.',
    },
  ]"
/>

## Example

```tsx
import { useThrottledState } from 'react-simplikit';

function ScrollPosition() {
  const [scrollTop, setScrollTop] = useThrottledState(0, 200);

  return (
    <div onScroll={e => setScrollTop(e.currentTarget.scrollTop)}>
      <p>Scrolled {scrollTop}px</p>
    </div>
  );
}
```
