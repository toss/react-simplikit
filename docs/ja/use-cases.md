---
description: 解決したい問題に合う React ユーティリティを選ぶ
---

# 用途別の使い方

必要な動作に合う API を選び、リファレンスでパラメータとエッジケースを確認してください。使用例を試す前に [react-simplikit をインストールしてください](/ja/installation)。

## API を選ぶ

| 問題                                 | API                                                      | 提供する機能                                         |
| ------------------------------------ | -------------------------------------------------------- | ---------------------------------------------------- |
| コンテンツを表示・非表示にする       | [useToggle](/ja/hooks/useToggle)                         | 真偽値の状態とトグル関数                             |
| 入力が止まるまで待つ                 | [useDebouncedValue](/ja/hooks/useDebouncedValue)         | 入力の即時反映を保ちながら、状態のコピーを遅れて更新 |
| コールバックの呼び出しを遅らせる     | [useDebounce](/ja/hooks/useDebounce)                     | `.cancel()` メソッドを持つ呼び出し可能な関数         |
| コールバックの呼び出し頻度を制限する | [useThrottledCallback](/ja/hooks/useThrottledCallback)   | 指定した間隔で呼び出し頻度を制限するコールバック     |
| 再読み込み後も状態を保持する         | [useStorageState](/ja/hooks/useStorageState)             | ブラウザストレージに保存される状態                   |
| 要素の外側のクリックに反応する       | [useOutsideClickEffect](/ja/hooks/useOutsideClickEffect) | 外側のクリックの購読                                 |
| 入力欄をキーボードの上に保つ         | [useAvoidKeyboard](/ja/hooks/useAvoidKeyboard)           | 固定要素の位置を調整するスタイル                     |
| 子要素の間に区切りを入れる           | [Separated](/ja/components/Separated)                    | 末尾には付かない区切り                               |
| 1 つの要素に複数の ref を接続する    | [mergeRefs](/ja/utils/mergeRefs)                         | 各 ref に転送する 1 つの ref コールバック            |

## 詳細を表示・非表示にする

React アプリで `<Details />` をレンダリングしてください。ボタンを押すと、コンテンツの表示と展開状態が切り替わります。

```tsx
import { useToggle } from 'react-simplikit';

export function Details() {
  const [open, toggle] = useToggle(false);

  return (
    <section>
      <button type="button" aria-expanded={open} onClick={toggle}>
        Details
      </button>
      {open && <p>Delivery takes 3–5 days.</p>}
    </section>
  );
}
```

## 入力が止まってから絞り込む

React アプリで `<FruitSearch />` をレンダリングしてください。`ap` と入力すると入力欄はすぐに更新され、その後 300 ms 入力がなければリストに Apple が表示されます。ローカルデータを使うのでサーバーは不要です。

```tsx
import { useState } from 'react';
import { useDebouncedValue } from 'react-simplikit';

const fruits = ['Apple', 'Banana', 'Orange'];

export function FruitSearch() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 300);
  const results = fruits.filter(fruit =>
    fruit.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  return (
    <section>
      <label>
        Search fruit
        <input value={query} onChange={event => setQuery(event.target.value)} />
      </label>
      <ul aria-live="polite">
        {results.map(fruit => (
          <li key={fruit}>{fruit}</li>
        ))}
      </ul>
    </section>
  );
}
```

レンダリングに使う値が必要なら [useDebouncedValue](/ja/hooks/useDebouncedValue) を使ってください。イベントからコールバックを予約するなら [useDebounce](/ja/hooks/useDebounce) を使ってください。デバウンス自体が重い計算を速くするわけではありません。

## SSR とクリーンアップ

- フックは React コンポーネントまたはカスタムフックのトップレベルで呼び出してください。Server Components を使うフレームワークでは、これらの対話的な使用例を Client Component（`'use client'`）に配置してください。

- `useDebouncedValue` はサーバーと初回レンダリングで渡された値をそのまま返します。サーバーとクライアントには同じ初期値を渡し、その値を作るためにレンダリング中に `window` やストレージを読み取らないでください。

- `useStorageState` はサーバースナップショットと hydration に `defaultValue` を使い、その後クライアントでブラウザストレージを読み取ります。アンマウント時にストレージのリスナーを解除します。

- `useDebounce` はアンマウント時やデバウンスのインスタンスが変わったときに保留中の呼び出しをキャンセルします。開始済みのネットワークリクエストはキャンセルしないため、リクエストの中止や古いレスポンスの処理はアプリケーション側で行う必要があります。

- ブラウザの測定値はマウント後に変わることがあります。初期値とプラットフォームの制約は [モバイル Web](/ja/mobile-web) と各 API のリファレンスで確認してください。

## 次のステップ

他のツールは [API リファレンス一覧](/ja/reference) で探せます。エージェントが同じドキュメントを見つけられるように [AI 連携](/ja/ai-integration) を設定することもできます。
