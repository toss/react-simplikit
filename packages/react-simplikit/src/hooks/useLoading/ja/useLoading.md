# useLoading

`useLoading` は、`Promise` の読み込み状態の管理を簡単にする React フックです。
非同期処理が進行中かどうかを追跡する状態と、読み込み状態を自動的に管理する関数を提供します。

## インターフェース

```ts
function useLoading(): [
  loading: boolean,
  startLoading: <T>(promise: Promise<T>) => Promise<T>,
];
```

### パラメータ

この関数はパラメータを受け取りません。

### 戻り値

<Interface
  name=""
  type="[loading: boolean, startLoading: <T>(promise: Promise<T>) => Promise<T>]"
  description="次の要素を含むタプルです。"
  :nested="[
    {
      name: 'loading',
      type: 'boolean',
      required: false,
      description:
        '現在の読み込み状態を表します。初期値は <code>false</code> です。非同期処理の実行中は <code>true</code> になります。',
    },
    {
      name: 'startLoading',
      type: '<T>(promise: Promise<T>) => Promise<T>',
      required: false,
      description:
        '読み込み状態を管理しながら非同期処理を実行する関数です。引数として <code>Promise</code> を受け取り、<code>Promise</code> が完了すると、<code>isLoading</code> の状態を自動的に <code>false</code> に戻します。',
    },
  ]"
/>

## 使用例

```tsx
function ConfirmButton() {
  const [loading, startLoading] = useLoading();

  const handleSubmit = useCallback(async () => {
    try {
      const result = await startLoading(postConfirmation());
      router.push(`/success?id=${result.id}`);
    } catch (error) {
      console.error('Error:', error);
    }
  }, [startLoading]);

  return (
    <button disabled={loading} onClick={handleSubmit}>
      {loading ? 'Loading...' : 'Confirm'}
    </button>
  );
}
```
