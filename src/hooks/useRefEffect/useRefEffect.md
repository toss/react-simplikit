# useRefEffect

`useRefEffect` is a custom hook that helps you set a reference to a specific DOM element and execute a callback whenever the element changes. This hook calls a cleanup function whenever the element changes to prevent memory leaks.

## Interface

```typescript
function useRefEffect<Element extends HTMLElement = HTMLElement>(
  callback: (element: Element) => CleanupCallback | void,
  deps: DependencyList
): (element: Element | null) => void;
```

### Parameters

- `callback` (`(element: Element) => CleanupCallback | void`): A callback function that is executed when the element is set. This function can return a cleanup function.
- `deps` (`DependencyList`): An array of dependencies that define when the callback should be re-executed. The `callback` is re-executed whenever the `deps` change.

### Return Value

- `(element: Element | null) => void`: A function to set the element. Pass this function to the `ref` attribute, and the `callback` will be called whenever the element changes.

## Example

```tsx
import { useRefEffect } from 'reactive-kit';

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

In this example, `useRefEffect` is used to log a message to the console whenever the `div` element is mounted and unmounted.
