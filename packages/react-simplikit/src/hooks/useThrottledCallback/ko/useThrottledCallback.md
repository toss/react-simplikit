# useThrottledCallback

`useThrottledCallback`은 전달한 콜백 함수의 스로틀링된 버전을 반환하는 리액트 훅이에요. 스로틀링된 콜백은 지정한 간격마다 최대 한 번만 호출돼요.
스로틀링된 함수는 `callback`과 같은 인자를 받고, 트레일링 호출에는 가장 최근 호출의 인자를 전달해요.

컴포넌트가 언마운트되거나 `throttleMs`, `leading`, `trailing`이 바뀌면 대기 중인 호출을 취소해요.
`.cancel()`은 대기 중인 호출만 취소하고, `callback`이 이미 시작한 작업은 멈추지 않아요.
`.cancel()` 뒤의 다음 호출은 새 간격을 시작하므로, `leading`이 `true`이면 바로 실행돼요.

## 인터페이스

```ts
function useThrottledCallback<F extends (...args: any[]) => unknown>(
  options: Object
): ((...args: Parameters<F>) => void) & { cancel: () => void };
```

### 파라미터

<Interface
  required
  name="options"
  type="Object"
  description="옵션 객체예요."
  :nested="[
    {
      name: 'options.callback',
      type: 'F',
      required: true,
      description: '스로틀링할 함수예요.',
    },
    {
      name: 'options.throttleMs',
      type: 'number',
      required: true,
      description: '호출을 스로틀링할 간격(밀리초)이에요.',
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
        '<code>true</code>이면 대기 중인 호출을 지연 시간이 지난 뒤 최신 인자로 실행할 수 있어요.',
    },
  ]"
/>

### 반환 값

<Interface
  name=""
  type="((...args: Parameters<F>) => void) & { cancel: () => void }"
  description="<code>callback</code>과 같은 인자를 받는 스로틀링된 함수예요. 대기 중인 스로틀링 실행을 취소하는 <code>cancel</code> 메서드도 포함해요."
/>

## 예시

```tsx
import { useThrottledCallback } from 'react-simplikit';
import { useState } from 'react';

function ScrollPosition() {
  const [scrollTop, setScrollTop] = useState(0);
  const setScrollTopThrottled = useThrottledCallback({
    callback: setScrollTop,
    throttleMs: 200,
  });

  return (
    <div onScroll={e => setScrollTopThrottled(e.currentTarget.scrollTop)}>
      <p>{scrollTop}px 스크롤됨</p>
    </div>
  );
}
```
