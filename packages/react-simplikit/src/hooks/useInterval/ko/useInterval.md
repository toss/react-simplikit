# useInterval

`useInterval`은 정해진 간격으로 함수를 실행하는 리액트 훅이에요. 타이머, 데이터 폴링 및 기타 반복 작업에 유용해요.

## 인터페이스

```ts
function useInterval(options: Object): void;
```

### 파라미터

<Interface
  required
  name="options"
  type="Object"
  description="간격 동작을 설정해요."
  :nested="[
    {
      name: 'options.onTick',
      type: '() => void',
      required: true,
      description: '주기적으로 실행될 함수예요.',
    },
    {
      name: 'options.delayMs',
      type: 'number',
      required: true,
      description: '실행 간격(밀리초)이에요.',
    },
    {
      name: 'options.immediate',
      type: 'boolean',
      required: false,
      defaultValue: 'false',
      description:
        '만약 <code>true</code>이면, 간격 시작 전에 즉시 실행돼요.',
    },
    {
      name: 'options.enabled',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description: '<code>false</code>인 경우 간격이 실행되지 않아요.',
    },
  ]"
/>

### 반환 값

이 함수는 아무 것도 반환하지 않아요.

## 예시

```tsx
import { useInterval } from 'react-simplikit';
import { useState } from 'react';

function Timer() {
  const [time, setTime] = useState(0);

  useInterval({
    onTick: () => setTime(prev => prev + 1),
    delayMs: 1000,
  });

  return (
    <div>
      <p>{time} seconds</p>
    </div>
  );
}
```
