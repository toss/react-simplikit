# useRefEffect

`useRefEffect` is a React hook that helps you set a reference to a specific DOM element and execute a callback whenever the element changes. This hook calls a cleanup function whenever the element changes to prevent memory leaks.

## Interface

```ts
function useRefEffect(
  callback: (element: Element) => CleanupCallback | void,
  deps: DependencyList
): (element: Element | null) => void;
```

### Parameters

<Interface
  required
  name="callback"
  type="(element: Element) => CleanupCallback | void"
  description="A callback function that is executed when the element is set. This function can return a cleanup function."
/>

<Interface
  required
  name="deps"
  type="DependencyList"
  description="An array of dependencies that define when the callback should be re-executed. The <code>callback</code> is re-executed whenever the <code>deps</code> change."
/>

### Return Value

<Interface
  name=""
  type="(element: Element | null) => void"
  description="function to set the element. Pass this function to the <code>ref</code> attribute, and the <code>callback</code> will be called whenever the element changes."
/>

## Example

```tsx
import { useRefEffect } from 'react-simplikit';

function Component() {
  const ref = useRefEffect<HTMLDivElement>(element => {
    console.log('Element mounted:', element);

    return () => {
      console.log('Element unmounted:', element);
    };
  }, []);

  return <div ref={ref}>Basic Example</div>;
}
```
