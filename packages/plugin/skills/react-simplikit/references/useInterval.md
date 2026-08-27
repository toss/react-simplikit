# useInterval

`useInterval` is a React hook that executes a function at a specified interval. It is useful for timers, polling data, and other recurring tasks.

## Interface

```ts
function useInterval(
  callback: () => void,
  options: number | { delay: number; enabled?: boolean; immediate?: boolean }
): void;
```

### Parameters

<Interface
  required
  name="callback"
  type="() => void"
  description="The function to be executed periodically."
/>

<Interface
  required
  name="options"
  type="number | { delay: number; enabled?: boolean; immediate?: boolean }"
  description="Configures the interval behavior."
  :nested="[
    {
      name: 'options.delay',
      type: 'number',
      description:
        'The interval duration in milliseconds. If <code>null</code>, the interval will not run.',
    },
    {
      name: 'options.immediate',
      type: 'boolean',
      defaultValue: 'false',
      description:
        'If <code>true</code>, executes immediately before starting the interval.',
    },
    {
      name: 'options.enabled',
      type: 'boolean',
      defaultValue: 'true',
      description: 'If <code>false</code>, the interval will not run.',
    },
  ]"
/>

### Return Value

This hook does not return anything.

## Example

```tsx
import { useInterval } from 'react-simplikit';
import { useState } from 'react';

function Timer() {
  const [time, setTime] = useState(0);

  useInterval(() => {
    setTime(prev => prev + 1);
  }, 1000);

  return (
    <div>
      <p>{time} seconds</p>
    </div>
  );
}
```
