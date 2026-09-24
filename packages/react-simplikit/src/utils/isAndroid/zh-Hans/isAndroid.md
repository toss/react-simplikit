# isAndroid

`isAndroid` 是一个检测当前设备是否运行 Android 的工具函数。

注意：

- 所有 Android 浏览器的 user agent 中都包含 “Android” 字符串。

## 接口

```ts
function isAndroid(userAgent?: string): boolean;
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
  description="设备运行 Android 时返回 <code>true</code>，否则返回 <code>false</code>。在服务端渲染环境中返回 <code>false</code>。"
/>

## 示例

```tsx
if (isAndroid()) {
  // Android-specific code
  enableAndroidOptimizations();
}
```

```tsx
// With custom user agent
const isAndroidDevice = isAndroid(
  'Mozilla/5.0 (Linux; Android 12; Pixel 6) Chrome/120'
);
```
