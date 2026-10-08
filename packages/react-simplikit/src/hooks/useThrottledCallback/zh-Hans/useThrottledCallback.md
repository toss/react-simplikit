# useThrottledCallback

`useThrottledCallback` 是一个返回所提供回调函数节流版本的 React Hook。节流后的回调在指定的时间间隔内最多只会被调用一次。

## 接口

```ts
function useThrottledCallback<T>(options: Object): (nextValue: T) => void;
```

### 参数

<Interface
  required
  name="options"
  type="Object"
  description="选项对象。"
  :nested="[
    {
      name: 'options.onChange',
      type: '(newValue: T) => void',
      required: true,
      description:
        '要被节流的回调。携带与上一次转发的值相同的调用会被跳过。',
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
        '如果为 <code>true</code>，则允许待执行的调用在延迟结束后以最新值运行。',
    },
  ]"
/>

### 返回值

<Interface
  name=""
  type="(nextValue: T) => void"
  description="一个节流后的函数，在每次时间间隔内至多将值转发给 <code>onChange</code> 一次。"
/>

## 示例

```tsx
import { useThrottledCallback } from 'react-simplikit';
import { useState } from 'react';

function ScrollPosition() {
  const [scrollTop, setScrollTop] = useState(0);
  const setScrollTopThrottled = useThrottledCallback({
    onChange: setScrollTop,
    throttleMs: 200,
  });

  return (
    <div onScroll={e => setScrollTopThrottled(e.currentTarget.scrollTop)}>
      <p>Scrolled {scrollTop}px</p>
    </div>
  );
}
```
