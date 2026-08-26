![react-simplikit](./public/images/og.png)

# react-simplikit &middot; [![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/toss/react-simplikit/blob/main/LICENSE) [![codecov](https://codecov.io/gh/toss/react-simplikit/graph/badge.svg?token=RHVOZ3J3TU)](https://codecov.io/gh/toss/react-simplikit) [![Discord Badge](https://discord.com/api/guilds/1281071127052943361/widget.png?style=shield)](https://discord.gg/vGXbVjP2nY)

[English](./README.md) | [한국어](./README-ko_kr.md) | 日本語

堅牢なアプリケーションを構築するための、軽量で依存関係のない React ユーティリティ集です。

## パッケージ

| パッケージ                                    | 説明                                                                          | バージョン                                                                                                                |
| --------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| [react-simplikit](./packages/react-simplikit) | Universal hooks - 純粋な状態/ロジック用フック（プラットフォームに依存しない） | [![npm](https://img.shields.io/npm/v/react-simplikit.svg)](https://www.npmjs.com/package/react-simplikit)                 |
| [@react-simplikit/mobile](./packages/mobile)  | モバイル Web ユーティリティ（viewport、keyboard、scroll）                     | [![npm](https://img.shields.io/npm/v/@react-simplikit/mobile.svg)](https://www.npmjs.com/package/@react-simplikit/mobile) |

> **注記**: `react-simplikit` は現在、Web とモバイル（React Native）の両方で動作する純粋な状態/ロジック用フックのみを提供する Universal Hook Library として維持されています。ブラウザ/プラットフォームに依存するフックは非推奨です。詳しくは [packages/react-simplikit/README-ja_jp.md](./packages/react-simplikit/README-ja_jp.md) を参照してください。

## 特長

- **依存関係ゼロ** - 非常に軽量
- **100% TypeScript** - 完全な型安全性
- **100% テストカバレッジ** - 信頼性と安定性
- **SSR 安全** - Next.js などの SSR フレームワークで動作
- **ツリーシェイキング対応** - 使用するものだけがバンドルされる

## インストール

```bash
# Core utilities
npm install react-simplikit

# Mobile web utilities
npm install @react-simplikit/mobile
```

## クイックスタート

### react-simplikit

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

### @react-simplikit/mobile

```tsx
import { useAvoidKeyboard, useBodyScrollLock } from '@react-simplikit/mobile';

function ChatInput() {
  const { style } = useAvoidKeyboard();

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, ...style }}>
      <input type="text" placeholder="メッセージを入力..." />
    </div>
  );
}

// `useBodyScrollLock` はコンポーネントがマウントされている間 body のスクロールをロックし、
// アンマウント時に自動的に解除します。モーダルが開いている間だけレンダリングしてください。
function BodyScrollLock() {
  useBodyScrollLock();
  return null;
}
```

## ドキュメント

詳しいドキュメントは [react-simplikit.slash.page](https://react-simplikit.slash.page/ja) をご覧ください。

## リポジトリ構成

```
packages/
├── core/    # react-simplikit (hooks, components, utils)
└── mobile/  # @react-simplikit/mobile (mobile web utilities)
```

## 貢献

どなたからの貢献も歓迎します！貢献ガイドをご確認ください。

[CONTRIBUTING](./.github/CONTRIBUTING.md)

## ライセンス

MIT © Viva Republica, Inc. 詳しくは [LICENSE](./LICENSE) を参照してください。

<a title="Toss" href="https://toss.im">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://static.toss.im/logos/png/4x/logo-toss-reverse.png">
    <img alt="Toss" src="https://static.toss.im/logos/png/4x/logo-toss.png" width="100">
  </picture>
</a>
