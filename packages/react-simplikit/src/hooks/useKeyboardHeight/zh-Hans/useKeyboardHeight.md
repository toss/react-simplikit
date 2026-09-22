# useKeyboardHeight

`useKeyboardHeight` 是一个跟踪屏幕键盘高度 的 React Hook。它返回当前键盘的高度（像素），当键盘出现、消失或改变大小时会自动更新。

## 接口

```ts
function useKeyboardHeight(
  options?: UseKeyboardHeightOptions
): UseKeyboardHeightResult;
```

### 参数

<Interface
  name="options"
  type="UseKeyboardHeightOptions"
  description="配置选项。"
  :nested="[
    {
      name: 'options.immediate',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description: '若为 true，则在挂载时获取初始键盘高度。',
    },
  ]"
/>

### 返回值

<Interface
  name=""
  type="UseKeyboardHeightResult"
  description="一个包含当前键盘高度的对象。"
  :nested="[
    {
      name: 'keyboardHeight',
      type: 'number',
      required: false,
      description:
        '当前键盘高度（像素）。键盘隐藏时为 0。',
    },
  ]"
/>

## 示例

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
