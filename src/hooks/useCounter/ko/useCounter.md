# useCounter

`useCounter`는 숫자 카운터 상태를 증가, 감소, 초기화 기능과 함께 관리하는 리액트 훅이에요. 선택적으로, 카운터의 범위를 제한하기 위해 최소 및 최대값을 제공할 수 있어요.

## Interface

```ts
function useCounter(
  initialValue?: number,
  options?: UseCounterOptions
): UseCounterReturn;
```

### 파라미터

<Interface
  name="initialValue"
  type="number"
  required={false}
  defaultValue="0"
  description="카운터의 초기값이에요. 기본값은 0이에요."
/>

<Interface
  name="options"
  type="UseCounterOptions"
  required={false}
  description="카운터의 옵션이에요."
  :nested="[
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
      description: '증가 또는 감소의 단위 값이에요. 기본값은 1이에요.',
    },
  ]"
/>

### 반환 값

<Interface
  name=""
  type="UseCounterReturn"
  description="카운트 값과 제어 함수들이 포함된 객체에요."
  :nested="[
    {
      name: 'count',
      type: 'number',
      required: false,
      description: '현재 카운트 값이에요.',
    },
    {
      name: 'increment',
      type: '() => void',
      required: false,
      description: '카운트를 증가시키는 함수에요.',
    },
    {
      name: 'decrement',
      type: '() => void',
      required: false,
      description: '카운트를 감소시키는 함수에요.',
    },
    {
      name: 'reset',
      type: '() => void',
      required: false,
      description: '카운트를 초기 값으로 리셋하는 함수에요.',
    },
    {
      name: 'setCount',
      type: '(value: number | ((prev: number) => number)) => void',
      required: false,
      description:
        '카운트를 특정 값으로 설정하거나 새로운 값을 반환하는 함수에요.',
    },
  ]"
/>

## 예시

```tsx
import { useCounter } from 'react-simplikit';

function ShoppingCart() {
  const { count, increment, decrement, reset } = useCounter(1, {
    min: 1,
    max: 10,
  });

  return (
    <div>
      <span>Quantity: {count}</span>
      <button type="button" onClick={decrement}>
        -
      </button>
      <button type="button" onClick={increment}>
        +
      </button>
      <button type="button" onClick={reset}>
        Reset
      </button>
    </div>
  );
}
```
