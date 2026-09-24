# enableBodyScrollLock

`enableBodyScrollLock` 是一个锁定 body 滚动的工具函数。它通过应用固定定位来阻止 body 滚动。在打开模态框、抽屉或其他覆盖层组件时非常有用。可以安全地在 SSR 环境中调用（在服务器上不会生效）。多次调用也不会产生额外效果，直到解锁为止。

## 接口

```ts
function enableBodyScrollLock(): void;
```

### 参数

此函数不接受任何参数。

### 返回值

<Interface name="" type="void" description="" />

## 示例

```tsx
// 模态框打开时
enableBodyScrollLock();

// 模态框关闭时
disableBodyScrollLock();
```
