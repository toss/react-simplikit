# useStorageState

`useStorageState` は、`useState` と同様に動作し、状態の値をブラウザーのストレージに永続化する React フックです。
ページを再読み込みしても値が保持され、`localStorage` を使う場合はタブ間で共有できます。

## インターフェース

```ts
function useStorageState<T>(
  key: string,
  options?: Object
): readonly [
  state: Serializable<T> | undefined,
  setState: (value: SetStateAction<Serializable<T> | undefined>) => void,
  refreshState: () => void,
];
```

### パラメータ

<Interface
  required
  name="key"
  type="string"
  description="ストレージに値を保存するためのキー。"
/>

<Interface
  name="options"
  type="Object"
  description="ストレージの動作を設定するオプション。"
  :nested="[
    {
      name: 'options.storage',
      type: 'Storage',
      required: false,
      defaultValue: 'localStorage',
      description:
        'ストレージの種類（<code>localStorage</code> または <code>sessionStorage</code>）。デフォルトは <code>localStorage</code> です。',
    },
    {
      name: 'options.defaultValue',
      type: 'T',
      required: false,
      description: '保存済みの値がない場合の初期値。',
    },
    {
      name: 'options.serializer',
      type: 'Function',
      required: false,
      description: '状態の値を文字列にシリアライズする関数。',
    },
    {
      name: 'options.deserializer',
      type: 'Function',
      required: false,
      description: '文字列から状態の値をデシリアライズする関数。',
    },
  ]"
/>

### 戻り値

<Interface
  name=""
  type="readonly [state: Serializable<T> | undefined, setState: (value: SetStateAction<Serializable<T> | undefined>) => void, refreshState: () => void]"
  description="次の要素を含むタプル。"
  :nested="[
    {
      name: 'state',
      type: 'Serializable<T> | undefined',
      required: false,
      description: 'ストレージから取得した現在の状態の値。',
    },
    {
      name: 'setState',
      type: '(value: SetStateAction<Serializable<T> | undefined>) => void',
      required: false,
      description: '状態を更新し、永続化する関数。',
    },
    {
      name: 'refreshState',
      type: '() => void',
      required: false,
      description: 'ストレージから状態を再取得する関数。',
    },
  ]"
/>

## 使用例

```tsx
// 状態を永続化するカウンター
import { useStorageState } from 'react-simplikit';

function Counter() {
  const [count, setCount] = useStorageState<number>('counter', {
    defaultValue: 0,
  });

  return (
    <button onClick={() => setCount(prev => prev + 1)}>Count: {count}</button>
  );
}
```
