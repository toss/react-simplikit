# useAsyncEffect

`useAsyncEffect` は、React コンポーネントで非同期の副作用を扱うための React フックです。
`useEffect` と同じクリーンアップのパターンに従いながら、非同期処理を安全に扱います。

## インターフェース

```ts
function useAsyncEffect(
  effect: () => Promise<void | (() => void)>,
  deps?: DependencyList
): void;
```

### パラメータ

<Interface
  required
  name="effect"
  type="() => Promise<void | (() => void)>"
  description="<code>useEffect</code> と同じパターンで実行される非同期関数です。必要に応じてクリーンアップ関数を返せます。"
/>

<Interface
  name="deps"
  type="DependencyList"
  description="依存配列です。配列内のいずれかの値が変わるたびに、エフェクトを再実行します。省略した場合は、コンポーネントがレンダリングされるたびに実行します。"
/>

### 戻り値

この関数は値を返しません。

## 使用例

```tsx
useAsyncEffect(async () => {
  const data = await fetchData();
  setData(data);

  return () => {
    console.log('Cleanup on unmount or dependencies change');
  };
}, [dependencies]);
```
