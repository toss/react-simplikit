# useThrottledCallback

`useThrottledCallback` 是一个返回所提供回调函数节流版本的 React Hook。节流后的回调在指定的时间间隔内最多只会被调用一次。节流函数接收与 `callback` 相同的参数，在延迟结束后执行的调用会使用最近一次调用的参数。

当组件卸载，或 `throttleMs`、`leading`、`trailing` 发生变化时，待执行的调用会被取消。调用 `.cancel()` 只会取消待执行的调用，不会停止 `callback` 已经开始的工作。`.cancel()` 之后的下一次调用会开始新的时间间隔，因此当 `leading` 为 `true` 时会立即执行。

## 接口

```ts
function useThrottledCallback<F extends (...args: any[]) => unknown>(
  options: Object
): ((...args: Parameters<F>) => void) & { cancel: () => void };
```

### 参数

<Interface
  required
  name="options"
  type="Object"
  description="选项对象。"
  :nested="[
    {
      name: 'options.callback',
      type: 'F',
      required: true,
      description: '要被节流的函数。',
    },
    {
      name: 'options.throttleMs',
      type: 'number',
      required: true,
      description: '将调用节流到的毫秒数。',
    },
    {
      name: 'options.leading',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        '如果为 <code>true</code>，则允许在节流时间窗口开始时立即调用。',
    },
    {
      name: 'options.trailing',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        '如果为 <code>true</code>，则允许待执行的调用在延迟结束后以最新参数运行。',
    },
  ]"
/>

### 返回值

<Interface
  name=""
  type="((...args: Parameters<F>) => void) & { cancel: () => void }"
  description="一个接收与 <code>callback</code> 相同参数的节流函数。它还包含一个用于取消待执行节流调用的 <code>cancel</code> 方法。"
/>

## 示例

```tsx
import { useThrottledCallback } from 'react-simplikit';
import { useState } from 'react';

function ScrollPosition() {
  const [scrollTop, setScrollTop] = useState(0);
  const setScrollTopThrottled = useThrottledCallback({
    callback: setScrollTop,
    throttleMs: 200,
  });

  return (
    <div onScroll={e => setScrollTopThrottled(e.currentTarget.scrollTop)}>
      <p>Scrolled {scrollTop}px</p>
    </div>
  );
}
```
