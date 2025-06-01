# useGeolocation

`useGeolocation`은 사용자의 지리적 위치를 검색하고 추적하는 리액트 훅이에요. 이는 브라우저의 `Geolocation API`를 사용하여 일회성 위치 검색과 지속적인 위치 추적을 모두 지원해요.

## 인터페이스

```ts
function useGeolocation(options: GeolocationOptions): Object;
```

### 파라미터

<Interface
  name="options"
  type="GeolocationOptions"
  description="지리적 위치 옵션 구성이에요"
  :nested="[
            {
                     name: 'options.mountBehavior',
type: 'GeolocationMountBehaviorType',
required: false,
description: '훅이 마운트될 때의 동작: - 제공되지 않으면 자동 위치 검색이 발생하지 않아요 - 'get': 컴포넌트가 마운트될 때 한 번 위치를 자동으로 검색해요 - 'watch': 컴포넌트가 마운트될 때 위치 변경을 자동으로 추적해요'
            },
{
                     name: 'options.enableHighAccuracy',
type: 'boolean',
required: false,
defaultValue: 'false',
description: 'true이면, 더 정확한 위치 정보를 제공해요 (배터리 소비 증가)'
            },
{
                     name: 'options.maximumAge',
type: 'number',
required: false,
defaultValue: '0',
description: '반환하기에 허용되는 캐시된 위치의 최대 연령 (밀리초)이에요'
            },
{
                     name: 'options.timeout',
type: 'number',
required: false,
defaultValue: 'Infinity',
description: '위치 요청에 허용되는 최대 시간(밀리초)이에요'
            }
          ]"
/>

### 반환 값

<Interface
  name=""
  type="Object"
  description="위치 데이터 및 관련 함수를 포함해요"
  :nested="[
    {
      required: false,
    },
  ]"
/>

## 예시

```tsx
// 기본 사용법
const { loading, error, data, getCurrentPosition } = useGeolocation();

// 컴포넌트가 마운트될 때 위치를 자동으로 검색해요
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
