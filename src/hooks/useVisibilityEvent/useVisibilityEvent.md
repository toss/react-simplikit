# useVisibilityEvent

`useVisibilityEvent` is a React hook that helps detect and handle changes in the document's visibility state.

## Interface

```ts
function useVisibilityEvent(
  callback: (visibilityState: 'visible' | 'hidden') => void,
  options: { immediate?: boolean }
): void;
```

### Parameters

- `callback ((visibilityState: 'visible' | 'hidden') => void)`:
  A callback function invoked when the visibility state changes.  
  Receives the current visibility state (`'visible'` | `'hidden'`) as its argument.

- `options ({ immediate?: boolean })` (optional):  
  - `immediate` (`boolean`):  
    - If `true`, the hook executes the callback immediately upon mounting with the current visibility state. Defaults to `false`.

### Returns

This hook does not return any value.

## Examples

```tsx
import { useVisibilityEvent } from 'reactive-kit';

function Component() {
  useVisibilityEvent(visibilityState => {
    console.log(`Document is now ${visibilityState}`);
  });

  return (
    <div>
      <p>Check the console for visibility changes.</p>
    </div>
  );
}
```
