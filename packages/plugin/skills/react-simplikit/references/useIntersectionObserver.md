# useIntersectionObserver

`useIntersectionObserver` is a React hook that detects whether a specific DOM element is visible on the screen. It uses the `IntersectionObserver` API to execute a callback when the element enters or exits the viewport.

## Interface

```ts
function useIntersectionObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit
): (element: Element | null) => void;
```

### Parameters

<Interface
  required
  name="callback"
  type="(entry: IntersectionObserverEntry) => void"
  description="A callback function that is executed when the visibility of the element changes. You can check <code>entry.isIntersecting</code> to determine if the element is in view."
/>

<Interface
  required
  name="options"
  type="IntersectionObserverInit"
  description="Options for the <code>IntersectionObserver</code>. You can specify values such as <code>root</code>, <code>rootMargin</code>, and <code>threshold</code>."
/>

### Return Value

<Interface
  name=""
  type="(element: Element | null) => void"
  description="function to set the element. Attach this function to the <code>ref</code> attribute, and the <code>callback</code> will be executed whenever the element's visibility changes."
/>

## Example

```tsx
import { useIntersectionObserver } from 'react-simplikit';

function Component() {
  const ref = useIntersectionObserver<HTMLDivElement>(
    entry => {
      if (entry.isIntersecting) {
        console.log('Element is in view:', entry.target);
      } else {
        console.log('Element is out of view:', entry.target);
      }
    },
    { threshold: 0.5 }
  );

  return <div ref={ref}>Observe me!</div>;
}
```
