# useInterval

`useInterval` is a React hook that executes a function at a specified interval.
It is useful for timers, polling data, and other recurring tasks.

## Interface

```ts
function useInterval(options: Object): void;
```

### Parameters

<Interface
  required
  name="options"
  type="Object"
  description="Configures the interval behavior."
  :nested="[
    {
      name: 'options.onTick',
      type: '() => void',
      required: true,
      description: 'The function to be executed periodically.',
    },
    {
      name: 'options.delayMs',
      type: 'number',
      required: true,
      description: 'The interval duration in milliseconds.',
    },
    {
      name: 'options.immediate',
      type: 'boolean',
      required: false,
      defaultValue: 'false',
      description:
        'If <code>true</code>, executes immediately before starting the interval.',
    },
    {
      name: 'options.enabled',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description: 'If <code>false</code>, the interval will not run.',
    },
  ]"
/>

### Return Value

This function does not return anything.

## Example

```tsx
import { useInterval } from 'react-simplikit';
import { useState } from 'react';

function Timer() {
  const [time, setTime] = useState(0);

  useInterval({
    onTick: () => setTime(prev => prev + 1),
    delayMs: 1000,
  });

  return (
    <div>
      <p>{time} seconds</p>
    </div>
  );
}
```
