# useTimeout

`useTimeout` is a React hook that executes a callback function after a specified delay.  
It manages `window.setTimeout` in accordance with the React lifecycle, ensuring cleanup when dependencies change or the component unmounts.

## Interface

```typescript
function useTimeout(callback: () => void, delay?: number): void;
```

### Parameters

- `callback` (`() => void`): The function to be executed after the delay.
- `delay` (`number`, optional): The time in milliseconds to wait before executing the callback. Defaults to `0`.  

### Returns

This hook doesn't return any value.

## Examples

### Basic Usage

```tsx
import { useTimeout } from 'reactive-kit';

function Notification() {
  const [visible, setVisible] = useState(true);

  useTimeout(() => {
    setVisible(false);
  }, 3000); // Hide notification after 3 seconds

  if (!visible) return null;
  return <div>This notification will disappear in 3 seconds</div>;
}
```

### Conditional Timer

```tsx
function ConditionalTimer({ shouldStart }: { shouldStart: boolean }) {
  useTimeout(
    () => {
      console.log('Timer completed!');
    },
    shouldStart ? 2000 : undefined
  );

  return <div>Timer {shouldStart ? 'started' : 'stopped'}</div>;
}
```
