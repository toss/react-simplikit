# useTimeout

`useTimeout` is a React hook that executes a callback function after a specified delay.
It manages `setTimeout` in accordance with the React lifecycle, ensuring cleanup on unmount or when dependencies change.

## Interface

```ts
function useTimeout(options: Object): void;
```

### Parameters

<Interface
  required
  name="options"
  type="Object"
  description="Configures the timeout behavior."
  :nested="[
    {
      name: 'options.onTimeout',
      type: '() => void',
      required: true,
      description: 'The function to be executed after the delay.',
    },
    {
      name: 'options.delayMs',
      type: 'number',
      required: false,
      defaultValue: '0',
      description:
        'The time in milliseconds to wait before executing <code>onTimeout</code>.',
    },
  ]"
/>

### Return Value

This function does not return anything.

## Example

```tsx
// Updating a title after a delay
import { useTimeout } from 'react-simplikit';
import { useState } from 'react';

function Example() {
  const [title, setTitle] = useState('');

  useTimeout({
    onTimeout: () => setTitle('Searching for products...'),
    delayMs: 2000,
  });

  useTimeout({
    onTimeout: () => setTitle('Almost done...'),
    delayMs: 4000,
  });

  return <div>{title}</div>;
}
```
