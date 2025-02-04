# `useCallbackOnce`

`useCallbackOnce` is a React hook that ensures a callback function is executed only once,  
regardless of how many times it's called. This is particularly useful for one-time operations like  
analytics tracking, initialization code, or any other side effects that should not be repeated.

## Interface

```typescript
function useCallbackOnce<F extends (...args: any[]) => void>(
  callback: F,
  deps: DependencyList
): (...args: Parameters<F>) => void;
```

### Parameters

- `callback`: The function to be executed once. After its first execution, subsequent calls will be ignored.

- `deps`: A dependency array that, when changed, will reset the execution state and allow the callback to fire once again.

### Returns

Returns a function that wraps the original callback and ensures it only executes once until the dependencies change.

## Usage Examples

### Basic Example

Here's an example of tracking a user's first interaction:

```tsx
import { useCallbackOnce } from 'reactive-kit';

function UserInteraction() {
  const trackFirstInteraction = useCallbackOnce(() => {
    analytics.track('first_interaction');
  }, []);

  return <button onClick={trackFirstInteraction}>Interact</button>;
}
```

### With Dependencies

This example shows how to track user visits, resetting when the user ID changes:

```tsx
import { useCallbackOnce } from 'reactive-kit';
import { useEffect } from 'react';

function UserTracker({ userId }: { userId: string }) {
  const trackUserVisit = useCallbackOnce(() => {
    analytics.trackVisit(userId);
  }, [userId]); // Will reset and fire again if userId changes

  useEffect(() => {
    trackUserVisit();
  }, [trackUserVisit]);

  return <div>Tracking user: {userId}</div>;
}
```
