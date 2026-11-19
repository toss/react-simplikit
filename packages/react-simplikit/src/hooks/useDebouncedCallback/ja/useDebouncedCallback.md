# useDebouncedCallback

`useDebouncedCallback` は、渡されたコールバック関数をデバウンスする React フックです。
関数の実行を遅らせ、複数の呼び出しを一度にまとめることで、イベント処理を最適化します。
デバウンスされた関数は `callback` と同じ引数を受け取り、最後の呼び出しの引数をそのまま渡します。

`leading` と `trailing` の両方を有効にすると、関数は遅延期間の開始時と終了時の両方で呼び出されます。ただし、そのためには `debounceMs` の間に少なくとも 2 回呼び出す必要があります。デバウンスされた関数を一度呼び出すだけでは、関数が 2 回実行されることはありません。

コンポーネントのアンマウント時、または `debounceMs`、`leading`、`trailing` の変更時には、実行待ちの呼び出しをキャンセルします。
`.cancel()` は実行待ちの呼び出しだけをキャンセルし、`callback` がすでに開始した処理は止めません。
`.cancel()` の後の次の呼び出しは新しい一連の呼び出しとして始まるため、`leading` が `true` の場合はすぐに実行されます。

## インターフェース

```ts
function useDebouncedCallback<F extends (...args: any[]) => unknown>(
  options: Object
): ((...args: Parameters<F>) => void) & { cancel: () => void };
```

### パラメータ

<Interface
  required
  name="options"
  type="Object"
  description="オプションオブジェクト。"
  :nested="[
    {
      name: 'options.callback',
      type: 'F',
      required: true,
      description: 'デバウンスする関数です。',
    },
    {
      name: 'options.debounceMs',
      type: 'number',
      required: true,
      description:
        '関数の実行を遅らせる時間（ミリ秒単位）。',
    },
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
  type="((...args: Parameters<F>) => void) & { cancel: () => void }"
  description="<code>callback</code> と同じ引数を受け取る、デバウンスされた関数です。実行待ちのデバウンス処理をキャンセルする <code>cancel</code> メソッドも含みます。"
/>

## 使用例

```tsx
import { useDebouncedCallback } from 'react-simplikit';
import { useState } from 'react';

function SearchInput() {
  const [query, setQuery] = useState('');
  const setQueryDebounced = useDebouncedCallback({
    callback: setQuery,
    debounceMs: 300,
  });

  return (
    <>
      <input onChange={e => setQueryDebounced(e.target.value)} />
      <button type="button" onClick={() => setQueryDebounced.cancel()}>
        Cancel pending update
      </button>
      <p>Searching for: {query}</p>
    </>
  );
}
```
