# useSafeAreaInset

`useSafeAreaInset` は、セーフエリアのインセットの変化を追跡する React フックです。
画面の向きが変わったとき（縦向きから横向きへの変更など）に自動更新されるセーフエリアのインセットを返します。

セーフエリアのインセットには、デバイス固有の UI 要素が考慮されます。

- **top**：ノッチ、Dynamic Island、ステータスバー
- **bottom**：Face ID 搭載デバイスのホームインジケーター
- **left/right**：横向き表示時の画面の角丸

## インターフェース

```ts
function useSafeAreaInset(): SafeAreaInset;
```

### パラメータ

この関数はパラメータを受け取りません。

### 戻り値

<Interface
  name=""
  type="SafeAreaInset"
  description="上下左右のセーフエリアのインセットを含むオブジェクト。"
  :nested="[
    {
      name: 'top',
      type: 'number',
      required: false,
      description:
        '上部のセーフエリアのインセット（ピクセル単位）。ノッチ、Dynamic Island、ステータスバーを考慮します。',
    },
    {
      name: 'bottom',
      type: 'number',
      required: false,
      description:
        '下部のセーフエリアのインセット（ピクセル単位）。Face ID 搭載デバイスのホームインジケーターを考慮します。',
    },
    {
      name: 'left',
      type: 'number',
      required: false,
      description:
        '左側のセーフエリアのインセット（ピクセル単位）。横向き表示時の画面の角丸を考慮します。',
    },
    {
      name: 'right',
      type: 'number',
      required: false,
      description:
        '右側のセーフエリアのインセット（ピクセル単位）。横向き表示時の画面の角丸を考慮します。',
    },
  ]"
/>

## 使用例

```tsx
function MyComponent() {
  const safeArea = useSafeAreaInset();

  return (
    <div
      style={{
        paddingTop: safeArea.top,
        paddingBottom: safeArea.bottom,
        paddingLeft: safeArea.left,
        paddingRight: safeArea.right,
      }}
    >
      Content that respects safe areas
    </div>
  );
}
```

```tsx
// 画面の向きが変わると自動更新されます
function RotationAwareHeader() {
  const { top, left, right } = useSafeAreaInset();

  return (
    <header
      style={{
        paddingTop: top,
        paddingLeft: left,
        paddingRight: right,
      }}
    >
      Header content
    </header>
  );
}
```
