# useLoading

`useLoading` 是一个简化 `Promise` 加载状态管理的 React Hook。它提供一个状态来跟踪异步操作是否正在进行，并提供一个函数来自动处理加载状态。

## 接口

```ts
function useLoading(): [
  loading: boolean,
  startLoading: <T>(promise: Promise<T>) => Promise<T>,
];
```

### 参数

此函数不接受任何参数。

### 返回值

<Interface
  name=""
  type="[loading: boolean, startLoading: <T>(promise: Promise<T>) => Promise<T>]"
  description="包含以下内容的元组："
  :nested="[
    {
      name: 'loading',
      type: 'boolean',
      required: false,
      description:
        '表示当前的加载状态。初始值为 <code>false</code>。当异步任务正在进行时会被设置为 <code>true</code>。',
    },
    {
      name: 'startLoading',
      type: '<T>(promise: Promise<T>) => Promise<T>',
      required: false,
      description:
        '一个在管理加载状态的同时执行异步任务的函数。此函数接受一个 <code>Promise</code> 作为参数，并在 <code>Promise</code> 完成时自动将 <code>isLoading</code> 状态重置为 <code>false</code>。',
    },
  ]"
/>

## 示例

```tsx
function ConfirmButton() {
  const [loading, startLoading] = useLoading();

  const handleSubmit = useCallback(async () => {
    try {
      const result = await startLoading(postConfirmation());
      router.push(`/success?id=${result.id}`);
    } catch (error) {
      console.error("Error:", error);
    }
  }, [startLoading]);

  return (
    <button disabled={loading} onClick={handleSubmit}>
      {loading ? "Loading..." : "Confirm"}
    </button>
  );
}
```
