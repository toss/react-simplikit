# モバイル Web

モバイル Web 環境でよくある UI の課題を解決する React フック集です。

## なぜこれらのフックなのか

モバイル Web 開発には、デスクトップにはない課題があります。それぞれの課題に対応するフックが `react-simplikit` にあります。

| 課題                                                         | 使うもの                                                                                           |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| 下部に固定した要素がオンスクリーンキーボードに隠れる         | [useAvoidKeyboard](/ja/hooks/useAvoidKeyboard)                                                     |
| キーボードの高さや表示状態を読み取る                         | [useKeyboardHeight](/ja/hooks/useKeyboardHeight)、[isKeyboardVisible](/ja/utils/isKeyboardVisible) |
| シートやモーダルが開いている間 body のスクロールをロックする | [useBodyScrollLock](/ja/hooks/useBodyScrollLock)                                                   |
| ノッチとホームインジケーターを避ける                         | [useSafeAreaInset](/ja/hooks/useSafeAreaInset)、[getSafeAreaInset](/ja/utils/getSafeAreaInset)     |
| ユーザーが実際に見ている領域を追跡する                       | [useVisualViewport](/ja/hooks/useVisualViewport)                                                   |
| スクロール方向に応じてヘッダーを表示・非表示にする           | [useScrollDirection](/ja/hooks/useScrollDirection)                                                 |
| ネットワーク接続に合わせてコンテンツを調整する               | [useNetworkStatus](/ja/hooks/useNetworkStatus)                                                     |
| ページがバックグラウンドに移ったら処理を止める               | [usePageVisibility](/ja/hooks/usePageVisibility)                                                   |
| プラットフォームで分岐する                                   | [isIOS](/ja/utils/isIOS)、[isAndroid](/ja/utils/isAndroid)                                         |

どの項目も `react-simplikit` からの名前付きインポートで、[リファレンス](/ja/reference)には他の項目と並んで掲載されています。

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

## ロードマップ {#roadmap}

モバイル画面は小さく、その小さな空間が驚くほど多くの UI 課題を生み出します。要素がオンスクリーンキーボードに隠れたり、セーフエリアが端末によって異なったり、ユーザーが実際に見ているビューポートがブラウザの報告する値と食い違ったりします。これらはエッジケースではなく、モバイル開発における日常的な現実です。

### 課題: モバイル画面での不安定な UI

モバイル端末では、ユーザーが画面で見るものと開発者が想定するものが必ずしも一致しません。よくあるシナリオをいくつか紹介します。

- **キーボードが入力欄を覆う**: ユーザーがテキスト入力欄をタップすると、オンスクリーンキーボードがせり上がり、入力欄や下部に固定された送信ボタンを完全に覆ってしまうことがあります。
- **セーフエリアの不整合**: ノッチ、丸みを帯びた角、ホームインジケーター（iPhone の下部バーなど）を持つ端末には、コンテンツを配置すべきでない予約領域がありますが、これは端末や OS のバージョンによって異なります。
- **ビューポートの混乱**: ブラウザのレイアウトビューポートと実際に見える領域（ビジュアルビューポート）は、特にキーボードが開いていたりページがズームされていたりする場合に大きく異なることがあります。固定位置の要素が予期しない場所に配置されてしまうこともあります。

これらの課題は特定の OS や端末に固有のものではありません。iOS Safari であれ、Android Chrome であれ、その他どのモバイルブラウザであれ、根本的な課題は同じです。**見える領域は予測不可能であり、標準の CSS だけでは信頼できる形で対処できない**のです。

### 私たちのアプローチ: ビジュアルビューポートに焦点を当てる

もろいハックでブラウザの癖を回避しようとするのではなく、これらのフックは**ビジュアルビューポート**（ユーザーがある瞬間に実際に見ている画面領域）を中心に設計されています。

[Visual Viewport API](https://developer.mozilla.org/en-US/docs/Web/API/Visual_Viewport_API) をベースに構築されており、以下のことができます。

- **キーボードの表示を検知して対応する**ことで、下部固定要素が自然にキーボードを避けるようにします。
- **セーフエリアインセットを読み取る**ことで、ノッチやホームインジケーターなど、端末固有の予約領域を正しく考慮します。
- **実際に見える領域を追跡する**ことで、ブラウザのレイアウトエンジンが想定するものではなく、ユーザーが実際に見ているものに基づいてレイアウトを決定できます。

目標はシンプルです。**ビジュアルビューポート内で、UI が確実かつ予測可能にレンダリングされること**です。

### クロスプラットフォーム、クロスデバイス

モバイル Web は本質的にクロスプラットフォームであり、これらのフックも同様です。以下の環境で一貫して動作するように設計されています。

- **iOS と Android** — 2 大モバイルプラットフォーム。両者で挙動が異なる部分（iOS はキーボード表示中に `visualViewport.offsetTop` を負の値で報告し、Android は 0 のままレイアウトをリサイズします）はフックが吸収するので、意識する必要はありません。
- **さまざまなブラウザ** — Safari、Chrome、Samsung Internet など。
- **さまざまな端末フォームファクター** — コンパクトな端末から大画面端末まで、ノッチやホームインジケーターの有無を問いません。

特定の API が利用できない場合（たとえば古いブラウザの `window.visualViewport`）でも、UI を壊すことなく段階的に劣化する安全なフォールバックを提供します。

### 今後の展開

モバイル Web の UI の悩みを解決するフックを、常に同じ原則に基づいて追加し続けています。**端末や OS を問わず、モバイル UI 開発を予測可能で信頼できるものにする**という原則です。よくあるモバイル UI の悩みがあれば、私たちはそのためのクリーンで宣言的な解決策に取り組んでいる可能性が高いです。
