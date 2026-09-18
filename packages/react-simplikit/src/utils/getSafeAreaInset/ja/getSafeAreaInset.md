# getSafeAreaInset

`getSafeAreaInset` は、すべてのセーフエリアのインセットをピクセル単位で含むオブジェクトを返すユーティリティ関数です。

この関数は、一時的な DOM 要素を作成してその計算済みスタイルを読み取ることで、
CSS の `env(safe-area-inset-*)` の値を取得します。

セーフエリアのインセットは、デバイス固有の UI 要素を考慮したものです。

- **top**: ノッチ、Dynamic Island、ステータスバー
- **bottom**: Face ID 搭載デバイスのホームインジケーター
- **left/right**: 横向き表示での画面の丸い角

一般的な値（Face ID 搭載の iPhone、縦向き表示）：

- top: 47-59px（ノッチ／Dynamic Island）
- bottom: 34px（ホームインジケーター）
- left/right: 0px

## インターフェース

```ts
function getSafeAreaInset(): SafeAreaInset;
```

### パラメータ

この関数はパラメータを受け取りません。

### 戻り値

<Interface
  name=""
  type="SafeAreaInset"
  description="上下左右のセーフエリアのインセットを含むオブジェクト。取得できない場合はすべて 0 になります。"
  :nested="[
    {
      name: 'top',
      type: 'number',
      required: false,
      description: '上部のセーフエリアのインセット（ピクセル単位）。',
    },
    {
      name: 'bottom',
      type: 'number',
      required: false,
      description: '下部のセーフエリアのインセット（ピクセル単位）。',
    },
    {
      name: 'left',
      type: 'number',
      required: false,
      description: '左側のセーフエリアのインセット（ピクセル単位）。',
    },
    {
      name: 'right',
      type: 'number',
      required: false,
      description: '右側のセーフエリアのインセット（ピクセル単位）。',
    },
  ]"
/>

## 使用例

```tsx
const { top, bottom, left, right } = getSafeAreaInset();

header.style.paddingTop = `${top}px`;
footer.style.paddingBottom = `${bottom}px`;
```
