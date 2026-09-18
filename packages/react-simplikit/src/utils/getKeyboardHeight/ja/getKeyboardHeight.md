# getKeyboardHeight

`getKeyboardHeight` は、現在の画面上のキーボードの高さをピクセル単位で返すユーティリティ関数です。

この関数は、Visual Viewport API を使用してキーボードの高さを計算します。
Visual Viewport に対応したモダンな環境
（Safari / WKWebView 14 以降、Chrome / Android WebView 80 以降）を前提としています。

キーボードの高さは、次の式で計算します。
`window.innerHeight - visualViewport.height - visualViewport.offsetTop`

`offsetTop` を差し引くのは、キーボードが表示されるとビジュアルビューポートが
上下に移動することがある iOS の挙動に正しく対応するためです。

## インターフェース

```ts
function getKeyboardHeight(): number;
```

### パラメータ

この関数はパラメータを受け取りません。

### 戻り値

<Interface
  name=""
  type="number"
  description="キーボードの高さ（ピクセル単位）。キーボードが表示されていない場合は 0 を返します。"
/>

## 使用例

```tsx
const height = getKeyboardHeight();

if (height > 0) {
  footer.style.paddingBottom = `${height}px`;
}
```
