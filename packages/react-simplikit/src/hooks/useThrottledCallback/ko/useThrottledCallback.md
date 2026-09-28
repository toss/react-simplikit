# useThrottledCallback

`useThrottledCallback`는 제공된 콜백 함수의 스로틀링된 버전을 반환하는 리액트 훅이에요. 스로틀링된 콜백은 지정된 간격당 최대 한 번만 호출돼요.

## 인터페이스

```ts
function useThrottledCallback<T>(
  onChange: (newValue: T) => void,
  throttleMs: number,
  options?: ThrottleOptions
): (nextValue: T) => void;
```

### 파라미터

<Interface
  required
  name="onChange"
  type="(newValue: T) => void"
  description="값을 전달받을 콜백이에요."
/>

<Interface
  required
  name="throttleMs"
  type="number"
  description="스로틀 간격(ms)이에요."
/>

<Interface
  name="options"
  type="ThrottleOptions"
  description="추가 동작을 설정하는 옵션이에요."
  :nested="[
    {
      name: 'options.edges',
      type: 'Array<\'leading\' | \'trailing\'>',
      required: false,
      defaultValue: '[\'leading\', \'trailing\']',
      description:
        '함수가 시작점, 끝점 또는 둘 다에서 호출될지 여부를 지정하는 선택적 배열이에요.',
    },
  ]"
/>

### 반환 값

<Interface
  name=""
  type="(nextValue: T) => void"
  description="간격당 최대 한 번 값을 <code>onChange</code>에 전달하는 스로틀링된 함수예요."
/>

## 예시

```tsx
import { useThrottledCallback } from 'react-simplikit';
import { useState } from 'react';

function ScrollPosition() {
  const [scrollTop, setScrollTop] = useState(0);
  const setScrollTopThrottled = useThrottledCallback(setScrollTop, 200);

  return (
    <div onScroll={e => setScrollTopThrottled(e.currentTarget.scrollTop)}>
      <p>{scrollTop}px 스크롤됨</p>
    </div>
  );
}
```
