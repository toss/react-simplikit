# useCounter

`useCounter`는 숫자 카운터 상태를 증가, 감소, 초기화 기능과 함께 관리하는 리액트 훅이에요. 선택적으로 최소값과 최대값을 제공하여 카운터의 범위를 제한할 수 있어요.

## Interface

```ts
function useCounter(options: UseCounterOptions): UseCounterReturn;
```

### 파라미터

<Interface
  required
  name="options"
  type="UseCounterOptions"
  description="카운터를 위한 옵션이에요."
  :nested="[
    {
      name: 'options.initialValue',
      type: 'number',
      required: false,
      defaultValue: '0',
      description: '카운터의 초기값이에요. 기본값은 0이에요.',
    },
    {
      name: 'options.min',
      type: 'number',
      required: false,
      description:
        '카운터가 도달할 수 있는 최소값이에요. 제공되지 않으면 하한선이 없어요.',
    },
    {
      name: 'options.max',
      type: 'number',
      required: false,
      description:
        '카운터가 도달할 수 있는 최대값이에요. 제공되지 않으면 상한선이 없어요.',
    },
    {
      name: 'options.step',
      type: 'number',
      required: false,
      defaultValue: '1',
      description: '증가 또는 감소할 값이에요. 기본값은 1이에요.',
    },
  ]"
/>

### 반환 값

<Interface
  name=""
  type="UseCounterReturn"
  description="카운트 값과 제어 함수들이 있는 객체에요."
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
      <button type="button" onClick={decrement}>
        -
      </button>
      <button type="button" onClick={increment}>
        +
      </button>
      <button type="button" onClick={reset}>
        초기화
      </button>
    </div>
  );
}
```
