# useKeyboardHeight

`useKeyboardHeight` は、画面上のキーボードの高さを追跡する React フックです。
現在のキーボードの高さをピクセル単位で返します。この値は、
キーボードの表示、非表示、サイズ変更に応じて自動的に更新されます。

## インターフェース

```ts
function useKeyboardHeight(
  options?: UseKeyboardHeightOptions
): UseKeyboardHeightResult;
```

### パラメータ

<Interface
  name="options"
  type="UseKeyboardHeightOptions"
  description="設定オプションです。"
  :nested="[
    {
      name: 'options.immediate',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description: 'true の場合、マウント時にキーボードの初期の高さを取得します。',
    },
  ]"
/>

### 戻り値

<Interface
  name=""
  type="UseKeyboardHeightResult"
  description="現在のキーボードの高さを含むオブジェクトです。"
  :nested="[
    {
      name: 'keyboardHeight',
      type: 'number',
      required: false,
      description:
        '現在のキーボードの高さ（ピクセル）です。キーボードが非表示のときは 0 です。',
    },
  ]"
/>

## 使用例

```tsx
function ChatInput() {
  const { keyboardHeight } = useKeyboardHeight();

  return (
    <div style={{ paddingBottom: `${keyboardHeight}px` }}>
      <input type="text" placeholder="Type a message..." />
    </div>
  );
}
```

```tsx
function KeyboardStatus() {
  const { keyboardHeight } = useKeyboardHeight();

  return (
    <div>
      {keyboardHeight > 0
        ? `Keyboard is open (${keyboardHeight}px)`
        : 'Keyboard is closed'}
    </div>
  );
}
```
