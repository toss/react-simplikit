# useCounter

`useCounter` is a React hook that manages a numeric counter state with increment, decrement, and reset capabilities. Optionally, you can provide minimum and maximum values to constrain the counter's range.

## Interface

```ts
function useCounter(options?: UseCounterOptions): UseCounterReturn;

type UseCounterOptions = {
  initialValue?: number;
  min?: number;
  max?: number;
  step?: number;
};

type UseCounterReturn = {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setCount: (value: number | ((prev: number) => number)) => void;
};
```

### Parameters

<Interface
  name="options"
  type="UseCounterOptions"
  description="Optional configuration for the counter."
  :nested="[
    {
      name: 'initialValue',
      type: 'number',
      description: 'Initial value for the counter. Defaults to 0.',
    },
    {
      name: 'min',
      type: 'number',
      description: 'Minimum value the counter can reach. If not provided, there is no lower limit.',
    },
    {
      name: 'max',
      type: 'number',
      description: 'Maximum value the counter can reach. If not provided, there is no upper limit.',
    },
    {
      name: 'step',
      type: 'number',
      description: 'Value to increment or decrement by. Defaults to 1.',
    }
  ]"
/>

### Return Value

<Interface
  name=""
  type="UseCounterReturn"
  description="An object with count value and control functions."
  :nested="[
    {
      name: 'count',
      type: 'number',
      description: 'Current count value.',
    },
    {
      name: 'increment',
      type: '() => void',
      description: 'Increment the counter by the step amount.',
    },
    {
      name: 'decrement',
      type: '() => void',
      description: 'Decrement the counter by the step amount.',
    },
    {
      name: 'reset',
      type: '() => void',
      description: 'Reset the counter to its initial value.',
    },
    {
      name: 'setCount',
      type: '(value: number | ((prev: number) => number)) => void',
      description: 'Set the counter to a specific value within constraints.',
    }
  ]"
/>

## Example

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
      <span>Quantity: {count}</span>
      <button type="button" onClick={decrement}>-</button>
      <button type="button" onClick={increment}>+</button>
      <button type="button" onClick={reset}>Reset</button>
    </div>
  );
}
```

## Constraints

The hook automatically ensures that the counter stays within the specified bounds:

- When incrementing beyond `max`, the value will stay at `max`
- When decrementing below `min`, the value will stay at `min`
- When using `setCount`, any value outside the bounds will be adjusted to the nearest boundary
