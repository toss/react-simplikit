# useCallbackOncePerRender

`useCallbackOncePerRender` is a React hook that ensures a callback function is executed only once, regardless of how many times it's called. This is useful for one-time operations that should not be repeated, even if the component re-renders.

## Interface

```ts
function useCallbackOncePerRender(
  callback: () => void,
  deps: DependencyList
): (...args: any[]) => void;
```

### Parameters

<Interface
  required
  name="callback"
  type="() => void"
  description="The callback function to be executed once."
/>

<Interface
  required
  name="deps"
  type="DependencyList"
  description="Dependencies array that will trigger a new one-time execution when changed."
/>

### Return Value

<Interface
  name=""
  type="(...args: any[]) => void"
  description="memoized function that will only execute once until dependencies change."
/>

## Example

```tsx
import { useCallbackOncePerRender } from 'react-simplikit';

function Component() {
  const handleOneTimeEvent = useCallbackOncePerRender(() => {
    console.log('This will only run once');
  }, []);

  return <button onClick={handleOneTimeEvent}>Click me</button>;
}
```
