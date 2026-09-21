# useVisualViewport

`useVisualViewport` は、Visual Viewport の変化を追跡する React フックです。
モバイル WebView で実際に見えている領域を返します。この領域は、キーボードの表示やユーザーのズーム、スクロールによって変化します。

## インターフェース

```ts
function useVisualViewport(): { viewport: VisualViewportState | null };
```

### パラメータ

この関数はパラメータを受け取りません。

### 戻り値

<Interface
  name=""
  type="{ viewport: VisualViewportState | null }"
  description="Visual Viewport の状態を含むオブジェクト。"
  :nested="[
    {
      name: 'viewport',
      type: 'VisualViewportState | null',
      required: false,
      description:
        'Visual Viewport の状態オブジェクト。非対応の環境（SSR、または Visual Viewport API 非対応のブラウザー）では <code>null</code> です。',
    },
    {
      name: 'viewport.width',
      type: 'number',
      required: false,
      description: 'ビューポートの幅（ピクセル単位）。',
    },
    {
      name: 'viewport.height',
      type: 'number',
      required: false,
      description: 'ビューポートの高さ（ピクセル単位）。',
    },
    {
      name: 'viewport.offsetLeft',
      type: 'number',
      required: false,
      description:
        'レイアウトビューポートを基準とした、ビューポート左端のオフセット（ピクセル単位）。通常、水平スクロールやパン操作がなければ 0 です。',
    },
    {
      name: 'viewport.offsetTop',
      type: 'number',
      required: false,
      description:
        'レイアウトビューポートを基準とした、ビューポート上端のオフセット（ピクセル単位）。iOS ではキーボードが表示されると負の値になります（例：-300px はキーボードの高さが 300px であることを表します）。そのため、キーボードの高さには <code>-offsetTop</code> を使ってください。Android では通常 0 のままです。',
    },
    {
      name: 'viewport.scale',
      type: 'number',
      required: false,
      description:
        'ピンチズームの倍率。1.0 はズームなし、1.0 より大きい値は拡大、1.0 より小さい値は縮小を表します（縮小はまれで、ビューポートの設定によります）。',
    },
  ]"
/>

## 使用例

```tsx
function CustomLayout() {
  const { viewport } = useVisualViewport();

  // 必ず最初に null かどうかを確認します
  if (!viewport) {
    return <div>Visual Viewport not supported</div>;
  }

  const { width, height, offsetTop, scale } = viewport;

  // ユーザーがズームインしたときにフローティング UI を非表示にします
  const showFloatingUI = scale <= 1.3;

  return (
    <div style={{ height }}>
      {showFloatingUI && <FloatingButton />}
      Viewport-aware content
    </div>
  );
}
```

### ズームを検出する

```tsx
const { viewport } = useVisualViewport();
if (viewport && viewport.scale > 1.3) {
  // ユーザーがズームインしたときにフローティング UI を非表示にします
  setShowFloatingButton(false);
}
```

## 注意点

- **SSR の安全性**：サーバーサイドレンダリング時や Visual Viewport API 非対応のブラウザーでは、`viewport` は `null` です。プロパティを読み取る前に、必ず `null` かどうかを確認してください。
- **ブラウザーの対応**：Visual Viewport API は、モダンなモバイルブラウザーで利用できます。API がない環境では、このフックは `null` を返します。
- **パフォーマンス**：更新を React の `startTransition` でラップするため、ビューポートの変化が緊急のレンダリングを妨げません。
- **よりシンプルな代替手段**：キーボードの高さだけが必要な場合は、よりシンプルな API の `useKeyboardHeight()` を使ってください。
- **プラットフォームによる違い**：iOS ではキーボードが表示されると `offsetTop` が負の値になります。Android では通常 0 のままです。
- **ユースケース**：キーボードの検出、ピンチズームへの対応、ビューポートに応じたレイアウトの構築、ズーム倍率に応じた UI の表示切り替え。
