# Why react-simplikit matters

Among the many React-based libraries, why should you choose `react-simplikit`? Let's explore our core values and understand why using `react-simplikit` is equivalent to writing React in a React-like way.

## Declarative Interface

Instead of managing timers yourself, declare when a repeated task should run. For example, a countdown should decrease once a second while it is running and has time remaining. Pausing it or reaching zero should stop the timer.

Both examples implement the same countdown. Render `<Countdown />` in your React app and use Pause and Resume to control it. In a framework with Server Components, place the example in a Client Component (`'use client'`).

::: code-group

```tsx [without-react-simplikit.tsx]
import { useEffect, useState } from 'react';

function Countdown() {
  const [remainingSeconds, setRemainingSeconds] = useState(10);
  const [isRunning, setIsRunning] = useState(true);
  const enabled = isRunning && remainingSeconds > 0;

  useEffect(
    function startCountdown() {
      if (!enabled) {
        return;
      }

      const intervalId = setInterval(() => {
        setRemainingSeconds(seconds => Math.max(0, seconds - 1));
      }, 1000);

      return () => clearInterval(intervalId);
    },
    [enabled]
  );

  return (
    <div>
      <p>{remainingSeconds} seconds</p>
      <button
        type="button"
        disabled={remainingSeconds === 0}
        onClick={() => setIsRunning(running => !running)}
      >
        {isRunning ? 'Pause' : 'Resume'}
      </button>
    </div>
  );
}
```

```tsx [with-react-simplikit.tsx]
import { useState } from 'react';
import { useInterval } from 'react-simplikit';

function Countdown() {
  const [remainingSeconds, setRemainingSeconds] = useState(10);
  const [isRunning, setIsRunning] = useState(true);

  useInterval(
    () => {
      setRemainingSeconds(seconds => Math.max(0, seconds - 1));
    },
    {
      delay: 1000,
      enabled: isRunning && remainingSeconds > 0,
    }
  );

  return (
    <div>
      <p>{remainingSeconds} seconds</p>
      <button
        type="button"
        disabled={remainingSeconds === 0}
        onClick={() => setIsRunning(running => !running)}
      >
        {isRunning ? 'Pause' : 'Resume'}
      </button>
    </div>
  );
}
```

:::

With [useInterval](/hooks/useInterval), `enabled` declares the condition for running and `delay` declares the interval. The hook manages the timer as these options change and clears it when the component unmounts. The component only describes the behavior it needs.

## Small Bundle Size

Fast response time is crucial for web services. That's why small bundle size is very important for `react-simplikit`, a library for building web services. `react-simplikit` strives to provide the smallest possible bundle size now and in the future.

Compared to `react-use`, `react-simplikit` has up to about 89% smaller size:

|                                               | react-simplikit                                                   | react-use                                                    | Difference |
| --------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------ | ---------- |
| Unpacked Size                                 | [237 kB](https://www.npmjs.com/package/react-simplikit)           | [454 kB](https://www.npmjs.com/package/react-use)            | -47.8%     |
| Minified Size                                 | [8.7 kB](https://bundlephobia.com/package/react-simplikit@0.0.29) | [78.2 kB](https://bundlephobia.com/package/react-use@17.6.0) | -88.9%     |
| Gzipped Size                                  | [2.9 kB](https://bundlephobia.com/package/react-simplikit@0.0.29) | [22 kB](https://bundlephobia.com/package/react-use@17.6.0)   | -86.9%     |
| Average Size per Function<br/>(Minified Size) | 318.2 byte                                                        | 696.3 byte                                                   | -54.3%     |
