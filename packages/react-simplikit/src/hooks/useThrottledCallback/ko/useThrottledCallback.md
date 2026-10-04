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
      name: 'options.throttleMs',
      type: 'number',
      required: true,
      description: '호출을 스로틀링할 밀리초(ms)이에요.',
    },
    {
      name: 'options.leading',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        '<code>true</code>이면 스로틀 구간이 시작될 때 즉시 호출할 수 있어요.',
    },
    {
      name: 'options.trailing',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        '<code>true</code>이면 대기 중인 호출을 지연 시간이 지난 뒤 최신 값으로 실행할 수 있어요.',
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
    throttleMs: 200,
  });

  return (
    <div onScroll={e => setScrollTopThrottled(e.currentTarget.scrollTop)}>
      <p>{scrollTop}px 스크롤됨</p>
    </div>
  );
}
```
