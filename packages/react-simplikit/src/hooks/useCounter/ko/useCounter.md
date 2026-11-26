# useCounter

`useCounter`는 증가, 감소, 재설정 기능이 있는 숫자 카운터 상태를 관리하는 리액트 훅이에요. 필요하면 최소값과 최대값을 지정해 카운터의 범위를 제한할 수 있어요.

## 인터페이스

```ts
function useCounter(
  initialValue: number = 0,
  options?: UseCounterOptions
): UseCounterReturn;
```

### 파라미터

<Interface
  name="initialValue"
  type="number"
  description="카운터의 초기값이에요. 기본값은 0이에요."
/>

<Interface
  name="options"
  type="UseCounterOptions"
  description="카운터의 옵션이에요."
  :nested="[
    {
      name: 'options.min',
      type: 'number',
      required: false,
      description:
        '카운터가 도달할 수 있는 최소값이에요. 지정하지 않으면 하한이 없어요.',
    },
    {
      name: 'options.max',
      type: 'number',
      required: false,
      description:
        '카운터가 도달할 수 있는 최대값이에요. 지정하지 않으면 상한이 없어요.',
    },
    {
      name: 'options.step',
      type: 'number',
      required: false,
      defaultValue: '1',
      description: '한 번에 증가하거나 감소하는 값이에요. 기본값은 1이에요.',
    },
  ]"
/>

### 반환 값

<Interface
  name=""
  type="UseCounterReturn"
  description="카운트 값과 카운트를 바꾸는 액션을 담은 튜플이에요."
  :nested="[
    {
      name: 'count',
      type: 'number',
      required: false,
      description: '현재 카운트 값이에요.',
    },
    {
      name: 'actions.increment',
      type: '() => void',
      required: false,
      description: '카운트를 증가시키는 함수예요.',
    },
    {
      name: 'actions.decrement',
      type: '() => void',
      required: false,
      description: '카운트를 감소시키는 함수예요.',
    },
    {
      name: 'actions.reset',
      type: '() => void',
      required: false,
      description: '카운트를 초기값으로 재설정하는 함수예요.',
    },
    {
      name: 'actions.setCount',
      type: '(value: number | ((prev: number) => number)) => void',
      required: false,
      description:
        '카운트를 특정 값으로 설정하거나, 이전 카운트를 받아 다음 값을 반환하는 함수로 갱신하는 함수예요.',
    },
  ]"
/>

## 예시

```tsx
import { useCounter } from 'react-simplikit';

function ShoppingCart() {
  const [count, { increment, decrement, reset }] = useCounter(1, {
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
        재설정
      </button>
    </div>
  );
}
```
