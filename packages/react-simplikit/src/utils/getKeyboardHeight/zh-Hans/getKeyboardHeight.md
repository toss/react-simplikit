# getKeyboardHeight

`getKeyboardHeight` 是一个返回当前屏幕键盘高度（以像素为单位）的工具函数。

该函数使用 Visual Viewport API 计算键盘高度，并假定运行在支持 Visual Viewport 的现代环境中（Safari / WKWebView 14+、Chrome / Android WebView 80+）。

键盘高度的计算方式为：
`window.innerHeight - visualViewport.height - visualViewport.offsetTop`

减去 `offsetTop` 是为了正确处理 iOS 的行为：键盘出现时，视觉视口可能发生垂直位移。

## 接口

```ts
function getKeyboardHeight(): number;
```

### 参数

此函数不接受任何参数。

### 返回值

<Interface
  name=""
  type="number"
  description="键盘高度（像素）。键盘不可见时返回 0。"
/>

## 示例

```tsx
const height = getKeyboardHeight();

if (height > 0) {
  footer.style.paddingBottom = `${height}px`;
}
```
