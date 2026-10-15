# useStorageState

`useStorageState` は、`useState` と同様に動作し、状態の値をブラウザーのストレージに永続化する React フックです。
ページを再読み込みしても値が保持され、`localStorage` を使う場合はタブ間で共有できます。

`serializer` と `deserializer` を渡さない場合、値は JSON として保存されるため、内側まですべて JSON にシリアライズできる必要があります。値のどこかに `Date`、`Map`、クラスのインスタンス、関数があると、値を設定したときにエラーになります。`defaultValue` はマウント時に検査されます。ほかの型を保存するには、両方の関数を渡してください。ストレージから読み戻した文字列は検証しません。

## インターフェース

```ts
function useStorageState<T>(
  key: string,
  options?: Object
): readonly [state: T | undefined, actions: StorageStateActions<T | undefined>];
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
      type: '(value: T) => string',
      required: false,
      description: '値を文字列に変換する関数。<code>deserializer</code> と一緒に渡します。',
    },
    {
      name: 'options.deserializer',
      type: '(value: string) => T',
      required: false,
      description: '保存された文字列を値に戻す関数。<code>serializer</code> と一緒に渡します。',
    },
  ]"
/>

### 戻り値

<Interface
  name=""
  type="readonly [state: T | undefined, actions: StorageStateActions<T | undefined>]"
  description="状態と、状態を変更するアクションを含むタプル。"
  :nested="[
    {
      name: 'state',
      type: 'T | undefined',
      required: false,
      description: 'ストレージから取得した現在の状態の値。<code>defaultValue</code> を渡した場合は <code>T</code> です。',
    },
    {
      name: 'actions.setValue',
      type: '(value: SetStateAction<T | undefined>) => void',
      required: false,
      description: '状態を更新し、永続化する関数。',
    },
    {
      name: 'actions.refresh',
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
  const [count, { setValue }] = useStorageState('counter', {
    defaultValue: 0,
  });

  return (
    <button onClick={() => setValue(prev => prev + 1)}>Count: {count}</button>
  );
}
```
