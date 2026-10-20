# isAndroid

`isAndroid` 是一个检测当前设备是否运行 Android 的工具函数。

优先使用 User-Agent Client Hints API（`navigator.userAgentData.platform`），不可用时回退到在 Client Hints brands 或 `navigator.userAgent` 中匹配 `"Android"`。

注意：

- 所有 Android 浏览器的 user agent 中都包含“Android”字符串。
- Android 上的 Chromium 通常将 Client Hints 的 `platform` 暴露为 `"Android"`。

## 接口

```ts
function isAndroid(userAgent?: string): boolean;
```

### 参数

<Interface
  name="userAgent"
  type="string"
  description="可选的 user agent 字符串。默认使用 <code>navigator.userAgent</code>。"
/>

### 返回值

<Interface
  name=""
  type="boolean"
  description="若设备运行 Android 则返回 <code>true</code>，否则返回 <code>false</code>。在服务端渲染环境中返回 <code>false</code>。"
/>

## 示例

```tsx
if (isAndroid()) {
  // Android 专用代码
  enableAndroidOptimizations();
}
```

```tsx
// 传入自定义 user agent
const isAndroidDevice = isAndroid(
  'Mozilla/5.0 (Linux; Android 12; Pixel 6) Chrome/120'
);
```
