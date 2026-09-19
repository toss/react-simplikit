# usePreservedCallback

`usePreservedCallback` 是一个维持回调函数稳定引用、同时确保它始终能访问最新状态或 props 的 React Hook。这可以避免不必要的重复渲染，并在将回调传给子组件或处理事件监听器时简化依赖管理。

## 接口

```ts
function usePreservedCallback<
  Arguments extends any[] = any[],
  ReturnValue = unknown,
>(callback: (...args: any[]) => any): (...args: any[]) => any;
```

### 参数

<Interface
  required
  name="callback"
  type="(...args: any[]) => any"
  description="要保留的函数。即使在组件重复渲染时，它也始终引用最新的状态或 props。"
/>

### 返回值

<Interface
  name=""
  type="(...args: any[]) => any"
  description="一个与输入回调具有相同签名的函数。返回的函数维持稳定引用，同时访问最新的状态或 props。"
/>

## 示例

```tsx
import { usePreservedCallback } from 'react-simplikit';
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = usePreservedCallback(() => {
    console.log(`Current count: ${count}`);
    setCount(prev => prev + 1);
  });

  return <button onClick={handleClick}>Click me</button>;
}
```