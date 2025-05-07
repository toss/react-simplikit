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
  description="Options for the <code>IntersectionObserver</code>."
  :nested="[
            {
                     name: 'options.root',
type: 'boolean',
required: false,
description: 'The element that is used as the viewport for checking visibility of the target.'
            },
{
                     name: 'options.rootMargin',
type: 'string',
required: false,
description: 'Margin around the root.'
            },
{
                     name: 'options.threshold',
type: 'number | number[]',
required: false,
description: 'Either a single number or an array of numbers which indicate at what percentage of the target's visibility the observer's callback should be executed.'
            }
          ]"
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
