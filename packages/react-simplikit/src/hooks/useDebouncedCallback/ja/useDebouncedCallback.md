# useDebouncedCallback

`useDebouncedCallback` は、渡されたコールバック関数をデバウンスする React フックです。
関数の実行を遅らせ、複数の呼び出しを一度にまとめることで、イベント処理を最適化します。

`leading` と `trailing` の両方を有効にすると、関数は遅延期間の開始時と終了時の両方で呼び出されます。ただし、そのためには `debounceMs` の間に少なくとも 2 回呼び出す必要があります。デバウンスされた関数を一度呼び出すだけでは、関数が 2 回実行されることはありません。

## インターフェース

```ts
function useDebouncedCallback<T>(
  onChange: (newValue: T) => void,
  debounceMs: number,
  options?: DebounceOptions
): (nextValue: T) => void;
```

### パラメータ

<Interface
  required
  name="onChange"
  type="(newValue: T) => void"
  description="値を受け取るコールバックです。"
/>

<Interface
  required
  name="debounceMs"
  type="number"
  description="デバウンスの待機時間をミリ秒で指定します。"
/>

<Interface
  name="options"
  type="DebounceOptions"
  description="追加の動作を設定するオプションです。"
  :nested="[
    {
      name: 'options.leading',
      type: 'boolean',
      required: false,
      defaultValue: 'false',
      description:
        '<code>true</code> の場合、一連の呼び出しの開始時に関数を実行します。',
    },
    {
      name: 'options.trailing',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        '<code>true</code> の場合、一連の呼び出しの終了時に関数を実行します。',
    },
  ]"
/>

### 戻り値

<Interface
  name=""
  type="(nextValue: T) => void"
  description="値を <code>onChange</code> に渡す、デバウンスされた関数。"
/>

## 使用例

```tsx
import { useDebouncedCallback } from 'react-simplikit';
import { useState } from 'react';

function SearchInput() {
  const [query, setQuery] = useState('');
  const setQueryDebounced = useDebouncedCallback(setQuery, 300);

  return (
    <>
      <input onChange={e => setQueryDebounced(e.target.value)} />
      <p>Searching for: {query}</p>
    </>
  );
}
```
