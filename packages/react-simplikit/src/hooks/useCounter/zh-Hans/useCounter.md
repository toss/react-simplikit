# useCounter

`useCounter` 是一个管理数值计数器状态、并提供递增、递减和重置能力的 React Hook。你可以选择提供最小值和最大值来约束计数器的范围。

## 接口

```ts
function useCounter(
  initialValue: number = 0,
  options: UseCounterOptions
): UseCounterReturn;
```

### 参数

<Interface
  name="initialValue"
  type="number"
  description="计数器的初始值。默认为 0。"
/>

<Interface
  required
  name="options"
  type="UseCounterOptions"
  description="计数器的选项。"
  :nested="[
    {
      name: 'options.min',
      type: 'number',
      required: false,
      description:
        '计数器可以达到的最小值。如果未提供，则没有下限。',
    },
    {
      name: 'options.max',
      type: 'number',
      required: false,
      description:
        '计数器可以达到的最大值。如果未提供，则没有上限。',
    },
    {
      name: 'options.step',
      type: 'number',
      required: false,
      defaultValue: '1',
      description: '递增或递减的值。默认为 1。',
    },
  ]"
/>

### 返回值

<Interface
  name=""
  type="UseCounterReturn"
  description="包含计数值和控制函数 的对象。"
  :nested="[
    {
      name: 'count',
      type: 'number',
      required: false,
      description: '当前的计数值。',
    },
    {
      name: 'increment',
      type: '() => void',
      required: false,
      description: '递增计数的函数。',
    },
    {
      name: 'decrement',
      type: '() => void',
      required: false,
      description: '递减计数的函数。',
    },
    {
      name: 'reset',
      type: '() => void',
      required: false,
      description: '将计数重置为初始值的函数。',
    },
    {
      name: 'setCount',
      type: '(value: number | ((prev: number) => number)) => void',
      required: false,
      description:
        '将计数设置为特定值，或设置为返回新值的函数的函数。',
    },
  ]"
/>

## 示例

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
