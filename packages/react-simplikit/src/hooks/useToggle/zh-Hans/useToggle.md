# useToggle

`useToggle` 是一个简化布尔状态管理的 React Hook。它提供函数在 `true` 和 `false` 之间切换状态。

## 接口

```ts
function useToggle(
  initialValue: boolean = false
): [state: boolean, toggle: () => void];
```

### 参数

<Interface
  name="initialValue"
  type="boolean"
  description="初始状态值。默认值为 <code>false</code>。"
/>

### 返回值

<Interface
  name=""
  type="[state: boolean, toggle: () => void]"
  description="元组："
  :nested="[
    {
      name: 'state',
      type: 'boolean',
      required: false,
      description: '当前的状态值。',
    },
    {
      name: 'toggle',
      type: '() => void',
      required: false,
      description: '切换状态的函数。',
    },
  ]"
/>

## 示例

```tsx
import { useToggle } from 'react-simplikit';

function Component() {
  const [open, toggle] = useToggle(false);

  return (
    <div>
      <p>Bottom Sheet state: {open ? 'opened' : 'closed'}</p>
      <button onClick={toggle}>Toggle</button>
    </div>
  );
}
```