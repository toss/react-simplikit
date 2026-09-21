# isKeyboardVisible

`isKeyboardVisible` は、画面上のキーボードが現在表示されているかどうかを確認するユーティリティ関数です。

この関数は、内部で `getKeyboardHeight()` を使用し、
キーボードの高さが 0 より大きい場合に `true` を返します。

## インターフェース

```ts
function isKeyboardVisible(): boolean;
```

### パラメータ

この関数はパラメータを受け取りません。

### 戻り値

<Interface
  name=""
  type="boolean"
  description="キーボードが表示されている場合は <code>true</code>、それ以外の場合は <code>false</code>。"
/>

## 使用例

```tsx
if (isKeyboardVisible()) {
  console.log('キーボードが開いています');
} else {
  console.log('キーボードが閉じています');
}
```

```tsx
// キーボードの表示状態に応じて要素の表示／非表示を切り替える
const showFloatingButton = !isKeyboardVisible();
```
