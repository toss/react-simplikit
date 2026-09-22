# useTimeout

`useTimeout` 是一个在指定延迟后执行回调函数 的 React Hook。它按照 React 生命周期来管理 `setTimeout`，确保在卸载时或依赖变化时执行清理。

## 接口

```ts
function useTimeout(callback: () => void, delay: number = 0): void;
```

### 参数

<Interface
  required
  name="callback"
  type="() => void"
  description="在延迟之后要执行的函数。"
/>

<Interface
  name="delay"
  type="number"
  description="执行回调之前要等待的毫秒数。"
/>

### 返回值

此函数不返回任何值。

## 示例

```tsx
// Updating a title after a delay
import { useTimeout } from 'react-simplikit';
import { useState } from 'react';

function Example() {
  const [title, setTitle] = useState('');

  useTimeout(() => {
    setTitle('Searching for products...');
  }, 2000);

  useTimeout(() => {
    setTitle('Almost done...');
  }, 4000);

  return <div>{title}</div>;
}
```
