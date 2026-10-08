# useTimeout

`useTimeout` 是一个在指定延迟后执行回调函数的 React Hook。它按照 React 生命周期来管理 `setTimeout`，确保在卸载时或依赖变化时执行清理。

## 接口

```ts
function useTimeout(options: Object): void;
```

### 参数

<Interface
  required
  name="options"
  type="Object"
  description="配置超时的行为。"
  :nested="[
    {
      name: 'options.onTimeout',
      type: '() => void',
      required: true,
      description: '在延迟之后要执行的函数。',
    },
    {
      name: 'options.delayMs',
      type: 'number',
      required: false,
      defaultValue: '0',
      description: '执行 <code>onTimeout</code> 之前要等待的毫秒数。',
    },
  ]"
/>

### 返回值

此函数不返回任何值。

## 示例

```tsx
// 延迟后更新标题
import { useTimeout } from 'react-simplikit';
import { useState } from 'react';

function Example() {
  const [title, setTitle] = useState('');

  useTimeout({
    onTimeout: () => setTitle('Searching for products...'),
    delayMs: 2000,
  });

  useTimeout({
    onTimeout: () => setTitle('Almost done...'),
    delayMs: 4000,
  });

  return <div>{title}</div>;
}
```
