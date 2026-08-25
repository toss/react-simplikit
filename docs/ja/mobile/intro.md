# react-simplikit/mobile

モバイル Web 環境でよくある UI の課題を解決する React フック集です。

## なぜ react-simplikit/mobile なのか

モバイル Web 開発には、デスクトップにはない固有の課題があります。

- **キーボード回避**: オンスクリーンキーボードが表示されると、下部に固定した要素が隠れてしまいます
- **スクロール方向の検知**: スクロールに応じてヘッダーやナビゲーションバーを表示・非表示にします
- **ネットワーク状態の監視**: 接続速度に応じてコンテンツの品質を調整します
- **ページ可視性の追跡**: アプリがバックグラウンドに移動したときに動画や計測を一時停止します
- **ビジュアルビューポートの変化**: モバイルブラウザでのズーム、キーボード、ビューポートのリサイズに対応します

`react-simplikit/mobile` は、これらのシナリオを最小限の設定で扱える実績のあるフックを提供します。

## クイックスタート

```bash
npm install react-simplikit
```

### CTA ボタンの例

もっとも一般的なモバイル UI パターンです。キーボードの上に移動する下部固定ボタンです。

```tsx
import { useAvoidKeyboard } from 'react-simplikit/mobile';

function FixedBottomCTA() {
  const { style } = useAvoidKeyboard();

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        ...style,
      }}
    >
      <button>Submit</button>
    </div>
  );
}
```

### チャット入力欄の例

キーボードの上に留まる入力欄を持つチャット UI です。

```tsx
import { useState } from 'react';
import { useAvoidKeyboard } from 'react-simplikit/mobile';

function ChatInput() {
  const { style } = useAvoidKeyboard();
  const [message, setMessage] = useState('');

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        gap: '8px',
        padding: '12px',
        ...style,
      }}
    >
      <input
        type="text"
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Type a message..."
        style={{ flex: 1 }}
      />
      <button>Send</button>
    </div>
  );
}
```

### セーフエリアへの対応

ホームインジケーターを備えた端末（iPhone など）では、セーフエリアのオフセットを追加できます。

```tsx
import { useAvoidKeyboard } from 'react-simplikit/mobile';

function FixedBottomCTA() {
  const { style } = useAvoidKeyboard({ safeAreaBottom: 34 });

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        ...style,
      }}
    >
      <button>Submit</button>
    </div>
  );
}
```

## 利用可能なフック

| フック                                                    | 説明                                                           |
| --------------------------------------------------------- | -------------------------------------------------------------- |
| [useAvoidKeyboard](/ja/mobile/hooks/useAvoidKeyboard)     | 固定要素をオンスクリーンキーボードの上に移動させます           |
| [useKeyboardHeight](/ja/mobile/hooks/useKeyboardHeight)   | 現在のキーボードの高さを返します                               |
| [useBodyScrollLock](/ja/mobile/hooks/useBodyScrollLock)   | モーダルやオーバーレイのために body のスクロールをロックします |
| [useScrollDirection](/ja/mobile/hooks/useScrollDirection) | スクロール方向（上/下）を検知します                            |
| [useNetworkStatus](/ja/mobile/hooks/useNetworkStatus)     | ネットワーク接続状態を監視します                               |
| [usePageVisibility](/ja/mobile/hooks/usePageVisibility)   | ページの可視性の状態を追跡します                               |
| [useVisualViewport](/ja/mobile/hooks/useVisualViewport)   | ビジュアルビューポートのサイズとオフセットを提供します         |
