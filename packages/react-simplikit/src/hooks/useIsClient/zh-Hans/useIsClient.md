# useIsClient

`useIsClient` 是一个仅在客户端环境中返回 `true` 的 React Hook。它主要用于区分客户端渲染和服务端渲染（SSR）。只有当组件挂载到客户端环境中后，该状态才会被设置为 `true`。

## 接口

```ts
function useIsClient(): boolean;
```

### 参数

此函数不接受任何参数。

### 返回值

<Interface
  name=""
  type="boolean"
  description="在客户端环境中返回 <code>true</code>，否则返回 <code>false</code>。"
/>

## 示例

```tsx
function ClientSideContent() {
  const isClient = useIsClient();

  if (!isClient) {
    return <div>Loading...</div>; // Rendered on the server side
  }

  return <div>Client-side rendered content</div>; // Rendered on the client side
}
```

```tsx
function ClientOnlyMap() {
  const isClient = useIsClient();

  if (!isClient) return null;

  return <div id="map" />;
}
```

```tsx
function ClientTheme() {
  const isClient = useIsClient();

  const theme = isClient ? localStorage.getItem('theme') : 'light';

  return <div>Current theme: {theme}</div>;
}
```
