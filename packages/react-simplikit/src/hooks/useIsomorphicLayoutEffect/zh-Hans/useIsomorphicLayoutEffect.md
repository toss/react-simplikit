# useIsomorphicLayoutEffect

`useIsomorphicLayoutEffect` 是一个提供 `useLayoutEffect` 行为、同时避免在服务端渲染期间触发警告 的 React Hook。在 SSR 期间，没有 DOM 可供同步测量或变更，因此 React 会对使用 `useLayoutEffect` 发出警告。

此 Hook 在 DOM 更新之后、绘制之前同步运行，因此非常适合：

- 在渲染后测量 DOM 元素
- 在绘制前应用 DOM 变更
- 防止 UI 闪烁或布局偏移
- 同时安全地支持客户端和服务端环境

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
  // Code to be executed during the layout phase on the client side
}, [dep1, dep2, ...]);
```
