# useCounter

`useCounter` is a React hook that manages a numeric counter state with increment, decrement, and reset capabilities. Optionally, you can provide minimum and maximum values to constrain the counter's range.

## Interface

```ts
function useCounter(
  initialValue: number = 0,
  options: UseCounterOptions
): UseCounterReturn;
```

### Parameters

<Interface
  name="initialValue"
  type="number"
  description="Initial value for the counter. Defaults to 0."
/>

<Interface
  required
  name="options"
  type="UseCounterOptions"
  description="The options for the counter."
  :nested="[
    {
      name: 'options.min',
      type: 'number',
      required: false,
      description:
        'Minimum value the counter can reach. If not provided, there is no lower limit.',
    },
    {
      name: 'options.max',
      type: 'number',
      required: false,
      description:
        'Maximum value the counter can reach. If not provided, there is no upper limit.',
    },
    {
      name: 'options.step',
      type: 'number',
      required: false,
      defaultValue: '1',
      description: 'Value to increment or decrement by. Defaults to 1.',
    },
  ]"
/>

### Return Value

<Interface
  name=""
  type="UseCounterReturn"
  description="object with count value and control functions."
  :nested="[
    {
      name: 'count',
      type: 'number',
      required: false,
      description: 'The current count value.',
    },
    {
      name: 'increment',
      type: '() => void',
      required: false,
      description: 'A function to increment the count.',
    },
    {
      name: 'decrement',
      type: '() => void',
      required: false,
      description: 'A function to decrement the count.',
    },
    {
      name: 'reset',
      type: '() => void',
      required: false,
      description: 'A function to reset the count to the initial value.',
    },
    {
      name: 'setCount',
      type: '(value: number | ((prev: number) => number)) => void',
      required: false,
      description:
        'A function to set the count to a specific value or a function that returns a new value.',
    },
  ]"
/>

## Example

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
