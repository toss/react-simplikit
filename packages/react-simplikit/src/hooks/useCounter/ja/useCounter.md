# useCounter

`useCounter` は、増加、減少、リセットの操作とともに数値カウンターの状態を管理する React フックです。
必要に応じて最小値と最大値を指定し、カウンターの範囲を制限できます。

## インターフェース

```ts
function useCounter(
  initialValue: number = 0,
  options: UseCounterOptions
): UseCounterReturn;
```

### パラメータ

<Interface
  name="initialValue"
  type="number"
  description="カウンターの初期値です。デフォルトは 0 です。"
/>

<Interface
  required
  name="options"
  type="UseCounterOptions"
  description="カウンターのオプション。"
  :nested="[
    {
      name: 'options.min',
      type: 'number',
      required: false,
      description:
        'カウンターが取り得る最小値です。指定しない場合、下限はありません。',
    },
    {
      name: 'options.max',
      type: 'number',
      required: false,
      description:
        'カウンターが取り得る最大値です。指定しない場合、上限はありません。',
    },
    {
      name: 'options.step',
      type: 'number',
      required: false,
      defaultValue: '1',
      description: '増減させる値です。デフォルトは 1 です。',
    },
  ]"
/>

### 戻り値

<Interface
  name=""
  type="UseCounterReturn"
  description="カウンターの値と操作用の関数を含むオブジェクト。"
  :nested="[
    {
      name: 'count',
      type: 'number',
      required: false,
      description: '現在のカウンターの値。',
    },
    {
      name: 'increment',
      type: '() => void',
      required: false,
      description: 'カウンターの値を増やす関数。',
    },
    {
      name: 'decrement',
      type: '() => void',
      required: false,
      description: 'カウンターの値を減らす関数。',
    },
    {
      name: 'reset',
      type: '() => void',
      required: false,
      description: 'カウンターを初期値にリセットする関数。',
    },
    {
      name: 'setCount',
      type: '(value: number | ((prev: number) => number)) => void',
      required: false,
      description:
        '特定の値、または新しい値を返す関数を渡して、カウンターの値を設定する関数。',
    },
  ]"
/>

## 使用例

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
