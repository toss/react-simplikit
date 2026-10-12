# useThrottledState

`useThrottledState` 是一个管理状态并返回节流 setter 的 React Hook。
使用默认选项时，首次调用 setter 会立即生效，后续调用会根据 `throttleMs` 进行节流，
并在 trailing 时机应用最后一个待更新的值。
它适用于限制滚动等高频事件引起的状态更新频率。

首次渲染时和服务端渲染时都会原样返回初始值。挂载时不会安排更新，
因此，当 `leading: true` 时，挂载后第一次调用 setter 会立即生效。
如果 `leading` 和 `trailing` 都为 `false`，状态不会更新。

组件卸载或 `throttleMs`、`leading`、`trailing` 发生变化时，会取消待执行的更新。

## 接口

```ts
function useThrottledState<T>(
  initialValue: T,
  throttleMs: number,
  options?: ThrottleOptions
): [state: T, setState: Dispatch<SetStateAction<T>>];
```

### 参数

<Interface
  required
  name="initialValue"
  type="T"
  description="仅在首次渲染时使用的初始状态值。"
/>

<Interface
  required
  name="throttleMs"
  type="number"
  description="节流时间窗口的长度，单位为毫秒。"
/>

<Interface
  name="options"
  type="ThrottleOptions"
  description="节流行为的配置选项。"
  :nested="[
    {
      name: 'options.leading',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        '如果为 <code>true</code>，允许在节流时间窗口开始时立即更新。',
    },
    {
      name: 'options.trailing',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        '如果为 <code>true</code>，允许在延迟结束后使用最新值执行待处理的更新。',
    },
  ]"
/>

### 返回值

<Interface
  name=""
  type="[state: T, setState: Dispatch<SetStateAction<T>>]"
  description="包含以下元素的元组："
  :nested="[
    {
      name: 'state',
      type: 'T',
      required: false,
      description: '当前状态值。',
    },
    {
      name: 'setState',
      type: 'Dispatch<SetStateAction<T>>',
      required: false,
      description: '接收下一个状态值或以前一个状态为参数的更新函数的节流 setter。',
    },
  ]"
/>

## 示例

```tsx
import { useThrottledState } from 'react-simplikit';

function ScrollPosition() {
  const [scrollTop, setScrollTop] = useThrottledState(0, 200);

  return (
    <div onScroll={e => setScrollTop(e.currentTarget.scrollTop)}>
      <p>Scrolled {scrollTop}px</p>
    </div>
  );
}
```
