# useOutsideClickEffect

`useOutsideClickEffect` 是一个在点击事件发生于指定容器之外时触发回调的 React Hook。它适用于在点击外部时关闭模态框、下拉菜单、工具提示以及其他 UI 组件。如果要将多个元素视为内部，又不想把每个元素都保存在状态中，可以使用 [`useOutsideClickRef`](/zh-Hans/hooks/useOutsideClickRef)，它会返回一个可附加到所有这些元素上的 ref。

## 接口

```ts
function useOutsideClickEffect(
  container: HTMLElement | (HTMLElement | null)[] | null,
  callback: () => void
): void;
```

### 参数

<Interface
  required
  name="container"
  type="HTMLElement | (HTMLElement | null)[] | null"
  description="单个 HTML 元素、包含 HTML 元素或 <code>null</code> 的数组，或 <code>null</code>。数组中的 <code>null</code> 会被忽略。如果没有剩余的 HTML 元素，则不执行回调。"
/>

<Interface
  required
  name="callback"
  type="() => void"
  description="当点击发生于指定容器之外时执行的函数。"
/>

### 返回值

此函数不返回任何值。

## 示例

```tsx
import { useOutsideClickEffect } from 'react-simplikit';
import { useState } from 'react';

function Example() {
  const [wrapperEl, setWrapperEl] = useState<HTMLDivElement | null>(null);

  useOutsideClickEffect(wrapperEl, () => {
    console.log('Outside clicked!');
  });

  return <div ref={setWrapperEl}>Content</div>;
}
```
