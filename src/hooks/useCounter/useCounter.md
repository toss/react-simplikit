# useCounter

`useCounter` is a React hook that manages a numeric counter state with increment, decrement, and reset capabilities. Optionally, you can provide minimum and maximum values to constrain the counter's range.

## Interface

```ts
function useCounter(options: UseCounterOptions): UseCounterReturn;
```

### Parameters

<Interface
  required
  name="options"
  type="UseCounterOptions"
  description="The options for the counter."
  :nested="[
    {
      name: 'options.initialValue',
      type: 'number',
      required: false,
      defaultValue: '0',
      description: 'Initial value for the counter. Defaults to 0.',
    },
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
