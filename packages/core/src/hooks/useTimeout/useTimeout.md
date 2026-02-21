# useTimeout

`useTimeout` is a React hook that executes a callback function after a specified delay. It manages `window.setTimeout` in accordance with the React lifecycle, ensuring cleanup on unmount or when dependencies change.

## Interface

```ts
function useTimeout(callback: () => void, delay: number = 0): void;
```

### Parameters

<Interface
  required
  name="callback"
  type="() => void"
  description="The function to be executed after the delay."
/>

<Interface
  name="delay"
  type="number"
  description="The time in milliseconds to wait before executing the callback."
/>

### Return Value

This hook does not return anything.

## Example

```tsx
// Updating a title after a delay
import { useTimeout } from 'react-simplikit';
import { useState } from 'react';

function Example() {
  const [title, setTitle] = useState('');

  useTimeout(() => {
    setTitle('Searching for products...');
  }, 2000);

  useTimeout(() => {
    setTitle('Almost done...');
  }, 4000);

  return <div>{title}</div>;
}
```
