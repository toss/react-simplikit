# useThrottledCallback

`useThrottledCallback` 是一个返回所提供回调函数节流版本的 React Hook。节流后的回调在指定的时间间隔内最多只会被调用一次。

## 接口

```ts
function useThrottledCallback<T>(
  onChange: (newValue: T) => void,
  throttleMs: number,
  options?: ThrottleOptions
): (nextValue: T) => void;
```

### 参数

<Interface
  required
  name="onChange"
  type="(newValue: T) => void"
  description="接收值的回调函数。"
/>

<Interface
  required
  name="throttleMs"
  type="number"
  description="节流间隔，单位为毫秒。"
/>

<Interface
  name="options"
  type="ThrottleOptions"
  description="配置其他行为的选项。"
  :nested="[
    {
      name: 'options.edges',
      type: 'Array<\'leading\' | \'trailing\'>',
      required: false,
      defaultValue: '[\'leading\', \'trailing\']',
      description:
        '一个可选的数组，用于指定应在领先边缘、落后边缘或两者处调用该函数。',
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
  const setScrollTopThrottled = useThrottledCallback(setScrollTop, 200);

  return (
    <div onScroll={e => setScrollTopThrottled(e.currentTarget.scrollTop)}>
      <p>Scrolled {scrollTop}px</p>
    </div>
  );
}
```
