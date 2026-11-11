# useInterval

`useInterval`은 정해진 간격으로 함수를 실행하는 리액트 훅이에요. 타이머, 데이터 폴링 같은 반복 작업에 유용해요.

## 인터페이스

```ts
function useInterval(
  callback: () => void,
  options: number | { delay: number; enabled?: boolean; immediate?: boolean }
): void;
```

### 파라미터

<Interface
  required
  name="callback"
  type="() => void"
  description="주기적으로 실행될 함수예요."
/>

<Interface
  required
  name="options"
  type="number | { delay: number; enabled?: boolean; immediate?: boolean }"
  description="인터벌 동작을 설정해요."
  :nested="[
    {
      name: 'options.delay',
      type: 'number',
      required: true,
      description:
        '밀리초 단위의 실행 간격이에요. <code>null</code>이면 인터벌이 실행되지 않아요.',
    },
    {
      name: 'options.immediate',
      type: 'boolean',
      required: false,
      defaultValue: 'false',
      description:
        '<code>true</code>이면 인터벌을 시작하기 전에 콜백을 즉시 실행해요.',
    },
    {
      name: 'options.enabled',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description: '<code>false</code>이면 인터벌이 실행되지 않아요.',
    },
  ]"
/>

### 반환 값

이 함수는 아무것도 반환하지 않아요.

## 예시

```tsx
import { useInterval } from 'react-simplikit';
import { useState } from 'react';

function Timer() {
  const [time, setTime] = useState(0);

  useInterval(() => {
    setTime(prev => prev + 1);
  }, 1000);

  return (
    <div>
      <p>{time} seconds</p>
    </div>
  );
}
```
