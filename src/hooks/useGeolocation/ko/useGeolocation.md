# useGeolocation

`useGeolocation`은 사용자의 지리적 위치를 검색하고 추적하는 리액트 훅이에요. 브라우저의 `Geolocation API`를 사용하여 일회성 위치 검색과 지속적인 위치 추적을 지원해요.

## Interface

```ts
function useGeolocation(options: GeolocationOptions): Object;
```

### 파라미터

<Interface
  name="options"
  type="GeolocationOptions"
  description="지리적 위치 옵션 구성 설정이에요"
  :nested="[
    {
      name: 'options.mountBehavior',
      type: 'GeolocationMountBehaviorType',
      required: false,
      description:
        '훅이 마운트될 때 어떻게 동작할지에 대한 것이에요: - 제공되지 않으면 자동으로 위치를 가져오지 않아요 - \'get\': 컴포넌트가 마운트될 때 위치를 자동으로 한 번 가져와요 - \'watch\': 컴포넌트가 마운트될 때 위치 변경 추적을 자동으로 시작해요',
    },
    {
      name: 'options.enableHighAccuracy',
      type: 'boolean',
      required: false,
      defaultValue: 'false',
      description:
        'true인 경우 더 정확한 위치 정보를 제공해요 (배터리 소비가 증가해요)',
    },
    {
      name: 'options.maximumAge',
      type: 'number',
      required: false,
      defaultValue: '0',
      description:
        '반환할 수 있는 캐시된 위치의 최대 나이를 밀리초 단위로 지정해요',
    },
    {
      name: 'options.timeout',
      type: 'number',
      required: false,
      defaultValue: 'Infinity',
      description:
        '위치 요청에 허용되는 최대 시간(밀리초 단위)이에요',
    },
  ]"
/>

### 반환 값

<Interface
  name=""
  type="Object"
  description="위치 데이터와 관련된 함수들을 포함해요"
  :nested="[
    {
      name: 'loading',
      type: 'boolean',
      required: false,
      description: '현재 위치 데이터를 가져오는 중인지 여부예요.',
    },
    {
      name: 'error',
      type: 'CustomGeoLocationError|null',
      required: false,
      description:
        '오류가 발생한 경우의 오류 객체 또는 null이에요. 이 훅은 표준 Geolocation API 오류 코드 (1-3)를 사용하고 사용자 지정 코드(0)를 추가해요<br />  : - 0<br />  : 환경에서 지리적 위치를 지원하지 않아요 - 1<br />  : 사용자가 지리적 위치 접근을 거부했어요 - 2<br />  : 사용할 수 있는 위치가 없어요 - 3<br />  : 시간 초과 - 위치 요청에 너무 많은 시간이 소요됐어요.',
    },
    {
      name: 'data',
      type: 'GeolocationData|null',
      required: false,
      description:
        '위치 데이터 객체 또는 null이에요 - 위도 <code>number</code> - 십진수로 표현된 위도예요 - 경도 <code>number</code> - 십진수로 표현된 경도예요 - 정확도 <code>number</code> - 미터 단위로 위치의 정확도예요 - 고도 <code>number|null</code> - WGS84 타원체 위의 미터 단위로 고도예요 - 고도 정확도 <code>number|null</code> - 미터 단위로 고도의 정확도예요 - 방향 <code>number|null</code> - 진북에서 시계 방향으로의 각도예요 - 속도 <code>number|null</code> - 초당 미터로 측정된 속도예요 - 타임스탬프 <code>number</code> - 위치가 검색된 시간이에요.',
    },
    {
      name: 'getCurrentPosition',
      type: 'Function',
      required: false,
      description:
        '현재 위치를 한 번 가져오는 함수예요 - startTracking <code>Function</code> - 위치 변경 추적을 시작하는 함수예요 - stopTracking <code>Function</code> - 위치 추적을 멈추는 함수예요 - isTracking <code>boolean</code> - 위치 추적이 현재 활성 상태인지 여부예요.',
    },
  ]"
/>

## 예시

```tsx
// 기본 사용법
const {
  loading,
  error,
  data,
  getCurrentPosition
} = useGeolocation();

// 컴포넌트 마운트 시 자동으로 위치 가져오기
const {
  loading,
  error,
  data
} = useGeolocation({ mountBehavior: 'get' });

// 위치 추적
const {
  loading,
  error,
  data,
  startTracking,
  stopTracking,
  isTracking
} = useGeolocation();

const handleStartTracking = () => {
  startTracking();
};

const handleStopTracking = () => {
  stopTracking();
};
```

