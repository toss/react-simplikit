# useIntersectionObserver

`useIntersectionObserver` 是一个检测特定 DOM 元素是否在屏幕上可见 的 React Hook。它使用 `IntersectionObserver` API，在元素进入或退出视口时执行回调。

## 接口

```ts
function useIntersectionObserver<Element extends HTMLElement>(
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit,
): (element: Element | null) => void;
```

### 参数

<Interface
  required
  name="callback"
  type="(entry: IntersectionObserverEntry) => void"
  description="元素可见性发生变化时执行的回调函数。你可以检查 <code>entry.isIntersecting</code> 来判断元素是否在视图中。"
/>

<Interface
  required
  name="options"
  type="IntersectionObserverInit"
  description="用于 <code>IntersectionObserver</code> 的选项。"
  :nested="[
    {
      name: 'options.root',
      type: 'Element | Document | null',
      required: false,
      description:
        '用作检查目标可见性视口的元素。',
    },
    {
      name: 'options.rootMargin',
      type: 'string',
      required: false,
      description: '根元素周围的边距。',
    },
    {
      name: 'options.threshold',
      type: 'number | number[]',
      required: false,
      description:
        '可以是单个数字或数字数组，表示在目标可见性达到百分之多少时，observer 的回调应被执行。',
    },
  ]"
/>

### 返回值

<Interface
  name=""
  type="(element: Element | null) => void"
  description="一个用于设置元素的函数。将其附加到 <code>ref</code> 属性上，每当元素的可见性发生变化时，<code>callback</code> 就会被执行。"
/>

## 示例

```tsx
import { useIntersectionObserver } from "react-simplikit";

function Component() {
  const ref = useIntersectionObserver<HTMLDivElement>(
    (entry) => {
      if (entry.isIntersecting) {
        console.log("Element is in view:", entry.target);
      } else {
        console.log("Element is out of view:", entry.target);
      }
    },
    { threshold: 0.5 },
  );

  return <div ref={ref}>Observe me!</div>;
}
```
