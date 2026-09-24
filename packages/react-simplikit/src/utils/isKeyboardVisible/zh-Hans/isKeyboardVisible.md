# isKeyboardVisible

`isKeyboardVisible` 是用于检查当前屏幕键盘是否显示的工具函数。该函数内部使用 `getKeyboardHeight()`，当键盘高度大于 0 时返回 `true`。

## 接口

```ts
function isKeyboardVisible(): boolean;
```

### 参数

该函数不接受任何参数。

### 返回值

<Interface
  name=""
  type="boolean"
  description="如果键盘可见，则返回 <code>true</code>，否则返回 <code>false</code>。"
/>

## 示例

```tsx
if (isKeyboardVisible()) {
  console.log('键盘已打开');
} else {
  console.log('键盘已关闭');
}
```

```tsx
// 根据键盘是否显示来显示或隐藏元素
const showFloatingButton = !isKeyboardVisible();
```
