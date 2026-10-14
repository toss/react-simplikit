# useIsomorphicLayoutEffect

`useIsomorphicLayoutEffect` 是一个 React Hook，它在浏览器中运行 `useLayoutEffect`，同时避免在服务端渲染（SSR）期间触发其警告。在 SSR 期间，没有 DOM 可供同步测量或变更，因此在 React 18 及更早版本中，使用 `useLayoutEffect` 会触发警告。React 不会在服务端运行 effect，因此 effect 只会在浏览器中运行。此 Hook 只负责避免警告，不会让服务端输出与客户端保持一致。React 19 不再发出该警告，因此在 React 19 中可以直接使用 `useLayoutEffect`。

在浏览器中，它会在 DOM 更新之后、绘制之前同步运行，因此非常适合：

- 在渲染后测量 DOM 元素
- 在绘制前应用 DOM 变更
- 防止 UI 闪烁或布局偏移

## 接口

```ts
function useIsomorphicLayoutEffect(
  effect: React.EffectCallback,
  deps?: React.DependencyList
): void;
```

### 参数

<Interface
  required
  name="effect"
  type="React.EffectCallback"
  description="effect 函数。"
/>

<Interface
  name="deps"
  type="React.DependencyList"
  description="可选的依赖数组。"
/>

### 返回值

此函数不返回任何值。

## 示例

```tsx
useIsomorphicLayoutEffect(() => {
  // 在客户端布局阶段执行的代码
}, [dep1, dep2, ...]);
```
