# isKeyboardVisible

`isKeyboardVisible` 是一个检查屏幕键盘当前是否可见的工具函数。

它在内部使用 `getKeyboardHeight()`，当键盘高度大于 0 时返回 `true`。

## 接口

```ts
function isKeyboardVisible(): boolean;
```

### 参数

此函数不接受任何参数。

### 返回值

<Interface
  name=""
  type="boolean"
  description="键盘可见时返回 <code>true</code>，否则返回 <code>false</code>。"
/>

## 示例

```tsx
if (isKeyboardVisible()) {
  console.log('Keyboard is open');
} else {
  console.log('Keyboard is closed');
}
```

```tsx
// Conditionally show/hide elements based on keyboard visibility
const showFloatingButton = !isKeyboardVisible();
```
