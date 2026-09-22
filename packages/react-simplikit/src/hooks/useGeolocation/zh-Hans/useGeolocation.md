# useGeolocation

`useGeolocation` 是一个获取并跟踪用户地理位置 的 React Hook。它使用浏览器的 `Geolocation API`，同时支持一次性位置获取和持续的定位跟踪。

## 接口

```ts
function useGeolocation(options?: GeolocationOptions): Object;
```

### 参数

<Interface
  name="options"
  type="GeolocationOptions"
  description="地理位置选项配置"
  :nested="[
    {
      name: 'options.mountBehavior',
      type: 'GeolocationMountBehaviorType',
      required: false,
      description:
        '挂载时 Hook 的行为：<br />- 若未提供，则不自动获取位置 <br />- <code>get</code>：组件挂载时自动获取一次位置 <br />- <code>watch</code>：组件挂载时自动开始跟踪位置变化',
    },
    {
      name: 'options.enableHighAccuracy',
      type: 'boolean',
      required: false,
      defaultValue: 'false',
      description:
        '若为 true，则提供更精确的位置信息（会增加电池消耗）',
    },
    {
      name: 'options.maximumAge',
      type: 'number',
      required: false,
      defaultValue: '0',
      description:
        '可返回的缓存位置可接受的最大年限（毫秒）',
    },
    {
      name: 'options.timeout',
      type: 'number',
      required: false,
      defaultValue: 'Infinity',
      description:
        '位置请求允许的最大时间（毫秒）',
    },
  ]"
/>

### 返回值

<Interface
  name=""
  type="Object"
  description="包含位置数据和相关函数的对象"
  :nested="[
    {
      name: 'loading',
      type: 'boolean',
      required: false,
      description: '是否正在获取位置数据。',
    },
    {
      name: 'error',
      type: 'CustomGeoLocationError|null',
      required: false,
      description:
        '出错时的错误对象，否则为 null。Hook 使用标准 Geolocation API 错误代码（<code>1-3</code>），并新增自定义代码（<code>0</code>）<br />: <code>0</code> - 环境不支持 Geolocation<br />: <code>1</code> - 用户拒绝授予地理位置访问权限<br />: <code>2</code> - 位置不可用<br />: <code>3</code> - 超时 - 地理位置请求耗时过长。',
    },
    {
      name: 'data',
      type: 'GeolocationData|null',
      required: false,
      description:
        '位置数据对象或 null<br />: latitude <code>number</code> - 以十进制度表示的纬度<br />: longitude <code>number</code> - 以十进制度表示的经度<br />: accuracy <code>number</code> - 以米表示的位置精度<br />: altitude <code>number|null</code> - 以米表示的、相对于 WGS84 椭球体的海拔<br />: altitudeAccuracy <code>number|null</code> - 以米表示的海拔精度<br />: heading <code>number|null</code> - 从正北顺时针计算的航向角（度）<br />: speed <code>number|null</code> - 以米每秒表示的速度<br />: timestamp <code>number</code> - 位置被获取的时间。',
    },
    {
      name: 'getCurrentPosition',
      type: 'Function',
      required: false,
      description: '一次性获取当前位置的函数。',
    },
    {
      name: 'startTracking',
      type: 'Function',
      required: false,
      description: '开始跟踪位置变化的函数。',
    },
    {
      name: 'stopTracking',
      type: 'Function',
      required: false,
      description: '停止跟踪位置的函数。',
    },
    {
      name: 'isTracking',
      type: 'boolean',
      required: false,
      description: '位置跟踪当前是否处于活跃状态。',
    },
  ]"
/>

## 示例

```tsx
// Basic usage
const { loading, error, data, getCurrentPosition } = useGeolocation();

// Automatically fetch location when component mounts
const { loading, error, data } = useGeolocation({ mountBehavior: 'get' });

// Location tracking
const { loading, error, data, startTracking, stopTracking, isTracking } =
  useGeolocation();

const handleStartTracking = () => {
  startTracking();
};

const handleStopTracking = () => {
  stopTracking();
};
```
