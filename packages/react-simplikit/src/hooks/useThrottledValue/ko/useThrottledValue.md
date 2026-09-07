# useThrottledValue

`useThrottledValue`는 전달받은 값의 스로틀링된 사본을 반환하는 리액트 훅이에요. 상태는 호출자가 그대로 소유하고, 반환값은 `wait` 밀리초마다 최대 한 번만 그 상태를 따라가요. 스크롤 위치, 포인터 위치, 리사이즈 시 엘리먼트 크기처럼 자주 바뀌는 값으로 무거운 렌더링을 구동할 때 유용해요.

첫 렌더와 서버 렌더에서는 값을 그대로 돌려줘요. 마운트 시점에는 갱신을 예약하지 않으므로 `leading`이 `true`이면 마운트 뒤 첫 변경이 즉시 반영돼요. `leading`과 `trailing`이 모두 `false`이면 반환값은 갱신되지 않아요.

값은 참조로 비교해요. 렌더마다 새 객체나 배열을 전달하면 반환값이 `wait` 밀리초마다 계속 갱신되니, `usePreservedReference` 같은 방법으로 참조를 먼저 안정화하세요.

## 인터페이스

```ts
function useThrottledValue<T>(
  value: T,
  wait: number,
  options: ThrottleOptions
): T;
```

### 파라미터

<Interface
  required
  name="value"
  type="T"
  description="스로틀링할 값이에요."
/>

<Interface
  required
  name="wait"
  type="number"
  description="스로틀 창의 길이(밀리초)예요."
/>

<Interface
  name="options"
  type="ThrottleOptions"
  description="스로틀 동작을 설정하는 옵션이에요."
  :nested="[
    {
      name: 'options.leading',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        '<code>true</code>이면 창 안의 첫 변경을 즉시 반영해요.',
    },
    {
      name: 'options.trailing',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        '<code>true</code>이면 창 안의 마지막 변경을 그 변경 뒤 <code>wait</code> 밀리초가 지나서 반영해요.',
    },
  ]"
/>

### 반환 값

<Interface
  name=""
  type="T"
  description="스로틀링된 값이에요."
/>

## 예시

```tsx
import { useThrottledValue } from 'react-simplikit';
import { useState } from 'react';

function ScrollProgress() {
  const [scrollY, setScrollY] = useState(0);
  const throttledScrollY = useThrottledValue(scrollY, 100);

  return (
    <div onScroll={e => setScrollY(e.currentTarget.scrollTop)}>
      <ProgressBar position={throttledScrollY} />
    </div>
  );
}
```
