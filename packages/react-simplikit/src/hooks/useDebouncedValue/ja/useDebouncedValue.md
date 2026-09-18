# useDebouncedValue

`useDebouncedValue` は、渡された値をデバウンスした値として返す React フックです。
状態は引き続き呼び出し側で管理し、このフックは戻り値がその状態に追従するタイミングだけを遅らせます。
戻り値は最後の変更から `wait` ミリ秒後に更新されるため、頻繁に変わる状態から
検索クエリやバリデーション用の入力値を得る場合に便利です。

コンポーネントのアンマウント時に、保留中の更新をキャンセルします。使用例では、
検索サービスや追加のコンポーネントを使わずに、遅れて更新されるクエリを表示しています。

初回レンダリング時とサーバー上では、値をそのまま返します。マウント時には変更を予約しないため、
`leading: true` の場合、マウント後の最初の変更は即座に反映されます。
`leading` と `trailing` が両方とも `false` の場合、戻り値は更新されません。

値は参照で比較します。レンダリングのたびに新しいオブジェクトや配列を渡すと、
戻り値が `wait` ミリ秒ごとに更新され続けます。まず `usePreservedReference` などを使って、
参照を安定させてください。

## インターフェース

```ts
function useDebouncedValue<T>(
  value: T,
  wait: number,
  options?: DebounceOptions
): T;
```

### パラメータ

<Interface
  required
  name="value"
  type="T"
  description="デバウンスする値。"
/>

<Interface
  required
  name="wait"
  type="number"
  description="最後の変更から更新まで待機する時間（ミリ秒単位）。"
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
        '<code>true</code> の場合、変更がない期間の後に起きた最初の変更を即座に反映します。',
    },
    {
      name: 'options.trailing',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        '<code>true</code> の場合、<code>wait</code> ミリ秒後に最後の変更を反映します。',
    },
  ]"
/>

### 戻り値

<Interface name="" type="T" description="デバウンスされた値。" />

## 使用例

```tsx
import { useDebouncedValue } from 'react-simplikit';
import { useState } from 'react';

function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 300);

  return (
    <>
      <label>
        Search
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <output aria-live="polite">{debouncedQuery}</output>
    </>
  );
}
```
