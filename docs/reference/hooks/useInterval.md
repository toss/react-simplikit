# useInterval

`useInterval` is a React hook that executes a function periodically.

## Interface

```ts
type IntervalOptions =
  | number
  | {
      delay: number | null;
      enabled?: boolean;
      trailing?: boolean;
    };

function useInterval(callback: () => void, options: IntervalOptions): void;
```

### Parameters

- `callback` (`() => void`): The function to be executed periodically.
- `options` (`IntervalOptions`): Configure the interval timing and behavior.
  - `delay` (`number | null`): The interval duration in milliseconds. When null, the interval won't be executed.
  - `trailing` (`boolean`): When true, waits for the first delay before execution. When false, executes immediately.
  - `enabled` (`boolean`): When false, the interval won't be executed.

### Returns

This hook doesn't return any value.

## Examples

### Basic Usage

```tsx
import { useInterval } from 'reactie';

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

### Stopwatch

You can control the execution by setting `delay` to `null` or `enabled` to `false`.

```tsx
import { useInterval } from 'reactie';

function StopWatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useInterval(
    () => {
      setTime(prev => prev + 1);
    },
    isRunning ? 1000 : null
  );

  return (
    <div>
      <p>{time} seconds</p>
      <button onClick={() => setIsRunning(prev => !prev)}>{isRunning ? 'Stop' : 'Start'}</button>
    </div>
  );
}
```

### Polling Data Updates

Set `trailing` to `false` to execute the callback immediately and then periodically.

```tsx
import { useInterval } from 'reactie';

function PollingExample() {
  const [data, setData] = useState<string>(null);

  useInterval(
    async () => {
      const data = await getData();
      setData(data);
    },
    {
      delay: 3000,
      trailing: false, // Execute immediately and then every 3 seconds
    }
  );

  return <div>{data}</div>;
}
```
