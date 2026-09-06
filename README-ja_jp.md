![react-simplikit](./public/images/og.png)

# react-simplikit &middot; [![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/toss/react-simplikit/blob/main/LICENSE) [![codecov](https://codecov.io/gh/toss/react-simplikit/graph/badge.svg?token=RHVOZ3J3TU)](https://codecov.io/gh/toss/react-simplikit) [![Discord Badge](https://discord.com/api/guilds/1281071127052943361/widget.png?style=shield)](https://discord.gg/vGXbVjP2nY)

[English](./README.md) | [한국어](./README-ko_kr.md) | 日本語 | [简体中文](./README-zh_hans.md) | [Español](./README-es.md)

堅牢なアプリケーションを構築するための、軽量で依存関係のない React ユーティリティ集です。

## パッケージ

| パッケージ                                    | 説明                                                                                                                                     | バージョン                                                                                                                |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| [react-simplikit](./packages/react-simplikit) | React のフック、コンポーネント、ユーティリティ: 状態とロジック、ブラウザイベント、モバイル Web（キーボード、セーフエリア、ビューポート） | [![npm](https://img.shields.io/npm/v/react-simplikit.svg)](https://www.npmjs.com/package/react-simplikit)                 |
| [react-simplikit-codemod](./packages/codemod) | `react-simplikit` のアップグレードに合わせてコードベースを書き換える codemod                                                             | [![npm](https://img.shields.io/npm/v/react-simplikit-codemod.svg)](https://www.npmjs.com/package/react-simplikit-codemod) |

## 特長

- **依存関係ゼロ** - 非常に軽量
- **100% TypeScript** - 完全な型安全性
- **100% テストカバレッジ** - 信頼性と安定性
- **SSR 安全** - Next.js などの SSR フレームワークで動作
- **ツリーシェイキング対応** - 使用するものだけがバンドルされる

## インストール

```bash
npm install react-simplikit
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

### 固定要素をオンスクリーンキーボードの上に保つ

```tsx
import { useAvoidKeyboard } from 'react-simplikit';

function ChatInput() {
  const { style } = useAvoidKeyboard();

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, ...style }}>
      <input type="text" placeholder="メッセージを入力..." />
    </div>
  );
}
```

## ドキュメント

詳しいドキュメントは [react-simplikit.slash.page](https://react-simplikit.slash.page/ja) をご覧ください。

## リポジトリ構成

```
packages/
├── react-simplikit/    # ライブラリ本体
├── codemod/            # react-simplikit-codemod
└── plugin/             # AI コーディングアシスタント向けのエージェントスキル
```

## 貢献ガイド

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
