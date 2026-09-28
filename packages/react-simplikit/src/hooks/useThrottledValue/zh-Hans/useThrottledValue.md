# useThrottledValue

`useThrottledValue` 是一个返回所给值节流副本的 React Hook。调用方始终拥有该状态；返回值每 `wait` 毫秒至多跟随一次，这适用于用滚动位置、指针位置或元素在调整大小时的尺寸来驱动昂贵的渲染。

在首次渲染时和服务端，该值会原样返回。挂载时永远不会安排变化，因此当 `leading` 为 `true` 时，挂载后的第一次变化会被立即应用。如果 `leading` 和 `trailing` 都为 `false`，返回值永远不会更新。

该值通过引用进行比较。如果每次渲染都传入新的对象或数组，返回值会每 `wait` 毫秒更新一次；请先稳定引用，例如使用 `usePreservedReference`。

## 接口

```ts
function useThrottledValue<T>(
  value: T,
  wait: number,
  options?: ThrottleOptions
): T;
```

### 参数

<Interface
  required
  name="value"
  type="T"
  description="要被节流的值。"
/>

<Interface
  required
  name="wait"
  type="number"
  description="节流窗口的长度，以毫秒为单位。"
/>

<Interface
  name="options"
  type="ThrottleOptions"
  description="用于节流行为的配置选项。"
  :nested="[
    {
      name: 'options.leading',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        '如果为 <code>true</code>，窗口内的第一次变化会被立即应用。',
    },
    {
      name: 'options.trailing',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        '如果为 <code>true</code>，窗口内的最后一次变化会在变化后 <code>wait</code> 毫秒应用。',
    },
  ]"
/>

### 返回值

<Interface name="" type="T" description="节流后的值。" />

## 示例

```tsx
import { useThrottledValue } from 'react-simplikit';
import { useState } from 'react';

function ScrollProgress() {
  const [scrollY, setScrollY] = useState(0);
  const throttledScrollY = useThrottledValue(scrollY, 100);

  return (
    <div onScroll={e => setScrollY(e.currentTarget.scrollTop)}>
      <ProgressBar position={throttledScrollY} />
    </div>
  );
}
```
