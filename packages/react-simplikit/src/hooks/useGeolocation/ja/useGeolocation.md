# useGeolocation

`useGeolocation` は、ユーザーの位置情報を取得・追跡する React フックです。
ブラウザーの `Geolocation API` を使い、一度限りの位置情報の取得と継続的な追跡の両方に対応します。

## インターフェース

```ts
function useGeolocation(options?: GeolocationOptions): Object;
```

### パラメータ

<Interface
  name="options"
  type="GeolocationOptions"
  description="位置情報の取得に関する設定オプション。"
  :nested="[
    {
      name: 'options.mountBehavior',
      type: 'GeolocationMountBehaviorType',
      required: false,
      description:
        'マウント時のフックの動作。<br />- 指定しない場合、位置情報を自動では取得しません。<br />- <code>get</code>：コンポーネントのマウント時に位置情報を自動で一度取得します。<br />- <code>watch</code>：コンポーネントのマウント時に位置情報の変化の追跡を自動で開始します。',
    },
    {
      name: 'options.enableHighAccuracy',
      type: 'boolean',
      required: false,
      defaultValue: 'false',
      description:
        'true の場合、より正確な位置情報を提供します（バッテリー消費が増えます）。',
    },
    {
      name: 'options.maximumAge',
      type: 'number',
      required: false,
      defaultValue: '0',
      description:
        'キャッシュされた位置情報を返してよい、取得後の最大経過時間（ミリ秒単位）。',
    },
    {
      name: 'options.timeout',
      type: 'number',
      required: false,
      defaultValue: 'Infinity',
      description:
        '位置情報のリクエストに許容する最大時間（ミリ秒単位）。',
    },
  ]"
/>

### 戻り値

<Interface
  name=""
  type="Object"
  description="位置情報のデータと関連する関数を含むオブジェクト。"
  :nested="[
    {
      name: 'loading',
      type: 'boolean',
      required: false,
      description: '位置情報を現在取得中かどうか。',
    },
    {
      name: 'error',
      type: 'CustomGeoLocationError|null',
      required: false,
      description:
        'エラーが発生した場合はエラーオブジェクト、それ以外は null です。このフックは標準の Geolocation API のエラーコード（<code>1-3</code>）に加え、独自のコード（<code>0</code>）を使用します。<br />: <code>0</code> - 実行環境が位置情報の取得に対応していません。<br />: <code>1</code> - ユーザーが位置情報へのアクセスを拒否しました。<br />: <code>2</code> - 位置情報を取得できません。<br />: <code>3</code> - タイムアウト：位置情報のリクエストに時間がかかりすぎました。',
    },
    {
      name: 'data',
      type: 'GeolocationData|null',
      required: false,
      description:
        '位置情報のデータオブジェクト、または null。<br />: latitude <code>number</code> - 十進数の度数で表した緯度。<br />: longitude <code>number</code> - 十進数の度数で表した経度。<br />: accuracy <code>number</code> - 位置の精度（メートル単位）。<br />: altitude <code>number|null</code> - WGS84 楕円体を基準とした高度（メートル単位）。<br />: altitudeAccuracy <code>number|null</code> - 高度の精度（メートル単位）。<br />: heading <code>number|null</code> - 真北から時計回りの角度（度単位）で表した進行方向。<br />: speed <code>number|null</code> - 速度（メートル毎秒）。<br />: timestamp <code>number</code> - 位置情報を取得した時刻。',
    },
    {
      name: 'getCurrentPosition',
      type: 'Function',
      required: false,
      description: '現在の位置情報を一度取得する関数。',
    },
    {
      name: 'startTracking',
      type: 'Function',
      required: false,
      description: '位置情報の変化の追跡を開始する関数。',
    },
    {
      name: 'stopTracking',
      type: 'Function',
      required: false,
      description: '位置情報の追跡を停止する関数。',
    },
    {
      name: 'isTracking',
      type: 'boolean',
      required: false,
      description: '位置情報の追跡が現在有効かどうか。',
    },
  ]"
/>

## 使用例

```tsx
// 基本的な使い方
const { loading, error, data, getCurrentPosition } = useGeolocation();

// コンポーネントのマウント時に位置情報を自動で取得します
const { loading, error, data } = useGeolocation({ mountBehavior: 'get' });

// 位置情報の追跡
const { loading, error, data, startTracking, stopTracking, isTracking } =
  useGeolocation();

const handleStartTracking = () => {
  startTracking();
};

const handleStopTracking = () => {
  stopTracking();
};
```
