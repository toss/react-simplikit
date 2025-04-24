# useCounter

`useCounter`는 증가, 감소, 초기화 기능을 갖춘 숫자형 카운터 상태를 관리하는 리액트 훅이에요. 선택적으로 최소값과 최대값을 제공하여 카운터의 범위를 제한할 수 있어요.

## 인터페이스

```ts
function useCounter(options?: UseCounterOptions): UseCounterReturn;

type UseCounterOptions = {
  initialValue?: number;
  min?: number;
  max?: number;
  step?: number;
};
ㄴ
type UseCounterReturn = {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setCount: (value: number | ((prev: number) => number)) => void;
};
```

### 파라미터

<Interface
  name="options"
  type="UseCounterOptions"
  description="카운터의 선택적 설정이에요."
  :nested="[
    {
      name: 'initialValue',
      type: 'number',
      description: '카운터의 초기값. 기본값은 0이에요.',
    },
    {
      name: 'min',
      type: 'number',
      description: '카운터가 도달할 수 있는 최소값. 제공되지 않으면 하한이 없어요.',
    },
    {
      name: 'max',
      type: 'number',
      description: '카운터가 도달할 수 있는 최대값. 제공되지 않으면 상한이 없어요.',
    },
    {
      name: 'step',
      type: 'number',
      description: '증가 또는 감소할 값. 기본값은 1이에요.',
    }
  ]"
/>

### 반환 값

<Interface
  name=""
  type="UseCounterReturn"
  description="카운트 값과 제어 함수를 포함하는 객체에요."
  :nested="[
    {
      name: 'count',
      type: 'number',
      description: '현재 카운트 값이에요.',
    },
    {
      name: 'increment',
      type: '() => void',
      description: '단계 크기만큼 카운터 증가해요.',
    },
    {
      name: 'decrement',
      type: '() => void',
      description: '단계 크기만큼 카운터 감소해요.',
    },
    {
      name: 'reset',
      type: '() => void',
      description: '카운터를 초기값으로 재설정해요.',
    },
    {
      name: 'setCount',
      type: '(value: number | ((prev: number) => number)) => void',
      description: '카운터를 제약 조건 내에서 특정 값으로 설정해요.',
    }
  ]"
/>

## 예시

```tsx
import { useCounter } from 'react-simplikit';

function ShoppingCart() {
  const { count, increment, decrement, reset } = useCounter({
    initialValue: 1,
    min: 1,
    max: 10,
  });

  return (
    <div>
      <span>수량: {count}</span>
      <button type="button" onClick={decrement}>-</button>
      <button type="button" onClick={increment}>+</button>
      <button type="button" onClick={reset}>초기화</button>
    </div>
  );
}
```

## 제약 조건

이 훅은 카운터가 지정된 범위 내에서 유지되도록 자동으로 보장해요:

- 값이 `max`보다 커지면 자동으로 `max` 값으로 제한돼요.
- 값이 `min`보다 작아지면 자동으로 `min` 값으로 제한돼요.
- `setCount`를 사용할 때 범위를 벗어나는 값은 자동으로 가장 가까운 경계값으로 조정돼요.
