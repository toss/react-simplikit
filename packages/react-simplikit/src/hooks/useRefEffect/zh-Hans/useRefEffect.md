# useRefEffect

`useRefEffect` 是一个帮助你为特定 DOM 元素设置引用、并在元素变化时执行回调的 React Hook。此 Hook 会在元素变化时调用清理函数，以防止内存泄漏。

## 接口

```ts
function useRefEffect<RefElement extends HTMLElement = HTMLElement>(
  callback: (element: RefElement) => CleanupCallback | void,
  deps: DependencyList
): (element: RefElement | null) => void;
```

### 参数

<Interface
  required
  name="callback"
  type="(element: RefElement) => CleanupCallback | void"
  description="在元素被设置时执行的回调函数。此函数可以返回一个清理函数。"
/>

<Interface
  required
  name="deps"
  type="DependencyList"
  description="一个定义回调何时应重新执行的依赖数组。每当 <code>deps</code> 变化时，<code>callback</code> 会重新执行。"
/>

### 返回值

<Interface
  name=""
  type="(element: RefElement | null) => void"
  description="一个用于设置元素的函数。将此函数传给 <code>ref</code> 属性，每当元素变化时就会调用 <code>callback</code>。"
/>

## 示例

```tsx
import { useRefEffect } from 'react-simplikit';

function Component() {
  const ref = useRefEffect<HTMLDivElement>(element => {
    console.log('Element mounted:', element);

    return () => {
      console.log('Element unmounted:', element);
    };
  }, []);

  return <div ref={ref}>Basic Example</div>;
}
```
