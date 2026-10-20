# isIOS

`isIOS` 是一个检测当前设备是否运行 iOS 或 iPadOS 的工具函数。

优先使用 User-Agent Client Hints API（`navigator.userAgentData.platform`），不可用时回退到旧版 `navigator.platform` / `navigator.userAgent` 字符串。

关于平台不一致性的说明：

- 在 iPadOS 13 之前，iPad 申报的平台为“iPad”（或在 UA 中匹配 /iPad/）。
- 从 iPadOS 13 开始，Apple 将平台字符串改为“MacIntel”，让网站将 iPadOS 当作桌面级 Safari 对待。但这些设备仍然支持多点触控。
- 基于 Chromium 的浏览器可能将 Client Hints 的 `platform` 报告为 `"iOS"` 而不是 `"iPhone"`。

## 接口

```ts
function isIOS(userAgent?: string): boolean;
```

### 参数

<Interface
  name="userAgent"
  type="string"
  description="可选的 user agent 字符串。默认使用 <code>navigator.userAgent</code>。传入时直接匹配该字符串；现代 iPadOS 启发式仍会使用实时平台与触摸 API，以便识别桌面级 iPad Safari。"
/>

### 返回值

<Interface
  name=""
  type="boolean"
  description="若设备运行 iOS 或 iPadOS 则返回 <code>true</code>，否则返回 <code>false</code>。在服务端渲染环境中返回 <code>false</code>。"
/>

## 示例

```tsx
if (isIOS()) {
  // iOS 专用代码
  enableIOSOptimizations();
}
```

```tsx
// 传入自定义 user agent
const isIOSDevice = isIOS(
  'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)'
);
```
