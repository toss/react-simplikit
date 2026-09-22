# useImpressionRef

`useImpressionRef` 是一个测量特定 DOM 元素在屏幕上可见时长、并在元素进入或退出视口时执行回调 的 React Hook。它使用 `IntersectionObserver` 和 `Visibility API` 来跟踪元素的可见性。

## 接口

```ts
function useImpressionRef<Element extends HTMLElement>(
  options: UseImpressionRefOptions
): (element: Element | null) => void;
```

### 参数

<Interface
  required
  name="options"
  type="UseImpressionRefOptions"
  description="用于跟踪元素可见性的选项。"
  :nested="[
    {
      name: 'options.onImpressionStart',
      type: '() => void',
      required: false,
      description:
        '元素进入视图时执行的回调函数',
    },
    {
      name: 'options.onImpressionEnd',
      type: '() => void',
      required: false,
      description: '元素退出视图时执行的回调函数',
    },
    {
      name: 'options.timeThreshold',
      type: 'number',
      required: false,
      defaultValue: '0',
      description: '元素必须可见的最短时长（毫秒）',
    },
    {
      name: 'options.areaThreshold',
      type: 'number',
      required: false,
      defaultValue: '0',
      description: '元素必须可见的最小比例（0 到 1）',
    },
    {
      name: 'options.rootMargin',
      type: 'string',
      required: true,
      description: '用于调整检测区域的边距',
    },
  ]"
/>

### 返回值

<Interface
  name=""
  type="(element: Element | null) => void"
  description="一个用于设置元素的函数。将其附加到 <code>ref</code> 属性上，每当元素的可见性发生变化时，回调就会被执行。"
/>

## 示例

```tsx
import { useImpressionRef } from 'react-simplikit';

function Component() {
  const ref = useImpressionRef<HTMLDivElement>({
    onImpressionStart: () => console.log('Element entered view'),
    onImpressionEnd: () => console.log('Element exited view'),
    timeThreshold: 1000,
    areaThreshold: 0.5,
  });

  return <div ref={ref}>Track my visibility!</div>;
}
```
