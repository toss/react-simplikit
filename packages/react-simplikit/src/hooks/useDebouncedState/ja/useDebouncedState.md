# useDebouncedState

`useDebouncedState` は、状態を管理し、デバウンスされたセッターを返す React フックです。デフォルトの設定では、最後にセッターを呼び出してから `debounceMs` ミリ秒後に状態が更新されます。検索入力のように更新リクエストが連続して発生する場合に、最後の値だけを反映するのに便利です。

初回レンダリング時とサーバー上では、初期値をそのまま返します。マウント時には更新を予約しないため、`leading: true` の場合、マウント後の最初のセッター呼び出しが即座に反映されます。`leading` と `trailing` が両方とも `false` の場合、状態は更新されません。

コンポーネントがアンマウントされたとき、または `debounceMs`、`leading`、`trailing` が変更されたときは、保留中の更新がキャンセルされます。

## インターフェース

```ts
function useDebouncedState<T>(
  initialValue: T,
  debounceMs: number,
  options?: DebounceOptions
): [state: T, setState: (nextValue: T) => void];
```

### パラメータ

<Interface
  required
  name="initialValue"
  type="T"
  description="初回レンダリング時にのみ使用する初期状態の値。"
/>

<Interface
  required
  name="debounceMs"
  type="number"
  description="最後のセッター呼び出しから更新までの待機時間（ミリ秒）。"
/>

<Interface
  name="options"
  type="DebounceOptions"
  description="デバウンス動作の設定オプション。"
  :nested="[
    {
      name: 'options.leading',
      type: 'boolean',
      required: false,
      defaultValue: 'false',
      description:
        '<code>true</code> の場合、アイドル期間後の最初のセッター呼び出しが即座に反映されます。',
    },
    {
      name: 'options.trailing',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        '<code>true</code> の場合、<code>debounceMs</code> ミリ秒後に最後の値が反映されます。',
    },
  ]"
/>

### 戻り値

<Interface
  name=""
  type="[state: T, setState: (nextValue: T) => void]"
  description="以下の要素を持つタプル："
  :nested="[
    {
      name: 'state',
      type: 'T',
      required: false,
      description: '現在の状態の値。',
    },
    {
      name: 'setState',
      type: '(nextValue: T) => void',
      required: false,
      description: '次の状態の値を受け取る、デバウンスされたセッター。',
    },
  ]"
/>

## 使用例

```tsx
import { useDebouncedState } from 'react-simplikit';

function SearchInput() {
  const [query, setQuery] = useDebouncedState('', 300);

  return (
    <>
      <label>
        Search
        <input onChange={event => setQuery(event.target.value)} />
      </label>
      <output aria-live="polite">{query}</output>
    </>
  );
}
```
