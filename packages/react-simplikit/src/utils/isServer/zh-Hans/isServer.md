# isServer

`isServer` 是一个用于检查代码是否在服务器上运行的工具函数。在 `window` 未定义的 SSR（服务器端渲染）环境中，它返回 `true`；在客户端环境中，它返回 `false`。

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
  description="如果在服务器环境（SSR）中运行，则返回 <code>true</code>，否则返回 <code>false</code>。"/>

## 示例

```tsx
if (isServer()) {
  // SSR 安全的代码
  return null;
}

// 仅在客户端运行的代码
window.addEventListener('resize', handleResize);
```
