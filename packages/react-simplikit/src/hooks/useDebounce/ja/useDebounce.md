# useDebounce

`useDebounce` は、渡されたコールバック関数をデバウンスする React フックです。
関数の実行を遅らせ、複数の呼び出しを一度にまとめることで、イベント処理を最適化します。

デフォルトのオプションでは、最後の呼び出しから `wait` ミリ秒の間に次の呼び出しがなければ、その最後の呼び出しが実行されます。
コンポーネントのアンマウント時、または `wait`、`leading`、`trailing` の変更時には、実行待ちの呼び出しをキャンセルします。
`.cancel()` がキャンセルするのは実行待ちのコールバックだけで、すでに開始されたネットワークリクエストはキャンセルしません。
使用例では、クエリをローカルに表示しています。サーバーで検索するには、アプリケーションの
検索用コールバックを `useDebounce` の第 1 引数に渡してください。

## インターフェース

```ts
function useDebounce<F extends (...args: any[]) => unknown>(
  callback: F,
  wait: number,
  options?: DebounceOptions
): F & { cancel: () => void };
```

### パラメータ

<Interface
  required
  name="callback"
  type="F"
  description="デバウンスする関数。"
/>

<Interface
  required
  name="wait"
  type="number"
  description="関数の実行を遅らせる時間（ミリ秒単位）。"
/>

<Interface
  name="options"
  type="DebounceOptions"
  description="デバウンスの動作を設定するオプション。"
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
  type="F & { cancel: () => void }"
  description="コールバックの呼び出しを遅らせる、デバウンスされた関数です。実行待ちのデバウンス処理をキャンセルする <code>cancel</code> メソッドも含みます。"
/>

## 使用例

```tsx
import { useState } from 'react';
import { useDebounce } from 'react-simplikit';

export function SearchInput() {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const debouncedSearch = useDebounce(setSubmittedQuery, 300);

  return (
    <section>
      <label>
        Search
        <input
          value={query}
          onChange={event => {
            setQuery(event.target.value);
            debouncedSearch(event.target.value);
          }}
        />
      </label>
      <output aria-live="polite">{submittedQuery}</output>
      <button type="button" onClick={() => debouncedSearch.cancel()}>
        Cancel pending update
      </button>
    </section>
  );
}
```
