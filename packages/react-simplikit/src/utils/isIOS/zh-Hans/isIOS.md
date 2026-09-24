# isIOS

`isIOS` 是一个检测当前设备是否运行 iOS 或 iPadOS 的工具函数。

关于平台不一致性的说明：

- 在 iPadOS 13 之前，iPad 申报的平台为 “iPad”（或在 UA 中匹配 /iPad/）。
- 从 iPadOS 13 开始，Apple 将平台字符串改为 “MacIntel”，让网站将 iPadOS 当作桌面级 Safari 对待。但这些设备仍然支持多点触控。

## 接口

```ts
function isIOS(userAgent?: string): boolean;
```

### 参数

<Interface
  name="userAgent"
  type="string"
  description="可选的 user agent 字符串。默认值为 <code>navigator.userAgent</code>。"
/>

### 返回值

<Interface
  name=""
  type="boolean"
  description="设备运行 iOS 或 iPadOS 时返回 <code>true</code>，否则返回 <code>false</code>。在服务端渲染环境中返回 <code>false</code>。"
/>

## 示例

```tsx
if (isIOS()) {
  // iOS-specific code
  enableIOSOptimizations();
}
```

```tsx
// With custom user agent
const isIOSDevice = isIOS(
  'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)'
);
```
