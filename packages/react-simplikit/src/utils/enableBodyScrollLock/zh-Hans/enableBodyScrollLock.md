# enableBodyScrollLock

`enableBodyScrollLock` 是一个锁定 body 滚动的工具函数。它通过应用固定定位来阻止 body 滚动，在打开模态框、抽屉或其他覆盖层组件时很有用。

在 SSR 环境中调用是安全的（在服务端为空操作）。
在解除锁定之前，重复调用不会产生额外效果。

## 接口

```ts
function enableBodyScrollLock(): void;
```

### 参数

此函数不接受任何参数。

### 返回值

此函数不返回任何值。

## 示例

```tsx
// When modal opens
enableBodyScrollLock();

// When modal closes
disableBodyScrollLock();
```
