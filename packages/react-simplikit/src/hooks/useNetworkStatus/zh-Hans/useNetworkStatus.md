# useNetworkStatus

`useNetworkStatus` 是一个提供 Network Information API 访问权限的 React Hook。它提供原始的网络连接数据，例如连接类型、连接质量、速度以及用户的数据节省偏好。如果该 API 不受支持（例如 Safari、Firefox），每个属性都是 `undefined`。

## 接口

```ts
function useNetworkStatus(): NetworkStatus;
```

### 参数

此函数不接受任何参数。

### 返回值

<Interface
  name=""
  type="NetworkStatus"
  description="网络状态信息"
  :nested="[
    {
      name: 'effectiveType',
      type: '\'slow-2g\' | \'2g\' | \'3g\' | \'4g\' | undefined',
      required: false,
      description:
        '连接质量，如果 API 不受支持则为 <code>undefined</code>。',
    },
    {
      name: 'type',
      type: '\'bluetooth\' | \'cellular\' | \'ethernet\' | \'mixed\' | \'none\' | \'other\' | \'unknown\' | \'wifi\' | \'wimax\' | undefined',
      required: false,
      description:
        '物理连接类型，如果 API 不受支持则为 <code>undefined</code>。',
    },
    {
      name: 'downlink',
      type: 'number | undefined',
      required: false,
      description:
        '下行速度（Mbps），如果 API 不受支持则为 <code>undefined</code>。',
    },
    {
      name: 'rtt',
      type: 'number | undefined',
      required: false,
      description:
        '往返时间（毫秒），如果 API 不受支持则为 <code>undefined</code>。',
    },
    {
      name: 'saveData',
      type: 'boolean | undefined',
      required: false,
      description:
        '用户的数据节省偏好，如果 API 不受支持则为 <code>undefined</code>。',
    },
  ]"
/>

## 示例

### 自适应图片质量

```tsx
function AdaptiveImage() {
  const { effectiveType, saveData } = useNetworkStatus();

  // 根据应用需求决定图片质量
  const useHighQuality = effectiveType === '4g' && !saveData;

  return (
    <img src={useHighQuality ? 'high-res.jpg' : 'low-res.jpg'} alt="Content" />
  );
}
```

### 有条件的视频自动播放

```tsx
function VideoPlayer() {
  const { type, downlink } = useNetworkStatus();

  // 自定义逻辑：仅在 wifi 且带宽充足时自动播放
  const shouldAutoplay = type === 'wifi' && (downlink ?? 0) > 5;

  return <video src="video.mp4" autoPlay={shouldAutoplay} />;
}
```

## 备注

### 浏览器支持

- **Chrome/Edge（Android）**：支持所有属性
- **Chrome/Edge（桌面）**：部分支持（`effectiveType`、`downlink`、`rtt` 和 `saveData` 可用；`type` 可能为 `undefined`）
- **Firefox**：不支持（所有属性都是 `undefined`）
- **Safari**：不支持（所有属性都是 `undefined`）

### 服务端渲染安全性

此 Hook 在服务端渲染期间是安全的。在服务端，它返回空对象 `{}`，并且只会在浏览器中订阅网络变化。

### 建议

- 始终在使用某个值之前检查它是否为 `undefined`，因为并非每个浏览器都提供该 API
- 为没有 Network Information API 的浏览器提供回退方案
- 将该 Hook 用于增强体验，而非必备功能
- 在决定提供什么内容时，将 `effectiveType` 与 `saveData` 结合考虑

### 参考

- [Network Information API 规范](https://wicg.github.io/netinfo/)
- [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API)
