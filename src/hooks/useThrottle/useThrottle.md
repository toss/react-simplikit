# useThrottle

`useThrottle` is a React hook that limits the rate at which a function can be called. It is particularly useful for performance optimization in scenarios where frequent function calls are expected, such as when a user is rapidly typing or scrolling.

## Interface

```ts
function useThrottle<F extends (...args: any[]) => any>(
  callback: F,
  wait: number,
  options?: ThrottleOptions
): F & { cancel: () => void };
```

### Parameters

- `callback` (`F`): The function to be executed at the specified interval.
- `wait` (`number`): The interval in milliseconds at which the function should be executed.
- `options` (`ThrottleOptions`, optional):
  - `leading` (`boolean`): If true, the function is invoked on the leading edge of the timeout. Defaults to false.
  - `trailing` (`boolean`): If true, the function is invoked on the trailing edge of the timeout. Defaults to true.

### Returns

- Returns an object containing the throttled function and a `cancel` method.
- The `cancel()` method can be called to cancel any pending executions.

## Example

```tsx
import { useThrottle } from 'reactive-kit';
import { useEffect } from 'react';

function ThrottledComponent() {
  const handleScroll = useThrottle(() => {
    console.log('Scroll event');
  }, 200);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      handleScroll.cancel();
    };
  }, [handleScroll]);

  return <div>Scroll the page!</div>;
}
```
