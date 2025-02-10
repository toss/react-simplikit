# useImpressionRef

`useImpressionRef` is a custom hook that measures the time a specific DOM element is visible on the screen and executes callbacks when the element enters or exits the viewport. This hook uses [useIntersectionObserver](./useIntersectionObserver) and the [useVisibilityEvent](./useVisibilityEvent) to track the element's visibility.

## Interface

```typescript
function useImpressionRef<Element extends HTMLElement = HTMLElement>(
  options: UseImpressionRefOptions
): (element: Element | null) => void;
```

### Parameters

- `options` (`UseImpressionRefOptions`): An options object for tracking the element's visibility.
  - `onImpressionStart`: Callback function executed when the element enters the view
  - `onImpressionEnd`: Callback function executed when the element exits the view
  - `timeThreshold`: Minimum time the element must be visible (in milliseconds)
  - `areaThreshold`: Minimum ratio of the element that must be visible (0 to 1)
  - `rootMargin`: Margin to adjust the detection area

### Return Value

- `(element: Element | null) => void`: A function to set the element. Attach this function to the `ref` attribute, and the callbacks will be executed whenever the element's visibility changes.

## Example

```tsx
import { useImpressionRef } from 'reactive-kit';

function Component() {
  const ref = useImpressionRef<HTMLDivElement>({
    onImpressionStart: () => console.log('Element entered view'),
    onImpressionEnd: () => console.log('Element exited view'),
    timeThreshold: 1000,
    areaThreshold: 0.5,
  });

  return <div ref={ref}>Track my visibility!</div>;
}
```

In this example, `useImpressionRef` is used to log a message to the console whenever the `div` element enters or exits the viewport.
