# usePreservedCallback

`usePreservedCallback` is a React hook that helps you preserve the reference of a callback function while ensuring it always uses the latest state.

## Interface

```typescript
function usePreservedCallback<Argument = any, ReturnValue = unknown>(
  callback: (...args: Argument[]) => ReturnValue
): (...args: Argument[]) => ReturnValue;
```

### Parameters

- `callback`: A callback function that will always reference the latest state. Its reference remains the same even when the component re-renders.

### Returns

Returns a function with the same shape as the callback. The returned function ensures it always uses the latest state while maintaining the same reference, which helps prevent unnecessary re-renders.

## Usage Examples

### Basic Example

Here is an example where the button click increments a counter while logging the current count.

```tsx
import { usePreservedCallback } from 'reactive-kit';
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  // Create a callback that safely references the latest `count` value
  const handleClick = usePreservedCallback(() => {
    console.log(`Current count: ${count}`);
    setCount(count + 1);
  });

  return <button onClick={handleClick}>Click me</button>;
}
```

### Passing Callbacks Between Components

This example demonstrates how a parent component can pass a callback to a child component while preserving its reference.

```tsx
import { usePreservedCallback } from 'reactive-kit';
import { useState } from 'react';

function Parent() {
  const [count, setCount] = useState(0);

  // Create a callback that safely updates the count
  const increment = usePreservedCallback(() => {
    setCount(prev => prev + 1);
  });

  return <Child onIncrement={increment} />;
}

function Child({ onIncrement }: { onIncrement: () => void }) {
  return <button onClick={onIncrement}>Increment</button>;
}
```
