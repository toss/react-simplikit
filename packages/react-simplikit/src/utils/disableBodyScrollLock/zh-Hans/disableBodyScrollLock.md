# disableBodyScrollLock

`disableBodyScrollLock` 是一个用于解锁 body 滚动的工具函数。它会恢复被 `enableBodyScrollLock` 锁定的滚动，并回到保存的滚动位置。在 SSR 环境中调用是安全的（在服务器上不会执行）。即使滚动未被锁定，调用它也是安全的。

## 接口

```ts
function disableBodyScrollLock(): void;
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
