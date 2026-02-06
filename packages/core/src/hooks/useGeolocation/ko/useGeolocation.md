# useGeolocation

`useGeolocation`는 사용자의 지리적 위치를 검색하고 추적하는 리액트 훅이에요. 브라우저의 `Geolocation API`를 사용하여 단회 위치 검색과 지속적인 위치 추적을 모두 지원해요.

## Interface

```ts
function useGeolocation(options: GeolocationOptions): Object;
```

### 파라미터

<Interface
  name="options"
  type="GeolocationOptions"
  description="지리적 위치 옵션 설정이에요"
  :nested="[
    {
      name: 'options.mountBehavior',
      type: 'GeolocationMountBehaviorType',
      required: false,
      description:
        '훅이 마운트 시 어떻게 동작하는지: <br />- 제공되지 않으면 자동으로 위치를 가져오지 않아요 <br />- \u0027get\u0027: 컴포넌트가 마운트될 때 위치를 자동으로 한 번 가져와요 <br />- \u0027watch\u0027: 컴포넌트가 마운트될 때 위치 변경 추적을 자동으로 시작해요',
    },
    {
      name: 'options.enableHighAccuracy',
      type: 'boolean',
      required: false,
      defaultValue: 'false',
      description:
        '만약 참이라면, 더 정확한 위치 정보를 제공해요 (배터리 소비 증가)',
    },
    {
      name: 'options.maximumAge',
      type: 'number',
      required: false,
      defaultValue: '0',
      description:
        '반환이 허용되는 캐시된 위치의 최대 나이(밀리초)예요',
    },
    {
      name: 'options.timeout',
      type: 'number',
      required: false,
      defaultValue: 'Infinity',
      description:
        '위치를 요청할 때 허용되는 최대 시간(밀리초)예요',
    },
  ]"
/>

### 반환 값

<Interface
  name=""
  type="Object"
  description="위치 데이터와 관련된 함수들을 포함하고 있어요"
  :nested="[
    {
      name: 'loading',
      type: 'boolean',
      required: false,
      description: '현재 위치 데이터를 가져오는 중인지 여부를 나타내요.',
    },
    {
      name: 'error',
      type: 'CustomGeoLocationError|null',
      required: false,
      description:
        '오류가 발생했을 때의 오류 객체이거나 null이에요. 이 훅은 표준 Geolocation API 오류 코드(<code>1-3</code>)와 사용자 정의 코드(<code>0</code>)를 사용해요 <br />  : <code>0</code> - 이 환경에서는 지리적 위치가 지원되지 않아요 <br />  : <code>1</code> - 사용자가 지리적 위치 접근 허용을 거부했어요 <br />  : <code>2</code> - 위치를 사용할 수 없어요 <br />  : <code>3</code> - 시간 초과 - 지리적 위치 요청이 너무 오래 걸렸어요.',
    },
    {
      name: 'data',
      type: 'GeolocationData|null',
      required: false,
      description:
        '위치 데이터 객체 또는 null이에요 <br />  : 위도 <code>number</code> - 십진수로 표현된 위도예요 <br />  : 경도 <code>number</code> - 십진수로 표현된 경도예요 <br />  : 정확도 <code>number</code> - 위치의 정확도(미터)예요 <br />  : 고도 <code>number|null</code> - WGS84 타원체 기준의 고도(미터)예요 <br />  : 고도 정확도 <code>number|null</code> - 고도의 정확도(미터)예요 <br />  : 방위 <code>number|null</code> - 진북에서 시계방향으로의 방위(도)예요 <br />  : 속도 <code>number|null</code> - 속도(미터/초)예요 <br />  : 타임스탬프 <code>number</code> - 위치가 검색된 시간이에요.',
    },
    {
      name: 'getCurrentPosition',
      type: 'Function',
      required: false,
      description: '현재 위치를 한 번 가져오는 함수에요.',
    },
    {
      name: 'startTracking',
      type: 'Function',
      required: false,
      description: '위치 변경 추적을 시작하는 함수에요.',
    },
    {
      name: 'stopTracking',
      type: 'Function',
      required: false,
      description: '위치 추적을 중지하는 함수에요.',
    },
    {
      name: 'isTracking',
      type: 'boolean',
      required: false,
      description: '현재 위치 추적이 활성화되어 있는지 여부를 나타내요.',
    },
  ]"
/>

## 예시

```tsx
// 기본 사용법
const { loading, error, data, getCurrentPosition } = useGeolocation();

// 컴포넌트가 마운트 될 때 자동으로 위치를 가져와요
const { loading, error, data } = useGeolocation({ mountBehavior: 'get' });

// 위치 추적
const { loading, error, data, startTracking, stopTracking, isTracking } =
  useGeolocation();

const handleStartTracking = () => {
  startTracking();
};

const handleStopTracking = () => {
  stopTracking();
};
```
