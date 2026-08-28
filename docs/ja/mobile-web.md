# モバイルユーティリティ

モバイル Web 環境でよくある UI の課題を解決する React フック集です。

## なぜモバイルユーティリティなのか

モバイル Web 開発には、デスクトップにはない固有の課題があります。

- **キーボード回避**: オンスクリーンキーボードが表示されると、下部に固定した要素が隠れてしまいます
- **スクロール方向の検知**: スクロールに応じてヘッダーやナビゲーションバーを表示・非表示にします
- **ネットワーク状態の監視**: 接続速度に応じてコンテンツの品質を調整します
- **ページ可視性の追跡**: アプリがバックグラウンドに移動したときに動画や計測を一時停止します
- **ビジュアルビューポートの変化**: モバイルブラウザでのズーム、キーボード、ビューポートのリサイズに対応します

`react-simplikit` は、これらのシナリオを最小限の設定で扱える実績のあるフックを提供します。

## クイックスタート

```bash
npm install react-simplikit
```

### CTA ボタンの例

もっとも一般的なモバイル UI パターンです。キーボードの上に移動する下部固定ボタンです。

```tsx
import { useAvoidKeyboard } from 'react-simplikit';

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
import { useAvoidKeyboard } from 'react-simplikit';

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
import { useAvoidKeyboard } from 'react-simplikit';

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

| フック                                             | 説明                                                           |
| -------------------------------------------------- | -------------------------------------------------------------- |
| [useAvoidKeyboard](/ja/hooks/useAvoidKeyboard)     | 固定要素をオンスクリーンキーボードの上に移動させます           |
| [useKeyboardHeight](/ja/hooks/useKeyboardHeight)   | 現在のキーボードの高さを返します                               |
| [useBodyScrollLock](/ja/hooks/useBodyScrollLock)   | モーダルやオーバーレイのために body のスクロールをロックします |
| [useScrollDirection](/ja/hooks/useScrollDirection) | スクロール方向（上/下）を検知します                            |
| [useNetworkStatus](/ja/hooks/useNetworkStatus)     | ネットワーク接続状態を監視します                               |
| [usePageVisibility](/ja/hooks/usePageVisibility)   | ページの可視性の状態を追跡します                               |
| [useVisualViewport](/ja/hooks/useVisualViewport)   | ビジュアルビューポートのサイズとオフセットを提供します         |

## ロードマップ

モバイル画面は小さく、その小さな空間が驚くほど多くの UI 課題を生み出します。要素がオンスクリーンキーボードに隠れたり、セーフエリアが端末によって異なったり、ユーザーが実際に見ているビューポートがブラウザの報告する値と食い違ったりします。これらはエッジケースではなく、モバイル開発における日常的な現実です。

### 課題: モバイル画面での不安定な UI

モバイル端末では、ユーザーが画面で見るものと開発者が想定するものが必ずしも一致しません。よくあるシナリオをいくつか紹介します。

- **キーボードが入力欄を覆う**: ユーザーがテキスト入力欄をタップすると、オンスクリーンキーボードがせり上がり、入力欄や下部に固定された送信ボタンを完全に覆ってしまうことがあります。
- **セーフエリアの不整合**: ノッチ、丸みを帯びた角、ホームインジケーター（iPhone の下部バーなど）を持つ端末には、コンテンツを配置すべきでない予約領域がありますが、これは端末や OS のバージョンによって異なります。
- **ビューポートの混乱**: ブラウザのレイアウトビューポートと実際に見える領域（ビジュアルビューポート）は、特にキーボードが開いていたりページがズームされていたりする場合に大きく異なることがあります。固定位置の要素が予期しない場所に配置されてしまうこともあります。

これらの課題は特定の OS や端末に固有のものではありません。iOS Safari であれ、Android Chrome であれ、その他どのモバイルブラウザであれ、根本的な課題は同じです。**見える領域は予測不可能であり、標準の CSS だけでは信頼できる形で対処できない**のです。

### 私たちのアプローチ: ビジュアルビューポートに焦点を当てる

`react-simplikit` のモバイルユーティリティは、これらの問題を解決するために焦点を絞ったアプローチを取ります。もろいハックでブラウザの癖を回避しようとするのではなく、**ビジュアルビューポート** — ユーザーがある瞬間に実際に見ている画面領域 — を中心に設計しています。

[Visual Viewport API](https://developer.mozilla.org/en-US/docs/Web/API/Visual_Viewport_API) をベースに構築することで、以下のようなことができるフックを提供します。

- **キーボードの表示を検知して対応する**ことで、下部固定要素が自然にキーボードを避けるようにします。
- **セーフエリアインセットを読み取る**ことで、ノッチやホームインジケーターなど、端末固有の予約領域を正しく考慮します。
- **実際に見える領域を追跡する**ことで、ブラウザのレイアウトエンジンが想定するものではなく、ユーザーが実際に見ているものに基づいてレイアウトを決定できます。

目標はシンプルです。**ビジュアルビューポート内で、UI が確実かつ予測可能にレンダリングされること**です。

### クロスプラットフォーム、クロスデバイス

特定の OS や端末モデルに限定されないことを目指しています。モバイル Web は本質的にクロスプラットフォームであり、`react-simplikit` はそれを受け入れています。

私たちのフックは、以下の環境で一貫して動作するように設計されています。

- **iOS と Android** — 2 大モバイルプラットフォーム。
- **さまざまなブラウザ** — Safari、Chrome、Samsung Internet など。
- **さまざまな端末フォームファクター** — コンパクトな端末から大画面端末まで、ノッチやホームインジケーターの有無を問いません。

特定の API が利用できない場合（たとえば古いブラウザの `window.visualViewport`）でも、UI を壊すことなく段階的に劣化する安全なフォールバックを提供します。

### 今後の展開

`react-simplikit` で提供するモバイルフックのラインナップを、常に同じ原則に基づいて拡張し続けています。**端末や OS を問わず、モバイル UI 開発を予測可能で信頼できるものにする**という原則です。よくあるモバイル UI の悩みがあれば、私たちはそのためのクリーンで宣言的な解決策に取り組んでいる可能性が高いです。

## モバイル特有の原則

### プラットフォームを意識した設計

実装においては、iOS と Android の挙動の違いを考慮します。

- **Visual Viewport API の違い**:
  - iOS: キーボードが表示されると `offsetTop` が負の値になります
  - Android: `offsetTop` は基本的に 0 のままです
- **キーボードの高さの計算**: 正確な計測のためのプラットフォーム別の処理

### SSR 安全性を最優先に

すべてのフックには、安全なサーバーサイドレンダリングを保証するための SSR テストが含まれます。

```typescript
it('is safe on server side rendering', () => {
  const result = renderHookSSR.serverOnly(() => useHook());
  expect(result.current).toBeDefined();
});
```

### パフォーマンス最適化

モバイル環境ではパフォーマンスに特別な配慮が必要です。

- **イベントのスロットリング／デバウンス**: スクロールやリサイズのような頻発するイベントを最適化します
- **パッシブイベントリスナー**: 適用可能な場合はパッシブリスナーを使用します
- **React トランジション**: 緊急でない更新には `startTransition` を活用します

## モバイル特有のガイドライン

### 実機でのテスト

- iOS Safari と Android Chrome でのテストを推奨します
- Visual Viewport API の挙動は実機で確認する必要があります

### プラットフォームの違い

実装時には、以下のプラットフォームの違いを考慮してください。

| 機能                       | iOS                                  | Android                    |
| -------------------------- | ------------------------------------ | -------------------------- |
| `visualViewport.offsetTop` | キーボードが表示されると負の値になる | 基本的に 0 のまま          |
| キーボードの挙動           | ビューポートが押し上げられる         | レイアウトがリサイズされる |

### window/document へのアクセスパターン

ブラウザ API にアクセスする際は、常に SSR 安全パターンを使用してください。

```typescript
// ✅ SSR 安全パターン
const isClient = typeof window !== 'undefined';
if (!isClient) return defaultValue;

// これで window/document を安全に使用できます
window.visualViewport?.addEventListener('resize', handler);
```
