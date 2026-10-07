# useCallbackOnce

`useCallbackOnce` is a React hook that runs a callback only once until `deps` change, no matter how many times the returned function is called.
This is useful for one-time operations that should not be repeated, even if the component re-renders.
In v0 this hook was named `useCallbackOncePerRender`. The old name still works but is deprecated.

## Interface

```ts
function useCallbackOnce<F extends (...args: any[]) => void>(
  callback: F,
  deps: DependencyList
): (...args: Parameters<F>) => void;
```

### Parameters

<Interface
  required
  name="callback"
  type="F"
  description="The callback function to be executed once. It receives the arguments passed to the returned function."
/>

<Interface
  required
  name="deps"
  type="DependencyList"
  description="Dependencies array. When it changes, the returned function can run the callback once more."
/>

### Return Value

<Interface
  name=""
  type="(...args: Parameters<F>) => void"
  description="A function whose reference never changes. It runs the callback only once until <code>deps</code> change."
/>

## Example

```tsx
import { useCallbackOnce } from 'react-simplikit';

function Component() {
  const handleOneTimeEvent = useCallbackOnce(() => {
    console.log('This will only run once');
  }, []);

  return <button onClick={handleOneTimeEvent}>Click me</button>;
}
```

```tsx
// With dependencies
function TrackingComponent({ userId }: { userId: string }) {
  const trackUserVisit = useCallbackOnce(() => {
    analytics.trackVisit(userId);
  }, [userId]);

  useEffect(() => {
    trackUserVisit();
  }, [trackUserVisit, userId]);

  return <div>User page</div>;
}
```
