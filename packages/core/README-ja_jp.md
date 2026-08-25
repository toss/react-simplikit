# react-simplikit

[![npm version](https://img.shields.io/npm/v/react-simplikit.svg)](https://www.npmjs.com/package/react-simplikit)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/toss/react-simplikit/blob/main/LICENSE)
[![codecov](https://codecov.io/gh/toss/react-simplikit/graph/badge.svg?token=RHVOZ3J3TU)](https://codecov.io/gh/toss/react-simplikit)

[English](./README.md) | [한국어](./README-ko_kr.md) | 日本語

フック、コンポーネント、ユーティリティを提供する、軽量で依存関係のない React ユーティリティライブラリです。

## 特長

- **依存関係ゼロ** - 非常に軽量
- **100% TypeScript** - 完全な型安全性
- **100% テストカバレッジ** - 信頼性と安定性
- **SSR 安全** - Next.js などの SSR フレームワークで動作
- **ツリーシェイキング対応** - 使用するものだけがバンドルされる

## ライブラリの方針

**react-simplikit は現在、純粋な状態/ロジック用フックのみを提供する Universal Hook Library として維持されています。**

react-simplikit は、Web とモバイル（React Native など）の両方でシームレスに動作する**プラットフォームに依存しないフック**に焦点を絞る方向へと再編を進めています。

### 維持されるもの: 純粋な状態/ロジック用フック

特定のプラットフォーム API に依存しないフックは、引き続き積極的にメンテナンスされます。

- `useToggle`、`useBooleanState`、`useCounter` のような状態管理フック
- `usePrevious` のようなライフサイクルフック
- `useDebounce`、`useThrottle` のようなユーティリティフック
- これらの既存の純粋なロジックフックについては、**後方互換性（BC）が維持されます**

### 非推奨となったもの: ブラウザ/プラットフォームに依存するフック

ブラウザ固有の API に強く依存する以下のフックは、非推奨となりました。

- `useGeolocation` - `navigator.geolocation` に依存
- `useStorageState` - `localStorage`/`sessionStorage` に依存
- `useIntersectionObserver` - `IntersectionObserver` API に依存
- `useImpressionRef` - `IntersectionObserver` + Visibility API に依存
- `useDoubleClick`、`useLongPress` - DOM イベント + `window.setTimeout` に依存
- `useOutsideClickEffect` - DOM イベント + `document` に依存
- `useVisibilityEvent` - `document.visibilityState` に依存

これらのフックは:

- 新機能の追加や大きな改善は行われません
- ドキュメント上で `@deprecated` と明記されます
- 将来のメジャーバージョンで削除される可能性があります

### パッケージのステータス

- react-simplikit は**アーカイブされません**
- 純粋な状態/ロジック用フックは引き続きメンテナンスされます
- 重大なバグ修正と最小限のメンテナンスは継続します
- 新しいブラウザ/プラットフォーム依存のフックは追加されません

## インストール

```bash
npm install react-simplikit
# or
yarn add react-simplikit
# or
pnpm add react-simplikit
```

## クイックスタート

```tsx
import { useState } from 'react';
import { useDebounce } from 'react-simplikit';

function SearchInput() {
  const [query, setQuery] = useState('');

  const debouncedSearch = useDebounce((value: string) => {
    // 実際の API 呼び出し
    searchAPI(value);
  }, 300);

  return (
    <input
      value={query}
      onChange={e => {
        setQuery(e.target.value);
        debouncedSearch(e.target.value);
      }}
      placeholder="検索キーワードを入力"
    />
  );
}
```

デバウンスされた関数は `.cancel()` を提供し、コンポーネントがアンマウントされると保留中の呼び出しは自動的にキャンセルされます。

## 提供している機能

### Hooks

| Hook                      | 説明                                                          |
| ------------------------- | ------------------------------------------------------------- |
| `useBooleanState`         | ハンドラー付きで boolean の状態を管理                         |
| `useDebounce`             | コールバック関数をデバウンス                                  |
| `useDebouncedCallback`    | オプションオブジェクトで `onChange` コールバックをデバウンス  |
| `useInterval`             | 宣言的にインターバルを設定                                    |
| `useIntersectionObserver` | 要素の可視性を監視                                            |
| `usePreservedCallback`    | 安定したコールバック参照                                      |
| `usePreservedReference`   | 安定したオブジェクト参照                                      |
| ...                       | [すべてのフックを見る](https://react-simplikit.slash.page/ja) |

### Components

| Component        | 説明                                   |
| ---------------- | -------------------------------------- |
| `SwitchCase`     | 宣言的な switch-case レンダリング      |
| `Separated`      | 区切り要素付きでアイテムをレンダリング |
| `ImpressionArea` | 要素の表示（インプレッション）を追跡   |

### Utilities

| Utility        | 説明                                                    |
| -------------- | ------------------------------------------------------- |
| `buildContext` | 定型コードを減らして React Context を定義               |
| `mergeProps`   | `className`、`style`、イベントを合成して props をマージ |
| `mergeRefs`    | 複数の ref を 1 つの ref にまとめる                     |

## ドキュメント

詳しいドキュメントは [react-simplikit.slash.page](https://react-simplikit.slash.page/ja) をご覧ください。

## 関連パッケージ

- [@react-simplikit/mobile](https://www.npmjs.com/package/@react-simplikit/mobile) - モバイル Web ユーティリティ

## 貢献

貢献を歓迎します！[貢献ガイド](https://github.com/toss/react-simplikit/blob/main/CONTRIBUTING.md) をご確認ください。

## ライセンス

MIT © Viva Republica, Inc. 詳しくは [LICENSE](https://github.com/toss/react-simplikit/blob/main/LICENSE) を参照してください。
