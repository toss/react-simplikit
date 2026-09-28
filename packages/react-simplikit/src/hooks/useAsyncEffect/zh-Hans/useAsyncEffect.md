# useAsyncEffect

`useAsyncEffect` 是一个用于在 React 组件中处理异步副作用的 Hook。它遵循与 `useEffect` 相同的清理模式，同时确保异步操作被安全处理。

## 接口

```ts
function useAsyncEffect(
  effect: () => Promise<void | (() => void)>,
  deps?: DependencyList
): void;
```

### 参数

<Interface
  required
  name="effect"
  type="() => Promise<void | (() => void)>"
  description="在 <code>useEffect</code> 模式中执行的异步函数。此函数可以选择性地返回一个清理函数。"
/>

<Interface
  name="deps"
  type="DependencyList"
  description="依赖数组。每当数组中的任何值发生变化时，effect 都会重新运行。如果省略，则会在组件的每次渲染后运行。"
/>

### 返回值

此函数不返回任何值。

## 示例

```tsx
useAsyncEffect(async () => {
  const data = await fetchData();
  setData(data);

  return () => {
    console.log('Cleanup on unmount or dependencies change');
  };
}, [dependencies]);
```
