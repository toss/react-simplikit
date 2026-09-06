# react-simplikit

[![npm version](https://img.shields.io/npm/v/react-simplikit.svg)](https://www.npmjs.com/package/react-simplikit)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/toss/react-simplikit/blob/main/LICENSE)
[![codecov](https://codecov.io/gh/toss/react-simplikit/graph/badge.svg?token=RHVOZ3J3TU)](https://codecov.io/gh/toss/react-simplikit)

[English](./README.md) | [한국어](./README-ko_kr.md) | 日本語 | [简体中文](./README-zh_hans.md) | [Español](./README-es.md)

フック、コンポーネント、ユーティリティを提供する、軽量で依存関係のない React ユーティリティライブラリです。

## 特長

- **依存関係ゼロ** - 非常に軽量
- **100% TypeScript** - 完全な型安全性
- **100% テストカバレッジ** - 信頼性と安定性
- **SSR 安全** - Next.js などの SSR フレームワークで動作
- **ツリーシェイキング対応** - 使用するものだけがバンドルされる

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

- **フック** — 状態とロジック（`useToggle`、`useDebounce`、`useList` など）、ブラウザイベント（`useIntersectionObserver`、`useOutsideClickEffect` など）、モバイル Web（`useAvoidKeyboard`、`useSafeAreaInset`、`useVisualViewport` など）
- **コンポーネント** — `SwitchCase`、`Separated`、`ImpressionArea`
- **ユーティリティ** — `buildContext`、`mergeProps`、`mergeRefs`、および `isIOS` や `getKeyboardHeight` のようなモバイル Web 向けヘルパー

1 行の説明付きの全リストは[リファレンスページ](https://react-simplikit.slash.page/ja/reference.html)にあります。

## ドキュメント

詳しいドキュメントは [react-simplikit.slash.page](https://react-simplikit.slash.page/ja) をご覧ください。

## 貢献ガイド

貢献を歓迎します！[貢献ガイド](https://github.com/toss/react-simplikit/blob/main/.github/CONTRIBUTING.md) をご確認ください。

## ライセンス

MIT © Viva Republica, Inc. 詳しくは [LICENSE](https://github.com/toss/react-simplikit/blob/main/LICENSE) を参照してください。
