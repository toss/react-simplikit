# usePreservedCallback

`usePreservedCallback` is a React hook that maintains a stable reference to a callback function
while ensuring it always has access to the latest state or props. This prevents unnecessary re-renders
and simplifies dependency management when passing callbacks to child components or handling event listeners.

## Interface

```ts
function usePreservedCallback<
  Arguments extends unknown[] = unknown[],
  ReturnValue = unknown,
>(callback: (...args: unknown[]) => unknown): (...args: unknown[]) => unknown;
```

### Parameters

<Interface
  required
  name="callback"
  type="(...args: unknown[]) => unknown"
  description="The function to preserve. It always references the latest state or props, even when the component re-renders."
/>

### Return Value

<Interface
  name=""
  type="(...args: unknown[]) => unknown"
  description="A function with the same signature as the input callback. The returned function maintains a stable reference while accessing the latest state or props."
/>

## Example

```tsx
import { usePreservedCallback } from 'react-simplikit';
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = usePreservedCallback(() => {
    console.log(`Current count: ${count}`);
    setCount(prev => prev + 1);
  });

  return <button onClick={handleClick}>Click me</button>;
}
```
