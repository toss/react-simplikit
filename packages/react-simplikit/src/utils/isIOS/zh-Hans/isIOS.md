# isIOS

`isIOS` 是一个用于检测当前设备是否运行 iOS 或 iPadOS 的工具函数。不同平台之间存在以下差异。

- 在 iPadOS 13 之前，iPad 会将平台报告为 'iPad'（或在 UA 中匹配 /iPad/）。
- 从 iPadOS 13 开始，Apple 为了让网站将 iPadOS 视为桌面级 Safari，将平台字符串改为了 'MacIntel'。但这些设备仍然暴露多点触控功能。

## 接口

```ts
function isIOS(userAgent?: string): boolean;
```

### 参数

<Interface
  name="userAgent"
  type="string"
  description="要检查的可选用户代理字符串。默认值为 <code>navigator.userAgent</code>。"
/>

### 返回值

<Interface
  name=""
  type="boolean"
  description="如果设备运行在 iOS 或 iPadOS 上则返回 <code>true</code>，否则返回 <code>false</code>。在服务器端渲染环境中返回 <code>false</code>。"
/>

## 示例

```tsx
if (isIOS()) {
  // 仅适用于 iOS 的代码
  enableIOSOptimizations();
}
```

```tsx
// 直接传入用户代理的情况
const isIOSDevice = isIOS(
  'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)'
);
```
