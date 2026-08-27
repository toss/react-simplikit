# useThrottledCallback

`useThrottledCallback`는 제공된 콜백 함수의 스로틀링된 버전을 반환하는 리액트 훅이에요. 스로틀링된 콜백은 지정된 간격당 최대 한 번만 호출돼요.

## 인터페이스

```ts
function useThrottledCallback<T>(options: Object): (nextValue: T) => void;
```

### 파라미터

<Interface
  required
  name="options"
  type="Object"
  description="옵션 객체예요."
  :nested="[
    {
      name: 'options.onChange',
      type: '(newValue: T) => void',
      required: true,
      description:
        '스로틀링할 콜백이에요. 마지막으로 전달된 값과 같은 값으로 호출하면 건너뛰어요.',
    },
    {
      name: 'options.timeThreshold',
      type: 'number',
      required: true,
      description: '호출을 스로틀링할 밀리초(ms)이에요.',
    },
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
  const setScrollTopThrottled = useThrottledCallback({
    onChange: setScrollTop,
    timeThreshold: 200,
  });

  return (
    <div onScroll={e => setScrollTopThrottled(e.currentTarget.scrollTop)}>
      <p>{scrollTop}px 스크롤됨</p>
    </div>
  );
}
```
