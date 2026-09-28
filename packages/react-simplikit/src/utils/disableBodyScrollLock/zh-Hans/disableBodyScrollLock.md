# disableBodyScrollLock

`disableBodyScrollLock` 是一个解除 body 滚动锁定的工具函数。它会恢复被 `enableBodyScrollLock` 锁定的滚动，并回到保存的滚动位置。

在 SSR 环境中调用是安全的（在服务端为空操作）。
未锁定时调用同样安全（空操作）。

## 接口

```ts
function disableBodyScrollLock(): void;
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
