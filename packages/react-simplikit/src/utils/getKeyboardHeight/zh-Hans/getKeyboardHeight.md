# getKeyboardHeight

`getKeyboardHeight` 是一个工具函数，返回当前屏幕上显示的键盘高度（以像素为单位）。该函数使用 Visual Viewport API 来计算键盘高度。假定运行环境支持 Visual Viewport 的现代环境（Safari / WKWebView 14+，Chrome / Android WebView 80+）。键盘高度的计算方式如下：`window.innerHeight - visualViewport.height - visualViewport.offsetTop` —— 需要减去 `offsetTop` 是为了在键盘出现时正确处理 iOS 的行为。

## 接口

```ts
function getKeyboardHeight(): number;
```

### 参数

该函数不接受任何参数。

### 返回值

<Interface
  name=""
  type="number"
  description="以像素为单位的键盘高度。键盘不可见时返回 0。"
/>

## 示例

```tsx
const height = getKeyboardHeight();

if (height > 0) {
  footer.style.paddingBottom = `${height}px`;
}
```
