# usePreservedCallback

`usePreservedCallback` is a React hook that preserves the reference of a given callback function while the component is mounted. It ensures the callback reference remains stable unless the callback logic changes.

## Interface

```ts
function usePreservedCallback<Callback extends (...args: any[]) => any>(callback: Callback): Callback;
```

### Parameters

- `callback` (`Callback`): The callback function whose reference needs to be preserved.

### 반환 값

Returns the preserved callback with the same type as the input `Callback`.

## Examples

```tsx
import { usePreservedCallback } from '@tossteam/react';

function Component() {
  const preservedCallback = usePreservedCallback(() => {
    console.log('Callback preserved');
  });

  return <button onClick={preservedCallback}>Click Me</button>;
}
```
