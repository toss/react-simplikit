# 为什么选择 react-simplikit

在众多基于 React 的库当中，为什么你应该选择 `react-simplikit`？让我们一起看看我们坚持的核心价值，理解为什么使用 `react-simplikit` 就等于用 React 的方式编写 React 代码。

## 声明式接口

你可以声明重复任务的执行条件，而不必自己管理计时器。例如，倒计时只应在运行中且还有剩余时间时，每秒减少一次。暂停或归零时，计时器也应停止。

两个示例实现相同的倒计时。在 React 应用中渲染 `<Countdown />`，使用 Pause 和 Resume 按钮控制它。如果框架使用 Server Components，请将示例放在 Client Component（`'use client'`）中。

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

[useInterval](/zh-Hans/hooks/useInterval) 的 `enabled` 声明执行条件，`delay` 声明执行间隔。Hook 根据选项变化管理计时器，并在组件卸载时清理计时器。组件只需声明所需的行为。

## 更小的包体积

对 Web 服务来说，快速的响应时间至关重要。正因如此，对于用来构建 Web 服务的库 `react-simplikit` 而言，更小的包体积非常重要。`react-simplikit` 一直在努力，无论现在还是将来都提供尽可能小的包体积。

与 `react-use` 相比，`react-simplikit` 的体积最多小约 89%：

|                                          | react-simplikit                                                   | react-use                                                    | 差异   |
| ---------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------ | ------ |
| Unpacked Size                            | [237 kB](https://www.npmjs.com/package/react-simplikit)           | [454 kB](https://www.npmjs.com/package/react-use)            | -47.8% |
| Minified Size                            | [8.7 kB](https://bundlephobia.com/package/react-simplikit@0.0.29) | [78.2 kB](https://bundlephobia.com/package/react-use@17.6.0) | -88.9% |
| Gzipped Size                             | [2.9 kB](https://bundlephobia.com/package/react-simplikit@0.0.29) | [22 kB](https://bundlephobia.com/package/react-use@17.6.0)   | -86.9% |
| 每个函数的平均体积<br/>（Minified Size） | 318.2 byte                                                        | 696.3 byte                                                   | -54.3% |
