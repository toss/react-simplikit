# isAndroid

`isAndroid` 是一个用于检测当前设备是否在 Android 上运行的实用函数。

**注意事项**

- 所有 Android 浏览器的用户代理中都包含 'Android' 标记。

## 接口

```ts
function isAndroid(userAgent?: string): boolean;
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
  description="如果设备在 Android 上运行则返回 <code>true</code>，否则返回 <code>false</code>。在服务器端渲染环境中返回 <code>false</code>。"
/>

## 示例

```tsx
if (isAndroid()) {
  // 仅适用于 Android 的代码
  enableAndroidOptimizations();
}
```

```tsx
// 直接传入用户代理的情况
const isAndroidDevice = isAndroid(
  'Mozilla/5.0 (Linux; Android 12; Pixel 6) Chrome/120'
);
```
