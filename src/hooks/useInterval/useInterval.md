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

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">callback</span
    ><span class="post-parameters--required">required</span> ·
    <span class="post-parameters--type">() =&gt; void</span>
    <br />
    <p class="post-parameters--description">
      The function to be executed periodically.
    </p>
  </li>
</ul>
<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">options</span
    ><span class="post-parameters--required">required</span> ·
    <span class="post-parameters--type"
      >number | { delay: number; enabled?: boolean; immediate?: boolean }</span
    >
    <br />
    <p class="post-parameters--description">
      Configures the interval behavior.
    </p>
    <ul class="post-parameters-ul">
      <li class="post-parameters-li">
        <span class="post-parameters--name">options.delay</span
        ><span class="post-parameters--required">required</span> ·
        <span class="post-parameters--type">number</span>
        <br />
        <p class="post-parameters--description">
          The interval duration in milliseconds. If <code>null</code>, the
          interval will not run.
        </p>
      </li>
      <li class="post-parameters-li">
        <span class="post-parameters--name">options.immediate</span
        ><span class="post-parameters--type">boolean</span> ·
        <span class="post-parameters--default">false</span>
        <br />
        <p class="post-parameters--description">
          If <code>true</code>, executes immediately before starting the
          interval.
        </p>
      </li>
      <li class="post-parameters-li">
        <span class="post-parameters--name">options.enabled</span
        ><span class="post-parameters--type">boolean</span> ·
        <span class="post-parameters--default">true</span>
        <br />
        <p class="post-parameters--description">
          If <code>false</code>, the interval will not run.
        </p>
      </li>
    </ul>
  </li>
</ul>

### Return Value

This hook does not return anything.

## Example

```tsx
import { useInterval } from 'react-simplikit';

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

You can control the execution by setting `enabled` to `false`.

```tsx
import { useInterval } from 'react-simplikit';

function StopWatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useInterval(
    () => {
      setTime(prev => prev + 1);
    },
    {
      delay: 1000,
      enabled: isRunning,
    }
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
import { useInterval } from 'react-simplikit';

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
