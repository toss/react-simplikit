# @react-simplikit/mobile

[![npm version](https://img.shields.io/npm/v/@react-simplikit/mobile.svg)](https://www.npmjs.com/package/@react-simplikit/mobile)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/toss/react-simplikit/blob/main/LICENSE)

[English](./README.md) | [한국어](./README-ko_kr.md) | 日本語

iOS Safari と Android Chrome の viewport、キーボード、レイアウトの問題を解決する React 向けモバイル Web ユーティリティです。

## なぜ必要なのか

モバイル Web 開発は難しいものです。iOS Safari と Android Chrome には、以下のような問題を引き起こす癖があります。

- キーボードが開いたときの viewport の高さの変化
- モーダルでの body スクロールの問題
- Safe area inset の処理
- Visual viewport の不整合

`@react-simplikit/mobile` は、こうしたよくある問題に対する実績のある解決策を提供します。

## 特長

- **キーボード処理** - 仮想キーボードによってコンテンツが隠れるのを防ぐ
- **Body scroll lock** - モーダルでの背景スクロールを防ぐ
- **Visual viewport** - 実際に見える領域を追跡
- **Safe area** - ノッチとホームインジケーターを処理
- **端末の検出** - iOS、Android、ブラウザの種類を検出
- **SSR 安全** - Next.js などの SSR フレームワークで動作

## インストール

```bash
npm install @react-simplikit/mobile
# or
yarn add @react-simplikit/mobile
# or
pnpm add @react-simplikit/mobile
```

## クイックスタート

### キーボード回避ビュー

```tsx
import { useAvoidKeyboard } from '@react-simplikit/mobile';

function ChatInput() {
  const { style } = useAvoidKeyboard();

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, ...style }}>
      <input type="text" placeholder="メッセージを入力..." />
    </div>
  );
}
```

### Body Scroll Lock

`useBodyScrollLock` は、コンポーネントがマウントされている間 body のスクロールをロックし、アンマウント時に自動的に解除します。ロックのタイミングを制御するには、このフックを呼び出すコンポーネントを条件付きでレンダリングしてください。

```tsx
import { useBodyScrollLock } from '@react-simplikit/mobile';

function BodyScrollLock() {
  useBodyScrollLock();
  return null;
}

function ModalContainer({ isOpen, children }) {
  return (
    <>
      {isOpen && <BodyScrollLock />}
      {isOpen && <div className="modal">{children}</div>}
    </>
  );
}
```

### Visual Viewport

```tsx
import { useVisualViewport } from '@react-simplikit/mobile';

function Component() {
  const { viewport } = useVisualViewport();

  // 必ず最初に null チェックを行ってください
  if (!viewport) {
    return null;
  }

  return (
    <div style={{ height: viewport.height }}>
      実際に見える高さ: {viewport.height}px
    </div>
  );
}
```

## 提供している機能

### Hooks

| Hook                 | 説明                                         |
| -------------------- | -------------------------------------------- |
| `useAvoidKeyboard`   | キーボードによってコンテンツが隠れるのを防ぐ |
| `useBodyScrollLock`  | body スクロールをロック（モーダル用）        |
| `useVisualViewport`  | visual viewport のサイズを追跡               |
| `useScrollDirection` | スクロール方向を検知                         |
| `useNetworkStatus`   | ネットワーク接続状態を監視                   |
| `usePageVisibility`  | ページの可視性の状態を追跡                   |

### Utilities

| Utility                                          | 説明                           |
| ------------------------------------------------ | ------------------------------ |
| `enableBodyScrollLock` / `disableBodyScrollLock` | 命令的なスクロールロックの制御 |
| `getSafeAreaInset`                               | Safe area inset を取得         |
| `getKeyboardHeight`                              | キーボードの高さを推定         |
| `isIOS` / `isAndroid`                            | 端末の検出                     |
| `isServer`                                       | SSR 環境かどうかを判定         |

## 対応ブラウザ

- iOS Safari 13+
- Android Chrome 80+
- デスクトップブラウザ（graceful fallback）

## 関連パッケージ

- [react-simplikit](https://www.npmjs.com/package/react-simplikit) - Core hooks & utilities

## 貢献

貢献を歓迎します！[貢献ガイド](https://github.com/toss/react-simplikit/blob/main/CONTRIBUTING.md) をご確認ください。

## ライセンス

MIT © Viva Republica, Inc. 詳しくは [LICENSE](https://github.com/toss/react-simplikit/blob/main/LICENSE) を参照してください。
