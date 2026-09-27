# useInterval

`useInterval` 是一个按指定时间间隔执行函数的 React Hook。它适用于计时器、轮询数据以及其他周期性任务。

## 接口

```ts
function useInterval(
  callback: () => void,
  options: number | { delay: number; enabled?: boolean; immediate?: boolean }
): void;
```

### 参数

<Interface
  required
  name="callback"
  type="() => void"
  description="要周期性执行的函数。"
/>

<Interface
  required
  name="options"
  type="number | { delay: number; enabled?: boolean; immediate?: boolean }"
  description="配置时间间隔的行为。"
  :nested="[
    {
      name: 'options.delay',
      type: 'number',
      required: true,
      description:
        '间隔的时长，单位为毫秒。如果为 <code>null</code>，则不会运行。',
    },
    {
      name: 'options.immediate',
      type: 'boolean',
      required: false,
      defaultValue: 'false',
      description:
        '如果为 <code>true</code>，则会在启动间隔之前立即执行一次。',
    },
    {
      name: 'options.enabled',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description: '若为 <code>false</code>，则不会执行该 interval。',
    },
  ]"
/>

### 返回值

此函数不返回任何值。

## 示例

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
