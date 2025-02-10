# useIntersectionObserver

`useIntersectionObserver` is a custom hook that detects whether a specific DOM element is visible on the screen. This hook uses the `IntersectionObserver` API to execute a callback when the element enters or exits the viewport.

## Interface

```typescript
function useIntersectionObserver<Element extends HTMLElement>(
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit
): (element: Element | null) => void;
```

### Parameters

- `callback` (`(entry: IntersectionObserverEntry) => void`)

  - A callback function that is executed when the visibility of the element changes.
  - You can check `entry.isIntersecting` to determine if the element is in view.

- `options` (`IntersectionObserverInit`):
  - Options for the [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver#options).
  - You can specify values such as:
    - `root`: The viewport or a specific element to observe (`null` for the default viewport)
    - `rootMargin`: Margin around the root to adjust the detection area (e.g., `"0px 0px -50px 0px"`)
    - `threshold`: The percentage of the element's visibility required to trigger the callback (e.g., `0.5` for 50% visibility)

### Return Value

- `(element: Element | null) => void`
  - A function to set the element. Attach this function to the `ref` attribute, and the `callback` will be executed whenever the element's visibility changes.

## Example

```tsx
import { useIntersectionObserver } from 'reactive-kit';

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

In this example, `useIntersectionObserver` is used to log a message to the console whenever the `div` element enters or exits the viewport.
