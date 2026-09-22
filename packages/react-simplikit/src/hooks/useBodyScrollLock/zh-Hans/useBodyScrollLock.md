# useBodyScrollLock

`useBodyScrollLock` 是一个在组件挂载期间锁定 body 滚动 的 React Hook。它会在挂载时自动锁定，并在卸载时自动解锁。它适用于模态框和抽屉等覆盖层组件，这些组件必须防止其后的页面滚动。

## 接口

```ts
function useBodyScrollLock(): void;
```

### 参数

此函数不接受任何参数。

### 返回值

此函数不返回任何值。

## 示例

### 基本用法

```tsx
function Modal() {
  useBodyScrollLock();
  return <div className="modal">Modal content</div>;
}
```

### 多个模态框 - 单一锁定模式

```tsx
// Lock once at the parent level instead of in every overlapping modal
function BodyScrollLock() {
  useBodyScrollLock();
  return null;
}

function App() {
  const hasModal = showModal1 || showModal2;

  return (
    <>
      {hasModal && <BodyScrollLock />}
      {showModal1 && <Modal1 />}
      {showModal2 && <Modal2 />}
    </>
  );
}
```

## 备注

- **SSR 安全性**：锁定是在 `useEffect` 内应用的，该 effect 只在客户端运行，因此此 Hook 在服务端渲染期间是安全的。
- **自动清理**：当组件卸载时，锁会被释放。
- **多个模态框**：当多个模态框重叠时，应在父级锁定一次，而不是在每个模态框中分别锁定，以避免冲突并保持行为一致。
- **锁定方式**：`enableBodyScrollLock` 将 `body` 固定在原位（`position: fixed` 配合 `overflow: hidden`），并将滚动位置保存在 data 属性中；`disableBodyScrollLock` 会移除这些样式并恢复位置。
