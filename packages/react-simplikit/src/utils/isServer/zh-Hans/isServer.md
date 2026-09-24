# isServer

`isServer` 是一个判断当前代码是否运行在服务端的工具函数。在 `window` 未定义的 SSR（服务端渲染）环境中返回 `true`，在客户端环境中返回 `false`。

## 接口

```ts
function isServer(): boolean;
```

### 参数

此函数不接受任何参数。

### 返回值

<Interface
  name=""
  type="boolean"
  description="在服务端环境（SSR）中运行时返回 <code>true</code>，否则返回 <code>false</code>。"
/>

## 示例

```tsx
if (isServer()) {
  // SSR-safe code
  return null;
}

// Client-only code
window.addEventListener('resize', handleResize);
```
