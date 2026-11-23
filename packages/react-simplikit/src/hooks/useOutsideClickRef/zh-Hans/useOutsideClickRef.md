# useOutsideClickRef

`useOutsideClickRef` 是一个返回回调 ref 的 React Hook。当点击发生在该 ref 附加到的所有元素之外时，它会调用 `onOutsideClick`。将同一个 ref 附加到触发按钮、其菜单以及 portal 内容上即可；在内部按下、在外部松开的操作不会被视为外部点击。

## 接口

```ts
function useOutsideClickRef(options: Object): (element: Element | null) => void;
```

### 参数

<Interface
  required
  name="options"
  type="Object"
  description="用于检测外部点击的选项。"
  :nested="[
    {
      name: 'options.onOutsideClick',
      type: '() => void',
      required: true,
      description:
        '当点击发生在所有已附加元素之外时执行的函数。它会在被点击元素自身的 <code>onClick</code> 之前执行。',
    },
    {
      name: 'options.enabled',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        '是否检测外部点击。为 <code>false</code> 时，不会调用 <code>onOutsideClick</code>。',
    },
  ]"
/>

### 返回值

<Interface
  name=""
  type="(element: Element | null) => void"
  description="一个回调 ref。将它传给每个应视为内部的元素，作为其 <code>ref</code> 属性。它在多次渲染之间保持引用不变。"
/>

## 示例

```tsx
import { useOutsideClickRef } from 'react-simplikit';
import { useState } from 'react';

function Dropdown({ onClose }: { onClose: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClickRef({
    enabled: open,
    onOutsideClick: () => {
      setOpen(false);
      onClose();
    },
  });

  return (
    <>
      <button ref={ref} onClick={() => setOpen(prev => !prev)}>
        Menu
      </button>
      {open && <ul ref={ref}>...</ul>}
    </>
  );
}
```
